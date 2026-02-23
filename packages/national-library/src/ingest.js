// The Scribe: Ingestion Pipeline for the National Library
// Purpose: Converts human knowledge into machine vectors and search index.

const fs = require('fs');
const path = require('path');

class Scribe {
  constructor() {
    this.documents = [];
    this.processed_count = 0;
    this.library_index = {}; // URN -> FilePath Map
    this.search_index = [];  // Full Text Search Index
  }

  async ingestDirectory(dirPath) {
    console.log(`[SCRIBE] Scanning directory: ${dirPath}`);
    const files = this.scanDir(dirPath);

    for (const file of files) {
      if (file.endsWith('.md') && !file.endsWith('.intent.md')) {
        await this.ingest(file);
      }
    }

    this.saveIndex();
    return this.getStats();
  }

  scanDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(this.scanDir(file));
      } else {
        results.push(file);
      }
    });
    return results;
  }

  async ingest(filePath) {
    const raw_text = fs.readFileSync(filePath, 'utf8');
    const { metadata, content } = this.parseFrontmatter(raw_text);

    // Basic Validation (Simulated Guardian)
    if (metadata.max_sentence_years > 7) {
        console.error(`[SCRIBE] REJECTED ${filePath}: Jubilee Violation`);
        return { status: "FAILED" };
    }

    // Indexing
    if (metadata.id) {
      this.library_index[metadata.id] = filePath;

      // Add to Search Index (Simple Tokenizer)
      this.search_index.push({
        id: metadata.id,
        title: metadata.title || "Untitled",
        path: filePath,
        content: content.toLowerCase(), // Simple lowercase normalization
        tags: [metadata.jurisdiction, metadata.type].filter(Boolean)
      });
    }

    this.processed_count++;
    return { status: "SUCCESS" };
  }

  parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { metadata: { title: "Unknown" }, content: text };

    const yamlBlock = match[1];
    const content = match[2];
    const metadata = {};

    yamlBlock.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join(':').trim().replace(/"/g, '');
        if (!isNaN(value) && value !== '') value = Number(value);
        metadata[key] = value;
      }
    });

    return { metadata, content };
  }

  saveIndex() {
    const indexPath = path.join(__dirname, '../dist/library_index.json');
    const data = JSON.stringify(this.search_index, null, 2);
    fs.writeFileSync(indexPath, data);
    console.log(`[SCRIBE] Index saved to ${indexPath} (${this.search_index.length} items)`);
  }

  getStats() {
    return { total_docs: this.processed_count };
  }
}

module.exports = Scribe;
