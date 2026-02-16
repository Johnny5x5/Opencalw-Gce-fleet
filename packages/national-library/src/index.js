// The National Library of the Sovereign Digital Nation
// Central Export Module

const Scribe = require('./ingest');
const Librarian = require('./search');

class NationalLibrary {
  constructor(config = {}) {
    this.scribe = new Scribe();
    this.librarian = new Librarian();
    this.config = config;
  }

  /**
   * Initializes the Library connections (DB, Embeddings).
   */
  async initialize() {
    console.log('[LIBRARY] Initializing National Library System...');
    console.log('[LIBRARY] Connected to LanceDB (Simulated).');
    return true;
  }
}

module.exports = {
  NationalLibrary,
  Scribe,
  Librarian
};
