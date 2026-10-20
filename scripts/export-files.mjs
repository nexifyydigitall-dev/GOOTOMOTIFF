import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const distDir = path.resolve('dist');

// 1. Run build if dist doesn't exist
if (!fs.existsSync(distDir)) {
  console.log('Running npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
}

const indexPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Find css file
const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
if (cssMatch) {
  const cssHref = cssMatch[1].replace(/^\//, '');
  const cssPath = path.join(distDir, cssHref);
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    html = html.replace(cssMatch[0], `<style>\n${cssContent}\n</style>`);
  }
}

// Find js script
const jsMatch = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
if (jsMatch) {
  const jsSrc = jsMatch[1].replace(/^\//, '');
  const jsPath = path.join(distDir, jsSrc);
  if (fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, 'utf-8');
    html = html.replace(jsMatch[0], `<script type="module">\n${jsContent}\n</script>`);
  }
}

// Ensure download directories
const publicDownloadDir = path.resolve('public/download');
const distDownloadDir = path.resolve('dist/download');
fs.mkdirSync(publicDownloadDir, { recursive: true });
fs.mkdirSync(distDownloadDir, { recursive: true });

// Write standalone files
fs.writeFileSync(path.join(publicDownloadDir, 'index.html'), html, 'utf-8');
fs.writeFileSync(path.join(distDownloadDir, 'index.html'), html, 'utf-8');
fs.writeFileSync(path.resolve('index_standalone.html'), html, 'utf-8');

// Also create ZIP using python3
try {
  execSync(`python3 -c "import zipfile, os
with zipfile.ZipFile('public/download/go_otomotif_website.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('dist'):
        for file in files:
            full_path = os.path.join(root, file)
            if 'go_otomotif_website.zip' not in full_path:
                arcname = os.path.relpath(full_path, 'dist')
                z.write(full_path, arcname)
"`, { stdio: 'inherit' });

  // copy zip to dist/download as well
  if (fs.existsSync(path.join(publicDownloadDir, 'go_otomotif_website.zip'))) {
    fs.copyFileSync(
      path.join(publicDownloadDir, 'go_otomotif_website.zip'),
      path.join(distDownloadDir, 'go_otomotif_website.zip')
    );
  }
  console.log('Export bundle and ZIP created successfully!');
} catch (err) {
  console.warn('ZIP creation error', err);
}
