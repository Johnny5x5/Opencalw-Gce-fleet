const { CouncilChamber, Agent } = require('./chamber');

// Facilitator: Manages the 'Council Session' flow.
class Facilitator {
  constructor() {
    this.chamber = new CouncilChamber();
    this.scribes = [];
    this.warCouncil = [];
    this.chaplaincy = [];
  }

  // Register agents
  registerScribe(name, role, personality, logic) {
    const agent = new Agent(name, role, personality, logic);
    this.chamber.registerAgent(agent);
    this.scribes.push(agent);
  }

  registerWarCouncil(name, role, personality, logic) {
    const agent = new Agent(name, role, personality, logic);
    this.chamber.registerAgent(agent);
    this.warCouncil.push(agent);
  }

  registerChaplain(name, role, personality, logic) {
    const agent = new Agent(name, role, personality, logic);
    this.chamber.registerAgent(agent);
    this.chaplaincy.push(agent);
  }

  // Run a session
  async session(topic) {
    console.log(`\n=== CONVENING THE TRI-COUNCIL ===`);
    console.log(`AGENDA: ${topic}\n`);

    // Phase 1: Scribes (Context)
    console.log(`--- Phase 1: The Scribes Consult the Archives ---`);
    for (const scribe of this.scribes) {
      await scribe.speak(this.chamber, { topic, phase: 'CONTEXT' });
    }

    // Phase 2: War Council (Debate)
    console.log(`\n--- Phase 2: The War Council Deliberates ---`);
    for (const general of this.warCouncil) {
      await general.speak(this.chamber, { topic, phase: 'DEBATE' });
    }

    // Phase 3: Chaplaincy (Audit)
    console.log(`\n--- Phase 3: The Chaplain Audits for Morality ---`);
    let vetoed = false;
    for (const chaplain of this.chaplaincy) {
      const response = await chaplain.callback(chaplain, { topic, phase: 'AUDIT', history: this.chamber.getHistory() });
      if (response) {
        await this.chamber.broadcast(chaplain, response);
        if (response.includes("VETO") || response.includes("DENIED")) {
          vetoed = true;
        }
      }
    }

    // Phase 4: Consensus
    console.log(`\n--- Phase 4: The Edict ---`);
    if (vetoed) {
      const msg = `RESULT: The proposal '${topic}' has been REJECTED by the Chaplaincy.`;
      console.log(msg);
      this.chamber.history.push(msg); // Ensure this is captured in history for Mobius Engine
    } else {
      const msg = `RESULT: The proposal '${topic}' is RECOMMENDED to the Sovereign.`;
      console.log(msg);
      this.chamber.history.push(msg); // Ensure this is captured in history for Mobius Engine
    }
  }
}

module.exports = Facilitator;
