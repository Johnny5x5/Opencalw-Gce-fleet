/**
 * OpenClaw Skill: Outbound Sales Campaign
 *
 * Manages lists of leads and initiates contact via Twilio (SMS/Voice).
 */

const twilio = require('twilio');

// Initialize Twilio Client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

module.exports = {
  name: 'outbound-sales',
  description: 'Execute outbound sales campaigns via SMS or Voice.',

  actions: {
    /**
     * Bulk dial a list of leads.
     * @param {Array<string>} leads - List of phone numbers.
     * @param {string} pitch - The text script to read (TTS).
     */
    run_campaign: async ({ leads, pitch }) => {
      if (!client) {
        throw new Error("Telephony Client not configured.");
      }

      const results = [];
      for (const number of leads) {
        try {
          const call = await client.calls.create({
            twiml: `<Response><Say>${pitch}</Say><Record/></Response>`,
            to: number,
            from: fromNumber
          });
          results.push({ number, status: "initiated", sid: call.sid });
        } catch (error) {
          results.push({ number, status: "failed", error: error.message });
        }
      }
      return `Campaign started. Results: ${JSON.stringify(results)}`;
    }
  }
};
