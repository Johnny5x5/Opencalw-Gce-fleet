// The Librarian: Retrieval Engine for the National Library
// Purpose: Serves semantic truth via search.

const fs = require('fs');
const path = require('path');

class Librarian {
  constructor() {
    this.indexPath = path.join(__dirname, '../dist/library_index.json');
    this.index = [];
    this.loadIndex();
  }

  loadIndex() {
    if (fs.existsSync(this.indexPath)) {
      this.index = JSON.parse(fs.readFileSync(this.indexPath, 'utf8'));
    } else {
      console.warn("[LIBRARIAN] Index not found. Please run ingestion first.");
    }
  }

  /**
   * Searches the Library.
   * @param {string} query - The user's question or keyword.
   */
  async search(query) {
    if (!query) return [];

    const term = query.toLowerCase();

    // 1. Exact Match (Title) - Boosted
    const exactMatches = this.index.filter(doc =>
      doc.title.toLowerCase().includes(term)
    ).map(doc => ({ ...doc, score: 1.0 }));

    // 2. Content Match - Standard
    const contentMatches = this.index.filter(doc =>
      doc.content.includes(term) && !exactMatches.find(e => e.id === doc.id)
    ).map(doc => ({ ...doc, score: 0.5 }));

    const results = [...exactMatches, ...contentMatches];
    return results.sort((a, b) => b.score - a.score).slice(0, 5);
  }
}

module.exports = Librarian;
