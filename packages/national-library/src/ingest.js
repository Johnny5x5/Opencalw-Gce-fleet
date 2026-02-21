// The Scribe: Ingestion Pipeline for the National Library
// Purpose: Converts human knowledge into machine vectors.
// Updated: Supports Sovereign Legal Library Schema (YAML Frontmatter + Rust Validation)

const fs = require('fs');
const path = require('path');
// Note: In production, we would import the compiled WASM module here.
// const Guardian = require('library-guardian-wasm');

class Scribe {
  constructor() {
    this.documents = [];
    this.processed_count = 0;
    this.library_index = {}; // URN -> FilePath Map
  }

  /**
   * Ingests a directory recursively (e.g., src/knowledge/library/legal).
   * @param {string} dirPath - The root directory to scan.
   */
  async ingestDirectory(dirPath) {
    console.log(`[SCRIBE] Scanning directory: ${dirPath}`);
    const files = this.scanDir(dirPath);

    for (const file of files) {
      if (file.endsWith('.md') && !file.endsWith('.intent.md')) {
        await this.ingest(file);
      }
    }

    // Generate the Citation Resolver Index
    this.generateIndex();
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

  /**
   * Ingests a raw document.
   * @param {string} filePath - The file path to the document (Markdown/PDF).
   */
  async ingest(filePath) {
    console.log(`[SCRIBE] Ingesting document: ${filePath}`);

    // 1. Read File
    const raw_text = fs.readFileSync(filePath, 'utf8');

    // 2. Metadata Extraction (Frontmatter Parsing)
    const { metadata, content } = this.parseFrontmatter(raw_text);

    // 3. Schema Validation (The Guardian)
    // In production: await Guardian.validate_law(JSON.stringify(metadata));
    const validationResult = this.mockGuardianValidation(metadata);
    if (!validationResult.valid) {
      console.error(`[SCRIBE] Validation Failed for ${filePath}: ${validationResult.error}`);
      return { status: "FAILED", error: validationResult.error };
    }

    // 4. Indexing (URN Mapping)
    if (metadata.id) {
      this.library_index[metadata.id] = filePath;
    }

    // 5. Chunking & Embedding (Simulated)
    const chunks = [
      { id: `${metadata.id}_1`, text: content.substring(0, 100), metadata: metadata },
      { id: `${metadata.id}_2`, text: content.substring(100), metadata: metadata }
    ];

    console.log(`[SCRIBE] Vectorizing ${chunks.length} chunks for ${metadata.title}`);

    this.documents.push({ path: filePath, chunks, metadata });
    this.processed_count++;

    return {
      status: "SUCCESS",
      chunks_processed: chunks.length,
      doc_id: metadata.id
    };
  }

  /**
   * Simulates the Rust Guardian validation logic.
   */
  mockGuardianValidation(metadata) {
    // Rule 1: Jubilee Cap
    if (metadata.max_sentence_years > 7) {
        return { valid: false, error: "Jubilee Violation: Max sentence > 7 years." };
    }
    // Rule 2: Intent Requirement
    if (metadata.jurisdiction === "Sovereign" && !metadata.intent_uri) {
        return { valid: false, error: "Intent Violation: Sovereign law missing intent_uri." };
    }
    return { valid: true };
  }

  /**
   * Extracts YAML Frontmatter manually (simple regex).
   */
  parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      // Fallback for non-frontmatter files
      return { metadata: { title: "Unknown", id: "urn:unknown" }, content: text };
    }

    const yamlBlock = match[1];
    const content = match[2];
    const metadata = {};

    yamlBlock.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join(':').trim().replace(/"/g, '');

        // Handle numbers/booleans
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        if (!isNaN(value)) value = Number(value);

        metadata[key] = value;
      }
    });

    return { metadata, content };
  }

  generateIndex() {
    // In production, write this to library-index.json
    console.log(`[SCRIBE] Generated Citation Index with ${Object.keys(this.library_index).length} URNs.`);
  }

  getStats() {
    return {
      total_docs: this.processed_count,
      total_chunks: this.documents.reduce((acc, doc) => acc + doc.chunks.length, 0)
    };
  }
}

module.exports = Scribe;
