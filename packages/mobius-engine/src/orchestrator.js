const axios = require('axios');

class MobiusOrchestrator {
  constructor(config = {}) {
    // Endpoints for the Federated APIs
    this.warCouncilUrl = config.warCouncilUrl || 'http://localhost:3001';
    this.chaplaincyUrl = config.chaplaincyUrl || 'http://localhost:3002';
    this.scribesUrl = config.scribesUrl || 'http://localhost:3003';
    this.maxLoops = config.maxLoops || 3;
  }

  /**
   * Orchestrates the Mobius Decision Loop via Federated APIs.
   * Connects ANY Social Group (client) to the Council APIs.
   * @param {string} socialGroup - The name of the client/group (e.g., "The Guild").
   * @param {string} initialProposal - The idea to verify.
   */
  async deliberate(socialGroup, initialProposal) {
    console.log(`\n=== ACTIVATING MOBIUS ORCHESTRATOR (Federated Mode) ===`);
    console.log(`CLIENT: ${socialGroup}`);
    console.log(`INPUT: "${initialProposal}"`);

    let currentProposal = initialProposal;
    let status = "PENDING";
    let iterations = 0;

    while (status === "PENDING" && iterations < this.maxLoops) {
      iterations++;
      console.log(`\n--- MOBIUS LOOP ${iterations} ---`);

      try {
        // 1. Context Phase (Scribes API)
        const scribesRes = await this.callScribes(currentProposal);
        console.log(`[SCRIBES]: ${scribesRes.context}`);

        // 2. Strategy Phase (War Council API)
        const warRes = await this.callWarCouncil(currentProposal, scribesRes.context);
        console.log(`[WAR COUNCIL]: ${warRes.status} - ${warRes.feedback}`);

        // 3. Moral Phase (Chaplaincy API)
        const chapRes = await this.callChaplaincy(currentProposal, scribesRes.context);
        console.log(`[CHAPLAINCY]: ${chapRes.status} - ${chapRes.feedback}`);

        // 4. Synthesis (The Twist)
        if (chapRes.status === "REJECTED" || warRes.status === "REJECTED") {
          console.log(`[MOBIUS] Proposal REJECTED. Analyzing for refinement...`);

          // Simulation of refinement logic based on feedback
          if (currentProposal.includes("Surveillance")) {
            currentProposal = "Implement Privacy-Preserving Anomaly Detection";
            console.log(`[MOBIUS] Refined Proposal: "${currentProposal}"`);
            status = "PENDING";
          } else {
            status = "DEAD";
          }
        } else {
          console.log(`[MOBIUS] Proposal APPROVED by all Councils. Ratifying Edict.`);
          status = "RATIFIED";
        }

      } catch (error) {
        console.error(`[MOBIUS] API Error: ${error.message}`);
        status = "ERROR";
      }
    }

    console.log(`\n=== MOBIUS ORCHESTRATOR TERMINATED ===`);
    console.log(`FINAL STATUS: ${status}`);
    console.log(`FINAL EDICT: "${currentProposal}"`);

    return { status, edict: currentProposal, loops: iterations };
  }

  // API Client Helpers (Mocking axios calls for prototype if servers aren't running)
  async callScribes(topic) {
    // return axios.get(`${this.scribesUrl}/history/context`, { params: { topic } }).then(r => r.data);
    // Simulation:
    if (topic.includes("Surveillance")) return { context: "Warning: Similar initiatives failed in 2022." };
    return { context: "No specific precedent found." };
  }

  async callWarCouncil(proposal, context) {
    // return axios.post(`${this.warCouncilUrl}/strategy/audit`, { proposal, context }).then(r => r.data);
    // Simulation:
    if (proposal.includes("Surrender")) return { status: "REJECTED", feedback: "Weakness detected." };
    return { status: "APPROVED", feedback: "Strategic alignment confirmed." };
  }

  async callChaplaincy(proposal, context) {
    // return axios.post(`${this.chaplaincyUrl}/moral/audit`, { proposal, context }).then(r => r.data);
    // Simulation:
    if (proposal.includes("Surveillance") && !proposal.includes("Privacy-Preserving")) return { status: "REJECTED", feedback: "Violates Privacy." };
    return { status: "APPROVED", feedback: "No moral objection." };
  }
}

module.exports = MobiusOrchestrator;
