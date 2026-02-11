const { Client, GatewayIntentBits } = require('discord.js');

/**
 * OpenClaw Skill: Discord Connector
 *
 * Allows agents to post messages to Discord Channels.
 * Prerequisites: Discord Bot Token (DISCORD_TOKEN) in environment.
 */

// Initialize Client (Optional, only if token is present)
const token = process.env.DISCORD_TOKEN;
let client = null;

if (token) {
  client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
  client.login(token).catch(err => console.error("Discord Login Failed:", err));
}

module.exports = {
  name: 'discord-connector',
  description: 'Send messages to Discord channels via Bot API.',

  actions: {
    /**
     * Send a message to a channel.
     * @param {string} channel_id - ID of the Discord channel.
     * @param {string} content - Message text.
     */
    post_to_channel: async ({ channel_id, content }) => {
      if (!client || !client.isReady()) {
        throw new Error("Discord Client not ready. Check DISCORD_TOKEN.");
      }

      const channel = await client.channels.fetch(channel_id);
      if (!channel) {
        throw new Error(`Channel ${channel_id} not found.`);
      }

      const message = await channel.send(content);
      return `Message sent to Discord (ID: ${message.id})`;
    }
  }
};
