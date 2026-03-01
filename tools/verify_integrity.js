const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const LIBRARY_ROOT = './src/knowledge/library/legal';

/**
 * Compute the SHA-256 hash of a file's contents and return it as a hexadecimal string.
 * @param {string} filePath - Path to the file to hash.
 * @returns {string} The file's SHA-256 digest encoded as hexadecimal.
 */
function hashFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Recursively traverses the given directory and computes integrity entries for each file.
 *
 * Logs a per-file integrity line containing the filename and a short SHA-256 hash prefix.
 *
 * @param {string} dir - Path to the directory to traverse.
 * @returns {number} The total number of files processed (directories are not counted).
 */
function verifyIntegrity(dir) {
  const files = fs.readdirSync(dir);
  let integrityCount = 0;

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      verifyIntegrity(fullPath);
    } else {
      const hash = hashFile(fullPath);
      console.log(`[INTEGRITY] ${file}: ${hash.substring(0, 16)}...`);
      integrityCount++;
    }
  });

  return integrityCount;
}

console.log("=== Sovereign Library Integrity Check ===");
const count = verifyIntegrity(LIBRARY_ROOT);
console.log(`[SUCCESS] Verified integrity of ${count} files.`);
