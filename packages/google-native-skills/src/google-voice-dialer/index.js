// Note: This skill is a wrapper around Dialogflow CX or a Twilio API.
// Since we are "Google First," we will use Dialogflow CX to initiate outbound calls if possible (Telephony Gateway).
// However, direct outbound API is complex.
// We will create a "Simulated" fallback that logs an "Outbound Call Request" to Firestore/BigQuery,
// which a supervisor (human) or a separate Twilio-worker can pick up.
// OR we implement Twilio directly as a fallback.

const twilio = require('twilio');

/**
 * OpenClaw Skill: Google Voice / Twilio Dialer
 *
 * Allows agents to initiate phone calls.
 * Current Implementation: Uses Twilio API as a fallback for reliable outbound calling.
 * Future: Use Google Cloud Contact Center AI Platform (CCAI-P) API.
 */

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

module.exports = {
  name: 'google-voice-dialer',
  description: 'Initiate outbound phone calls or SMS (via Twilio/Google Voice).',

  actions: {
    /**
     * Call a phone number and play a message (TTS).
     * @param {string} to_number - E.164 format (e.g., +15551234567).
     * @param {string} message - Text to speak.
     */
    call_number: async ({ to_number, message }) => {
      if (!client) {
        throw new Error("Telephony Client not configured (TWILIO_ACCOUNT_SID missing).");
      }

      const call = await client.calls.create({
        twiml: `<Response><Say>${message}</Say></Response>`,
        to: to_number,
        from: fromNumber
      });

      return `Call initiated: ${call.sid}`;
    },

    /**
     * Send an SMS.
     * @param {string} to_number - E.164 format.
     * @param {string} text - Message body.
     */
    send_sms: async ({ to_number, text }) => {
       if (!client) {
        throw new Error("Telephony Client not configured.");
      }

      const msg = await client.messages.create({
        body: text,
        from: fromNumber,
        to: to_number
      });

      return `SMS sent: ${msg.sid}`;
    }
  }
};
