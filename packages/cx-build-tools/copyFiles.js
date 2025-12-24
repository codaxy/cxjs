const fs = require("fs");
const path = require("path");

/**
 * Syncs files matching a pattern from source to destination directory.
 * Copies files from src to dest and removes files in dest that don't exist in src.
 * @param {string} srcDir - Source directory path
 * @param {string} destDir - Destination directory path
 * @param {string|RegExp} pattern - File extension (e.g., '.scss') or RegExp to match
 */
function copyFiles(srcDir, destDir, pattern) {
   const matcher =
      typeof pattern === "string" ? (name) => name.endsWith(pattern) : (name) => pattern.test(name);

   // Collect all matching files in src
   const srcFiles = new Set();

   function collectSrcFiles(currentSrc, relativePath) {
      if (!fs.existsSync(currentSrc)) return;
      const entries = fs.readdirSync(currentSrc, { withFileTypes: true });
      for (const entry of entries) {
         const entryRelativePath = path.join(relativePath, entry.name);
         if (entry.isDirectory()) {
            collectSrcFiles(path.join(currentSrc, entry.name), entryRelativePath);
         } else if (matcher(entry.name)) {
            srcFiles.add(entryRelativePath);
         }
      }
   }

   // Copy files from src to dest
   function copyRecursive(currentSrc, currentDest, relativePath) {
      if (!fs.existsSync(currentSrc)) return;
      const entries = fs.readdirSync(currentSrc, { withFileTypes: true });
      for (const entry of entries) {
         const srcPath = path.join(currentSrc, entry.name);
         const destPath = path.join(currentDest, entry.name);
         if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath, path.join(relativePath, entry.name));
         } else if (matcher(entry.name)) {
            fs.mkdirSync(currentDest, { recursive: true });
            fs.copyFileSync(srcPath, destPath);
         }
      }
   }

   // Remove files in dest that don't exist in src
   function removeOrphans(currentDest, relativePath) {
      if (!fs.existsSync(currentDest)) return;
      const entries = fs.readdirSync(currentDest, { withFileTypes: true });
      for (const entry of entries) {
         const destPath = path.join(currentDest, entry.name);
         const entryRelativePath = path.join(relativePath, entry.name);
         if (entry.isDirectory()) {
            removeOrphans(destPath, entryRelativePath);
         } else if (matcher(entry.name) && !srcFiles.has(entryRelativePath)) {
            fs.unlinkSync(destPath);
         }
      }
   }

   collectSrcFiles(srcDir, "");
   copyRecursive(srcDir, destDir, "");
   removeOrphans(destDir, "");
}

module.exports = copyFiles;
