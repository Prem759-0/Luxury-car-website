const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const outDir = path.join(__dirname, 'out');

// Folders to copy
const foldersToCopy = [
    'assets', 
    'white-car-frame', 
    'Koenigsegg-car-black-frames', 
    'Koenigsegg_red-car-frames'
];
// Files to copy
const filesToCopy = ['index.html', 'styles.css', 'main.js'];

console.log('Starting build process...');

// Create out dir
if (!fs.existsSync(outDir)){
    console.log('Creating out/ directory...');
    fs.mkdirSync(outDir);
}

// Recursive copy function
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Execute File Copy
filesToCopy.forEach(f => {
    const srcPath = path.join(srcDir, f);
    if(fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(outDir, f));
        console.log(`Copied ${f}`);
    } else {
        console.warn(`Warning: File ${f} not found.`);
    }
});

// Execute Folder Copy
foldersToCopy.forEach(f => {
    const srcPath = path.join(srcDir, f);
    if(fs.existsSync(srcPath)) {
        copyRecursiveSync(srcPath, path.join(outDir, f));
        console.log(`Copied folder ${f}`);
    } else {
        console.warn(`Warning: Folder ${f} not found.`);
    }
});

console.log('\n✅ Build complete. All files ready for Vercel in the /out folder.');
