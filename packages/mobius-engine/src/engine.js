const { Facilitator } = require('../../council-chamber/src/index');

class MobiusEngine {
  constructor(config = {}) {
    this.facilitator = new Facilitator();
    this.maxLoops = config.maxLoops || 3;
    this.currentLoop = 0;
    this.history = [];
  }

  // Register agents (proxy to facilitator)
  registerAgent(name, role, personality, logic) {
    if (role.includes("Scribe")) this.facilitator.registerScribe(name, role, personality, logic);
    else if (role.includes("General") || role.includes("War")) this.facilitator.registerWarCouncil(name, role, personality, logic);
    else if (role.includes("Chaplain")) this.facilitator.registerChaplain(name, role, personality, logic);
    else this.facilitator.chamber.registerAgent({ name, role, personality, callback: logic });
  }

  /**
   * Runs the Mobius Decision Loop: Idea -> Debate -> Refinement -> Edict.
   * @param {string} initialProposal
   */
  async deliberate(initialProposal) {
    console.log(`\n=== ACTIVATING MOBIUS DECISION ENGINE ===`);
    console.log(`INPUT: "${initialProposal}"`);

    let currentProposal = initialProposal;
    let status = "PENDING";
    let iterations = 0;

    while (status === "PENDING" && iterations < this.maxLoops) {
      iterations++;
      console.log(`\n--- MOBIUS LOOP ${iterations} ---`);

      // 1. Run Council Session (The Twist)
      // Capture the output/consensus from the facilitator (Simulation)
      // In a real system, the facilitator would return a structured object.
      // Here, we simulate the feedback loop by checking the logs (history).

      // Clear chamber history before session to ensure we only analyze THIS loop
      // Note: This is a hack for the simulation. In production, we'd use session IDs.
      const startLogIndex = this.facilitator.chamber.getHistory().length;
      await this.facilitator.session(currentProposal);
      const sessionLog = this.facilitator.chamber.getHistory().slice(startLogIndex);

      // 2. Analyze Outcome (The Reality Check)
      // Check if Chaplain VETOED or if War Council raised concerns.
      const vetoed = sessionLog.some(log => log.includes("VETO") || log.includes("REJECTED"));
      // Only approve if NOT vetoed and IS recommended
      const approved = !vetoed && sessionLog.some(log => log.includes("RECOMMENDED"));

      if (vetoed) {
        console.log(`[MOBIUS] Proposal REJECTED. Analyzing for refinement...`);
        // Simulate refinement logic:
        // If rejected for privacy, pivot to "Secure Privacy-Preserving X".
        if (currentProposal.includes("Surveillance")) {
          currentProposal = "Implement Privacy-Preserving Anomaly Detection";
          console.log(`[MOBIUS] Refined Proposal: "${currentProposal}"`);
          status = "PENDING"; // Loop again with new proposal
        } else {
          status = "DEAD";
        }
      } else if (approved) {
        console.log(`[MOBIUS] Proposal APPROVED. Ratifying Edict.`);
        status = "RATIFIED";
      } else {
        console.log(`[MOBIUS] Consensus unclear. Looping for clarity...`);
      }
    }

    console.log(`\n=== MOBIUS ENGINE TERMINATED ===`);
    console.log(`FINAL STATUS: ${status}`);
    console.log(`FINAL EDICT: "${currentProposal}"`);

    return { status, edict: currentProposal, loops: iterations };
  }
}

module.exports = MobiusEngine;
