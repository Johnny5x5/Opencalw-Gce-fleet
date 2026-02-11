const { google } = require('googleapis');

/**
 * OpenClaw Skill: Google Chat Connector
 *
 * Allows agents to post messages to Google Chat Spaces.
 * Prerequisites: Chat App configured in Google Cloud Console or Webhook URL.
 */

// Initialize API
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/chat.bot'],
});

const chat = google.chat({ version: 'v1', auth });

module.exports = {
  name: 'google-chat-connector',
  description: 'Send messages to Google Chat Spaces.',

  actions: {
    /**
     * Send a message to a space.
     * @param {string} space_name - The resource name of the space (e.g., "spaces/AAAA...").
     * @param {string} text - The message text.
     */
    send_message: async ({ space_name, text }) => {
      const res = await chat.spaces.messages.create({
        parent: space_name,
        requestBody: { text: text },
      });
      return `Message sent to ${space_name}: ${res.data.name}`;
    },

    /**
     * Create a new space (if supported by app configuration).
     * @param {string} display_name - Name of the new space.
     */
    create_space: async ({ display_name }) => {
      // Note: Only works for user credentials or specific app types.
      // Often easier to pre-create spaces and just post to them.
      const res = await chat.spaces.create({
        requestBody: { displayName: display_name, spaceType: 'SPACE' },
      });
      return `Space created: ${res.data.name} (${res.data.displayName})`;
    }
  }
};
