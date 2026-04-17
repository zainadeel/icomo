/**
 * SVG parser for IcoMo icon build — category-aware.
 *
 * System icons are monochrome and theme-driven: we strip fill="black", drop
 * inline styles, and let CSS `color` flow in via `currentColor`.
 *
 * Flag icons (and future multi-color categories) must preserve every hex fill
 * and the inline `style` attributes that carry `color(display-p3 ...)` for
 * wide-gamut displays. The `normalize` flags on the category config control
 * which transforms run.
 */
import { readFileSync } from 'node:fs';

/** SVG attribute → JSX attribute mapping */
const ATTR_MAP = {
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'fill-opacity': 'fillOpacity',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'xlink:href': 'xlinkHref',
  'xml:space': 'xmlSpace',
};

const DEFAULT_NORMALIZE = {
  stripStyle: true,
  blackToCurrentColor: true,
  skipBlackAndNoneFills: true,
  collapseWhitespace: true,
};

/**
 * Parse inline `style="a:b;c:d"` into a React-compatible style object literal
 * string, e.g. `{ fill: '#F2F2F2', fillOpacity: 1 }`.
 *
 * We only emit this for flags / multi-color icons — the system path strips
 * style entirely.
 */
function styleAttrToJsxObject(styleValue) {
  // Source may contain duplicate keys (e.g. `fill:#hex; fill:color(display-p3 ...)`)
  // — the second is the wide-gamut P3 variant. JS object literals can't hold
  // both, so we keep the *last* declaration (P3); the SVG `fill="#hex"`
  // attribute on the element itself provides the fallback for browsers that
  // can't parse `color(display-p3 ...)`.
  const map = new Map();
  for (const decl of styleValue.split(';')) {
    const trimmed = decl.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(':');
    if (idx < 0) continue;
    const rawKey = trimmed.slice(0, idx).trim();
    const rawVal = trimmed.slice(idx + 1).trim();
    if (!rawKey || !rawVal) continue;
    const camelKey = rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    map.set(camelKey, rawVal);
  }

  if (!map.size) return null;

  const parts = Array.from(map, ([k, v]) => {
    if (/^-?\d+(\.\d+)?$/.test(v)) return `${k}: ${v}`;
    // Escape single quotes inside values (rare for color strings but safe)
    const escaped = v.replace(/'/g, "\\'");
    return `${k}: '${escaped}'`;
  });
  return `{ ${parts.join(', ')} }`;
}

/**
 * Parse an SVG attribute string into a JSX props object string.
 * Behavior depends on the category `normalize` flags.
 */
function parseAttributes(attrString, normalize) {
  const props = {};
  let styleJsx = null;
  const attrRegex = /([a-zA-Z-:]+)="([^"]*)"/g;
  let match;

  while ((match = attrRegex.exec(attrString)) !== null) {
    const [, key, value] = match;

    // xmlns is never needed on child elements
    if (key === 'xmlns' || key.startsWith('xmlns:')) continue;

    if (key === 'fill' && normalize.skipBlackAndNoneFills) {
      if (value === 'black' || value === 'none') continue;
    }

    if (key === 'style') {
      if (normalize.stripStyle) continue;
      styleJsx = styleAttrToJsxObject(value);
      continue;
    }

    const jsxKey = ATTR_MAP[key] || key;
    props[jsxKey] = value;
  }

  return { props, styleJsx };
}

/** Props object → JS object literal string */
function propsToString(props, styleJsx, keyValue) {
  const entries = Object.entries(props).map(([k, v]) => {
    if (/^-?\d+(\.\d+)?$/.test(v)) return `${k}: ${v}`;
    return `${k}: '${v}'`;
  });
  if (styleJsx) entries.push(`style: ${styleJsx}`);
  entries.push(`key: '${keyValue}'`);
  return `{ ${entries.join(', ')} }`;
}

/**
 * Extract child elements from SVG content and return createElement calls.
 * @param {string} svgContent - raw SVG file content
 * @param {object} [normalize] - normalization flags (defaults to system icon behavior)
 */
export function parseSvgToCreateElements(svgContent, normalize = DEFAULT_NORMALIZE) {
  const innerMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!innerMatch) return [];

  const inner = innerMatch[1].trim();

  // Match self-closing tags: <path ... /> / <rect ... /> etc.
  const elementRegex = /<(\w+)\s+([^/>]*)\/?>/g;
  const elements = [];
  let elMatch;
  let keyIndex = 0;

  while ((elMatch = elementRegex.exec(inner)) !== null) {
    const [, tag, attrString] = elMatch;
    const { props, styleJsx } = parseAttributes(attrString, normalize);
    const key = String.fromCharCode(97 + keyIndex); // a, b, c, ...
    keyIndex++;
    elements.push(`createElement('${tag}', ${propsToString(props, styleJsx, key)})`);
  }

  return elements;
}

/**
 * Extract raw inner SVG content (for sprite / svg-string generation).
 * Applies normalization flags as configured for the category.
 */
export function extractInnerSvg(svgContent, normalize = DEFAULT_NORMALIZE) {
  const innerMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!innerMatch) return '';

  let inner = innerMatch[1].trim();

  if (normalize.collapseWhitespace) {
    inner = inner.replace(/>\s+</g, '><');
  }
  if (normalize.stripStyle) {
    inner = inner.replace(/\s*style="[^"]*"/g, '');
  }
  if (normalize.blackToCurrentColor) {
    inner = inner.replace(/fill="black"/g, 'fill="currentColor"');
  }

  return inner;
}

/**
 * Read and parse an SVG file with category-aware normalization.
 * @param {string} filePath - absolute path to SVG file
 * @param {object} [normalize]
 */
export function parseSvgFile(filePath, normalize = DEFAULT_NORMALIZE) {
  const content = readFileSync(filePath, 'utf-8');
  return {
    elements: parseSvgToCreateElements(content, normalize),
    innerSvg: extractInnerSvg(content, normalize),
  };
}
