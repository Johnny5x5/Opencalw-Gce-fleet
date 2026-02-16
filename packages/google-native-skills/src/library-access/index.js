const fs = require('fs');
const path = require('path');

const LIBRARY_ROOT = path.resolve(__dirname, '../../../../docs/nation/library');

module.exports = {
  name: 'library-access',
  description: 'Interface for the Librarian Agent to access the National Library (Project Pantheon).',

  actions: {
    /**
     * Retrieves the text of a specific whitepaper or sacred text reference.
     * @param {string} document - The name of the document (e.g., "VOLUME_1_FOUNDATIONS.md" or "BIBLE_OT_ENGLISH.md")
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
     * Simulates a semantic search query against the Library.
     * @param {string} query - The theological or strategic question.
     */
    consult_oracle: async ({ query }) => {
      console.log(`[LIBRARY] Searching for truth regarding: "${query}"`);
      // In production, this hits the Vector DB (LanceDB).
      // For prototype, we return a canned response based on keywords.

      if (query.toLowerCase().includes("steal") || query.toLowerCase().includes("theft")) {
        return {
          source: "BIBLE_OT_ENGLISH.md",
          reference: "Commandment 8",
          text: "Thou shalt not steal."
        };
      }

      return {
        source: "The Iron Scripture",
        reference: "General Wisdom",
        text: "Consult the Constitution and the Log."
      };
    }
  }
};
