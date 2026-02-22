const fs = require('fs');
const path = require('path');

const LIBRARY_ROOT = './src/knowledge/library';
const OUTPUT_FILE = './dist/sovereign_codex.html';

class CodexPrinter {
  constructor() {
    this.content = [];
    this.toc = [];
  }

  generate() {
    console.log("[CODEX] Scanning Library...");
    this.scanDir(LIBRARY_ROOT);

    console.log("[CODEX] Generating HTML...");
    const html = this.buildHTML();

    fs.writeFileSync(OUTPUT_FILE, html);
    console.log(`[SUCCESS] Codex generated at: ${OUTPUT_FILE}`);
  }

  scanDir(dir) {
    const list = fs.readdirSync(dir).sort(); // Sort for consistent order
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.scanDir(fullPath);
      } else if (file.endsWith('.md')) {
        this.processFile(fullPath);
      }
    });
  }

  processFile(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { metadata, body } = this.parseFrontmatter(raw);

    if (metadata.title) {
      // Add to Table of Contents
      const anchor = metadata.id ? metadata.id.replace(/:/g, '_') : `doc_${this.toc.length}`;
      this.toc.push({ title: metadata.title, anchor, jurisdiction: metadata.jurisdiction });

      // Add Content
      this.content.push(`
        <article id="${anchor}" class="law-document">
          <header>
            <h2>${metadata.title}</h2>
            <div class="meta">
              ${metadata.id ? `<span><strong>URN:</strong> ${metadata.id}</span>` : ''}
              ${metadata.jurisdiction ? `<span><strong>Jurisdiction:</strong> ${metadata.jurisdiction}</span>` : ''}
              ${metadata.version ? `<span><strong>Version:</strong> ${metadata.version}</span>` : ''}
            </div>
          </header>
          <div class="markdown-body">
            ${this.simpleMarkdown(body)}
          </div>
          <hr class="section-break">
        </article>
      `);
    }
  }

  parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { metadata: { title: "Untitled" }, body: text };

    const yamlBlock = match[1];
    const body = match[2];
    const metadata = {};

    yamlBlock.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        metadata[parts[0].trim()] = parts.slice(1).join(':').trim().replace(/"/g, '');
      }
    });

    return { metadata, body };
  }

  simpleMarkdown(text) {
    // Very basic Markdown parser for the Codex
    return text
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/\n/gim, '<br>');
  }

  buildHTML() {
    const date = new Date().toISOString().split('T')[0];

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>The Codex of the Sovereign Digital Nation</title>
        <style>
          body { font-family: "Georgia", serif; line-height: 1.6; max-width: 800px; margin: 40px auto; color: #1a1a1a; }
          h1, h2, h3 { font-family: "Arial", sans-serif; color: #000; }
          .cover { text-align: center; margin-top: 100px; margin-bottom: 200px; }
          .toc { page-break-after: always; }
          .toc-item { margin-bottom: 5px; }
          .law-document { page-break-inside: avoid; margin-bottom: 40px; }
          .meta { font-size: 0.8em; color: #666; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .meta span { margin-right: 15px; }
          .section-break { border: 0; border-top: 2px solid #000; margin: 50px 0; }
          @media print {
            body { max-width: 100%; margin: 0; padding: 20px; }
            .section-break { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        <div class="cover">
          <h1>THE CODEX</h1>
          <h2>OF THE SOVEREIGN DIGITAL NATION</h2>
          <p>Version 1.0 (Build ${date})</p>
          <p><em>"To build a Nation, you must first build a Library."</em></p>
        </div>

        <div class="toc">
          <h2>Table of Contents</h2>
          ${this.toc.map(item => `
            <div class="toc-item">
              <a href="#${item.anchor}">${item.title}</a>
              ${item.jurisdiction ? `(${item.jurisdiction})` : ''}
            </div>
          `).join('')}
        </div>

        <main>
          ${this.content.join('')}
        </main>
      </body>
      </html>
    `;
  }
}

new CodexPrinter().generate();
