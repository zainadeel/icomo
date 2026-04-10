/**
 * SVG parser for IcoMo icon build
 *
 * Extracts inner content from SVG files and converts to createElement calls.
 * All icons are path-only, fill-based, 16x16.
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

/**
 * Parse an SVG attribute string into a JSX props object string
 * Strips fill="black", style attributes, and xmlns
 */
function parseAttributes(attrString) {
  const props = {};
  // Match key="value" pairs
  const attrRegex = /([a-zA-Z-:]+)="([^"]*)"/g;
  let match;

  while ((match = attrRegex.exec(attrString)) !== null) {
    const [, key, value] = match;

    // Skip fill="black" — we use currentColor from parent SVG
    if (key === 'fill' && (value === 'black' || value === 'none')) continue;
    // Skip inline styles (Figma export artifact)
    if (key === 'style') continue;
    // Skip xmlns
    if (key === 'xmlns' || key.startsWith('xmlns:')) continue;

    const jsxKey = ATTR_MAP[key] || key;
    props[jsxKey] = value;
  }

  return props;
}

/**
 * Convert a props object to a JS object literal string
 */
function propsToString(props, key) {
  const entries = Object.entries(props);
  entries.push(['key', key]);

  const parts = entries.map(([k, v]) => {
    // Numbers stay as numbers
    if (/^-?\d+(\.\d+)?$/.test(v)) {
      return `${k}: ${v}`;
    }
    return `${k}: '${v}'`;
  });

  return `{ ${parts.join(', ')} }`;
}

/**
 * Extract child elements from SVG content and return createElement calls
 * @param {string} svgContent - raw SVG file content
 * @returns {string[]} array of createElement call strings
 */
export function parseSvgToCreateElements(svgContent) {
  // Extract inner content between <svg> tags
  const innerMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!innerMatch) return [];

  const inner = innerMatch[1].trim();

  // Match self-closing elements: <path ... /> or <circle ... /> etc.
  const elementRegex = /<(\w+)\s+([^/>]*)\/?>/g;
  const elements = [];
  let elMatch;
  let keyIndex = 0;

  while ((elMatch = elementRegex.exec(inner)) !== null) {
    const [, tag, attrString] = elMatch;
    const props = parseAttributes(attrString);
    const key = String.fromCharCode(97 + keyIndex); // a, b, c, ...
    keyIndex++;

    elements.push(`createElement('${tag}', ${propsToString(props, key)})`);
  }

  return elements;
}

/**
 * Extract raw inner SVG content (for sprite generation)
 * Strips fill="black" and style attributes, replaces with currentColor
 * @param {string} svgContent - raw SVG file content
 * @returns {string} cleaned inner SVG content
 */
export function extractInnerSvg(svgContent) {
  const innerMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!innerMatch) return '';

  return innerMatch[1]
    .trim()
    .replace(/\s*style="[^"]*"/g, '')
    .replace(/fill="black"/g, 'fill="currentColor"');
}

/**
 * Read and parse an SVG file
 * @param {string} filePath - absolute path to SVG file
 * @returns {{ elements: string[], innerSvg: string }}
 */
export function parseSvgFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return {
    elements: parseSvgToCreateElements(content),
    innerSvg: extractInnerSvg(content),
  };
}
