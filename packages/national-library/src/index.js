// The National Library of the Sovereign Digital Nation
// Central Export Module

const Scribe = require('./ingest');
const Librarian = require('./search');
const FederationProtocol = require('./federation');

class NationalLibrary {
  constructor(config = {}) {
    this.scribe = new Scribe();
    this.librarian = new Librarian();
    this.federation = new FederationProtocol(this);
    this.config = config;
  }

  /**
   * Initializes the Library connections (DB, Embeddings).
   */
  async initialize() {
    console.log('[LIBRARY] Initializing National Library System (v2.0)...');
    console.log('[LIBRARY] Connected to LanceDB (Simulated).');
    console.log('[LIBRARY] Federation Protocol Active (Public Metadata Routing).');
    return true;
  }
}

module.exports = {
  NationalLibrary,
  Scribe,
  Librarian,
  FederationProtocol
};
