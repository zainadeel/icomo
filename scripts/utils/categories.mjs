/**
 * Category configuration for IcoMo icon build.
 *
 * Each category defines:
 *   - dir:        source directory under src/ (e.g. 'icons', 'flags')
 *   - prefix:     PascalCase prefix applied to exported component names
 *                 (e.g. 'Flag' → France.svg becomes FlagFrance). Empty string
 *                 for the default 'system' category so existing icon names
 *                 remain unchanged (ArrowRight stays ArrowRight).
 *   - distDir:    subdirectory under dist/ for per-icon artifacts
 *   - factory:    which React factory the generated components are built from —
 *                 { module, name, propsType, componentType }. Categories that
 *                 share a rendering contract can share a factory; a category
 *                 gets its own only when consumers need to tell it apart at the
 *                 type level (see `map`).
 *   - normalize:  how the SVG pipeline should treat source markup
 *       · stripStyle            — remove inline style="..." (Figma artifact)
 *       · blackToCurrentColor   — replace fill="black" with fill="currentColor"
 *       · skipBlackAndNoneFills — drop fill="black" / fill="none" from React props
 *                                 (implies parent SVG's color flows through)
 *       · collapseWhitespace    — collapse `>\s+<` to `><` (cosmetic, safe)
 *   - colorModel: monochrome icons inherit currentColor; multicolor icons preserve fills
 *   - motion:     static today; reserved so animated categories require an explicit contract
 *
 * Adding a new category = add a new entry here + drop SVGs into src/<dir>/.
 */
export const CATEGORIES = {
  system: {
    id: 'system',
    dir: 'icons',
    prefix: '',
    distDir: 'icons',
    colorModel: 'monochrome',
    motion: 'static',
    factory: {
      module: 'createIcon',
      name: 'createIcon',
      propsType: 'IconProps',
      componentType: 'IconComponent',
    },
    normalize: {
      stripStyle: true,
      blackToCurrentColor: true,
      skipBlackAndNoneFills: true,
      collapseWhitespace: true,
    },
  },
  flag: {
    id: 'flag',
    dir: 'flags',
    prefix: 'Flag',
    distDir: 'flags',
    colorModel: 'multicolor',
    motion: 'static',
    factory: {
      module: 'createFlagIcon',
      name: 'createFlagIcon',
      propsType: 'FlagIconProps',
      componentType: 'FlagIconComponent',
    },
    normalize: {
      // Preserve every fill (hex + P3 color(display-p3 ...) in style attrs)
      stripStyle: false,
      blackToCurrentColor: false,
      skipBlackAndNoneFills: false,
      collapseWhitespace: true,
    },
  },
  // Map icons are monochrome and take `color` exactly like system icons, but
  // they are drawn for use *inside* a marker shape (pin, circle, cluster
  // bubble) rather than inline in UI. IcoMo can't enforce that placement, so
  // the enforcement point is the type: they build from their own factory and
  // carry an `iconCategory: 'map'` brand, letting a downstream
  // <MapMarker icon={...} /> accept map icons only.
  map: {
    id: 'map',
    dir: 'map',
    prefix: 'Map',
    distDir: 'map',
    colorModel: 'monochrome',
    motion: 'static',
    factory: {
      module: 'createMapIcon',
      name: 'createMapIcon',
      propsType: 'MapIconProps',
      componentType: 'MapIconComponent',
    },
    normalize: {
      stripStyle: true,
      blackToCurrentColor: true,
      skipBlackAndNoneFills: true,
      collapseWhitespace: true,
    },
  },
};

/** Ordered list for iteration — keeps output deterministic. */
export const CATEGORY_LIST = [CATEGORIES.system, CATEGORIES.flag, CATEGORIES.map];
