/**
 * Build script for @icomo/icons
 *
 * 1. Generates React components from SVG icon sources
 * 2. Generates barrel index (re-exports all icons)
 * 3. Generates SVG sprite sheet
 */
import { mkdirSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PKG_ROOT, 'src');
const DIST_DIR = path.join(PKG_ROOT, 'dist');

const isWatch = process.argv.includes('--watch');

function clean() {
  if (existsSync(DIST_DIR)) {
    rmSync(DIST_DIR, { recursive: true });
  }
}

function build() {
  const startTime = Date.now();
  console.log('\n🔨 Building @icomo/icons...\n');

  // Step 1: Clean dist
  clean();
  mkdirSync(DIST_DIR, { recursive: true });
  mkdirSync(path.join(DIST_DIR, 'icons'), { recursive: true });

  // Step 2: Generate React components from SVG sources
  console.log('  → Generating React components from SVGs...');
  execSync('node scripts/generate-react-components.mjs', { cwd: PKG_ROOT, stdio: 'inherit' });

  // Step 3: Generate barrel index
  console.log('  → Generating barrel index...');
  execSync('node scripts/generate-barrel.mjs', { cwd: PKG_ROOT, stdio: 'inherit' });

  // Step 4: Generate SVG sprite
  console.log('  → Generating SVG sprite...');
  execSync('node scripts/generate-sprite.mjs', { cwd: PKG_ROOT, stdio: 'inherit' });

  // Step 5: Generate raw SVG string exports for framework-agnostic consumers
  console.log('  → Generating SVG string exports...');
  execSync('node scripts/generate-svg-strings.mjs', { cwd: PKG_ROOT, stdio: 'inherit' });

  // Step 6: Generate meta manifest (aliases + kebab names) for agents / docs
  console.log('  → Generating meta manifest...');
  execSync('node scripts/generate-meta.mjs', { cwd: PKG_ROOT, stdio: 'inherit' });

  const elapsed = Date.now() - startTime;
  console.log(`\n✅ @icomo/icons built in ${elapsed}ms\n`);
}

build();

if (isWatch) {
  console.log('👀 Watching for changes...\n');

  const { watch } = await import('chokidar');

  const watcher = watch(
    [
      path.join(SRC_DIR, 'icons', '*.svg'),
      path.join(SRC_DIR, 'icons', '*.json'),
    ],
    { ignoreInitial: true }
  );

  let debounceTimer = null;
  const rebuild = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log('♻️  Change detected, rebuilding...');
      build();
    }, 200);
  };

  watcher.on('change', rebuild);
  watcher.on('add', rebuild);
  watcher.on('unlink', rebuild);
}
