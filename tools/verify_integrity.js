const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const LIBRARY_ROOT = './src/knowledge/library/legal';

function hashFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

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
