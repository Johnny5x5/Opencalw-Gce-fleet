const EventEmitter = require('events');

class CouncilChamber extends EventEmitter {
  constructor() {
    super();
    this.agents = [];
    this.history = [];
  }

  registerAgent(agent) {
    this.agents.push(agent);
    console.log(`[CHAMBER] Agent '${agent.name}' (${agent.role}) has entered the chamber.`);
  }

  async broadcast(sender, message) {
    const log = `[${sender.name}]: ${message}`;
    this.history.push(log);
    console.log(log);

    // Notify all other agents
    for (const agent of this.agents) {
      if (agent.name !== sender.name) {
        await agent.receive(sender, message);
      }
    }
  }

  getHistory() {
    return this.history;
  }
}

class Agent {
  constructor(name, role, personality, callback) {
    this.name = name;
    this.role = role;
    this.personality = personality;
    this.callback = callback; // Function to generate response
  }

  async receive(sender, message) {
    // Determine if agent should respond based on personality/context
    // For simulation, we'll let the Facilitator trigger specific turns.
  }

  async speak(chamber, context) {
    const response = await this.callback(this, context);
    if (response) {
      await chamber.broadcast(this, response);
    }
  }
}

module.exports = { CouncilChamber, Agent };
