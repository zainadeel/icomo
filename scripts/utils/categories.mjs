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
 *   - normalize:  how the SVG pipeline should treat source markup
 *       · stripStyle            — remove inline style="..." (Figma artifact)
 *       · blackToCurrentColor   — replace fill="black" with fill="currentColor"
 *       · skipBlackAndNoneFills — drop fill="black" / fill="none" from React props
 *                                 (implies parent SVG's color flows through)
 *       · collapseWhitespace    — collapse `>\s+<` to `><` (cosmetic, safe)
 *   - themeable:  does the icon respond to a `color` prop? (system=yes, flag=no)
 *
 * Adding a new category = add a new entry here + drop SVGs into src/<dir>/.
 */
export const CATEGORIES = {
  system: {
    id: 'system',
    dir: 'icons',
    prefix: '',
    distDir: 'icons',
    themeable: true,
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
    themeable: false,
    normalize: {
      // Preserve every fill (hex + P3 color(display-p3 ...) in style attrs)
      stripStyle: false,
      blackToCurrentColor: false,
      skipBlackAndNoneFills: false,
      collapseWhitespace: true,
    },
  },
};

/** Ordered list for iteration — keeps output deterministic. */
export const CATEGORY_LIST = [CATEGORIES.system, CATEGORIES.flag];
