const fs = require('fs');
const path = require('path');

const LIBRARY_ROOT = path.resolve(__dirname, '../../../../docs/nation/library');

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
     * Simulates a semantic search query against the Archive.
     * @param {string} query - The civic or strategic question.
     */
    consult_archive: async ({ query }) => {
      console.log(`[ARCHIVE] Searching for record regarding: "${query}"`);
      // In production, this hits the Vector DB (LanceDB).
      // For prototype, we return a canned response based on keywords.

      if (query.toLowerCase().includes("steal") || query.toLowerCase().includes("theft")) {
        return {
          source: "BIBLE_OT_ENGLISH.md",
          reference: "Exodus 20:15",
          text: "Thou shalt not steal."
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
