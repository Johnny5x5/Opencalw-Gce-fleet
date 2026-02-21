const MobiusOrchestrator = require('../../../mobius-engine/src/orchestrator');

const orchestrator = new MobiusOrchestrator();

module.exports = {
  name: 'mobius-access',
  description: 'Interface for interacting with the Mobius Decision Engine (Federated Governance).',

  actions: {
    /**
     * Submits a proposal to the Mobius Engine for deliberation by the Tri-Council.
     * @param {string} proposal - The proposal text.
     * @param {string} group - The name of the proposing social group (default: "Internal Agent").
     */
    deliberate: async ({ proposal, group = "Internal Agent" }) => {
      console.log(`[SKILL: Mobius] Submitting proposal: "${proposal}" from ${group}`);

      const result = await orchestrator.deliberate(group, proposal);

      return {
        status: result.status,
        final_edict: result.edict,
        loops_required: result.loops
      };
    }
  }
};
