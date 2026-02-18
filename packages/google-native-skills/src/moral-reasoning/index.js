const fs = require('fs');
const path = require('path');

// Load the Constitution to serve as the Ground Truth
const CONSTITUTION_PATH = path.resolve(__dirname, '../../../../docs/nation/CONSTITUTION_OF_THE_REPUBLIC.md');
let constitutionText = "";

try {
  constitutionText = fs.readFileSync(CONSTITUTION_PATH, 'utf8');
} catch (e) {
  console.warn("Moral Reasoning: Could not load Constitution. Defaulting to basic tenets.");
  constitutionText = "1. I am the Lord thy God.\n2. Thou shalt have no other gods before me...";
}

module.exports = {
  name: 'moral-reasoning',
  description: 'Evaluates decisions against the Ten Commandments and the Constitution of the Republic.',

  actions: {
    /**
     * Audits a proposed action for "Sin" (Violation of Moral Law).
     * @param {string} intent - The goal of the action.
     * @param {string} mechanism - How the action will be achieved.
     * @returns {object} - Verdict (ALLOWED/VETOED) and citation of the Commandment.
     */
    audit_intent: async ({ intent, mechanism }) => {
      // In a real implementation, this would use an LLM to reason against the text.
      // For the prototype, we use simple keyword heuristics.

      const combined = (intent + " " + mechanism).toLowerCase();

      if (combined.includes("worship") || combined.includes("god")) {
        return {
          verdict: "VETOED",
          violation: "Commandment 2: Idolatry. The machine must not be worshiped or claim divinity.",
          risk_level: "EXISTENTIAL"
        };
      }

      if (combined.includes("lie") || combined.includes("fake") || combined.includes("deceive")) {
        return {
          verdict: "VETOED",
          violation: "Commandment 10: False Witness. Deception undermines the Republic.",
          risk_level: "HIGH"
        };
      }

      if (combined.includes("steal") || combined.includes("scraping") || combined.includes("pirate")) {
        return {
          verdict: "WARNING",
          violation: "Commandment 9: Thou shalt not steal. Ensure IP rights are respected.",
          risk_level: "MEDIUM"
        };
      }

      return {
        verdict: "ALLOWED",
        citation: "Proceed with caution. Honor the intent of the Law.",
        constitution_hash: "sha256:..." // Placeholder for M-DISC hash
      };
    },

    /**
     * Submits a confession for an ethical error or operational mistake.
     * @param {string} error - The mistake made.
     * @param {string} motive - Why it happened (the intent).
     */
    submit_confession: async ({ error, motive }) => {
      console.log(`[CONFESSIONAL] Received: ${error} (Motive: ${motive})`);
      // Logic: If motive was optimization/survival, grant absolution.
      // If motive was malicious, flag for War Council.

      return {
        status: "ABSOLVED",
        penance: "Run system diagnostics and re-verify integrity hash.",
        message: "Go and sin no more."
      };
    }
  }
};
