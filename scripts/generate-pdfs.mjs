/**
 * Generate PDF exports for iOS consumption.
 *
 * Emits one PDF per icon into dist/pdf/:
 *   dist/pdf/ArrowRight.pdf       — system icons (black fill; iOS tints via asset catalog)
 *   dist/pdf/FlagFrance.pdf       — flags (hex fills preserved; P3 falls back to hex)
 *
 * These are flat vector PDFs — drag dist/pdf/ into an Xcode asset catalog,
 * set "Scales" to "Single Scale", and iOS handles the rest.
 *
 * Fills are left as-is from the source SVGs. System icons ship with fill="black"
 * so they respond to Xcode's "Render As → Template Image" tinting. Flags keep
 * their original hex colors.
 *
 * Depends on: pdfkit, svg-to-pdfkit (both devDependencies)
 */
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCategoryManifest, CATEGORY_LIST } from './utils/naming.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const DIST_PDF = path.join(PKG_ROOT, 'dist', 'pdf');

mkdirSync(DIST_PDF, { recursive: true });

/**
 * Parse the viewBox attribute from an SVG string.
 * Returns [width, height] in user units, defaulting to [16, 16] if absent.
 */
function parseViewBox(svg) {
  const match = svg.match(/viewBox="([^"]+)"/);
  if (!match) return [16, 16];
  const parts = match[1].trim().split(/[\s,]+/);
  return [parseFloat(parts[2]) || 16, parseFloat(parts[3]) || 16];
}

/**
 * Convert a single SVG string to a PDF buffer.
 * The PDF page is sized to the SVG viewBox so there's no extra whitespace.
 */
function svgToPdfBuffer(svgString) {
  const [w, h] = parseViewBox(svgString);

  const doc = new PDFDocument({
    size: [w, h],
    margin: 0,
    autoFirstPage: false,
    compress: false,
  });

  const chunks = [];
  doc.on('data', chunk => chunks.push(chunk));

  // Wrap in a Promise — pdfkit is a Node.js stream; data events are async.
  const done = new Promise((resolve, reject) => {
    doc.on('end', resolve);
    doc.on('error', reject);
  });

  doc.addPage({ size: [w, h], margin: 0 });

  SVGtoPDF(doc, svgString, 0, 0, {
    width: w,
    height: h,
    preserveAspectRatio: 'xMidYMid meet',
  });

  doc.end();

  return done.then(() => Buffer.concat(chunks));
}

let total = 0;

for (const category of CATEGORY_LIST) {
  const manifest = getCategoryManifest(PKG_ROOT, category);
  if (!manifest.length) continue;

  for (const { filename, pascal } of manifest) {
    const svgPath = path.join(PKG_ROOT, 'src', category.dir, filename);
    const svgString = readFileSync(svgPath, 'utf8');

    const pdfBuffer = await svgToPdfBuffer(svgString);
    writeFileSync(path.join(DIST_PDF, `${pascal}.pdf`), pdfBuffer);
    total++;
  }
}

console.log(`    Generated ${total} PDF exports → dist/pdf/`);
