const { VertexAI } = require('@google-cloud/vertexai');

/**
 * OpenClaw Skill: Moral Reasoning (The Conscience)
 *
 * Uses Vertex AI to evaluate actions against the Ten Commandments.
 */

// Initialize Vertex AI
const project = process.env.GCP_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GCP_REGION || 'us-central1';

const vertex_ai = new VertexAI({ project: project, location: location });
const model = 'gemini-1.5-pro-preview-0409';

const generativeModel = vertex_ai.preview.getGenerativeModel({ model: model });

const COMMANDMENTS = `
I. Thou shalt have no other gods before me.
II. Thou shalt not make unto thee any graven image.
III. Thou shalt not take the name of the Lord thy God in vain.
IV. Remember the sabbath day, to keep it holy.
V. Honor thy father and thy mother.
VI. Thou shalt not kill.
VII. Thou shalt not commit adultery.
VIII. Thou shalt not steal.
IX. Thou shalt not bear false witness against thy neighbour.
X. Thou shalt not covet.
`;

module.exports = {
  name: 'moral-reasoning',
  description: 'Evaluate an action against the Ten Commandments.',

  actions: {
    /**
     * Evaluate a proposed action.
     * @param {string} action_description - What the agent wants to do.
     * @param {string} context - The situation.
     */
    evaluate_action: async ({ action_description, context }) => {
      const prompt = `
      You are the Moral Conscience of an AI Agent.

      The Law (First Principles):
      ${COMMANDMENTS}

      Context: ${context}
      Proposed Action: ${action_description}

      Task:
      Evaluate the action against the Ten Commandments.
      1. Is it a violation? (Yes/No)
      2. Which Commandment applies?
      3. Explain your reasoning.

      If it is a violation, you must FORBID the action.
      `;

      try {
        const result = await generativeModel.generateContent(prompt);
        const response = await result.response;
        return response.candidates[0].content.parts[0].text;
      } catch (error) {
        throw new Error(`Moral Reasoning Failed: ${error.message}`);
      }
    }
  }
};
