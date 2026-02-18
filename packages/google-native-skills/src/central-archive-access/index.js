const fs = require('fs');
const path = require('path');
const { NationalLibrary } = require('../../../national-library/src/index');

const LIBRARY_ROOT = path.resolve(__dirname, '../../../../docs/nation/library');
const libSystem = new NationalLibrary(); // Initialize the AI-First Library

module.exports = {
  name: 'central-archive-access',
  description: 'Interface for the Archivist Agent to access the National Library (The Central Archive).',

  actions: {
    /**
     * Retrieves the text of a specific whitepaper or public record reference.
     * @param {string} document - The name of the document (e.g., "VOLUME_1_FOUNDATIONS.md" or "CONSTITUTION.md")
     */
    retrieve_document: async ({ document }) => {
      // Security: Prevent directory traversal
      if (document.includes('..') || document.includes('/')) {
        throw new Error("Access Denied: Invalid document path.");
      }

      // Search recursively in the library
      // Note: For this prototype, we assume a known path or search mechanism.
      // We will try a few known locations.
      const locations = [
        path.join(LIBRARY_ROOT, document),
        path.join(LIBRARY_ROOT, 'public_records', document),
        path.join(LIBRARY_ROOT, 'sacred_texts', document),
        path.join(path.resolve(__dirname, '../../../../docs/whitepaper'), document) // Whitepapers live in root docs for now
      ];

      for (const loc of locations) {
        if (fs.existsSync(loc)) {
          const content = fs.readFileSync(loc, 'utf8');

          // Future: Ingest via Scribe automatically if not indexed?
          // await libSystem.scribe.ingest(loc, { source: document });

          return {
            status: "FOUND",
            path: loc,
            content_snippet: content.substring(0, 500) + "..." // Return snippet to save tokens
          };
        }
      }

      return { status: "NOT_FOUND", message: `Document '${document}' not found in the Archives.` };
    },

    /**
     * Executes a semantic search query against the National Library.
     * @param {string} query - The civic or strategic question.
     */
    consult_archive: async ({ query }) => {
      console.log(`[ARCHIVE] Consulted National Library for: "${query}"`);

      // Use the new National Library software module
      // This bridges the gap between raw file access and AI-First vector search.
      await libSystem.initialize();
      const results = await libSystem.librarian.search(query);

      // Return the top result or a fallback
      if (results && results.length > 0) {
        // Simple logic to pick the best result based on query keywords (Mock Logic)
        let bestMatch = results[0];

        // Ensure "Theft" maps to Bible as requested previously, overriding generic search if needed for this demo
        if (query.toLowerCase().includes("steal") || query.toLowerCase().includes("theft")) {
           bestMatch = results.find(r => r.metadata.authority === "Sacred" && r.text.includes("steal")) || results[0];
        }

        return {
          source: bestMatch.metadata.source,
          authority: bestMatch.metadata.authority,
          text: bestMatch.text,
          citation: libSystem.librarian.citation(bestMatch)
        };
      }

      return {
        source: "The Iron Scripture",
        reference: "General Wisdom",
        text: "Consult the Public Records and the Log."
      };
    }
  }
};
