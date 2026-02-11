const functions = require('@google-cloud/functions-framework');
const { PubSub } = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();
const TOPIC_NAME = process.env.PUBSUB_TOPIC || 'call-center-inbox';

/**
 * HTTP Cloud Function for Dialogflow Fulfillment.
 * Receives the conversation state from Dialogflow and bridges it to OpenClaw via Pub/Sub.
 */
functions.http('dialogflowFulfillment', async (req, res) => {
  try {
    const body = req.body;

    // Extract key information from Dialogflow Request
    const session = body.sessionInfo?.session;
    const intent = body.intentInfo?.displayName || 'unknown_intent';
    const text = body.text || '';
    const languageCode = body.languageCode || 'en';
    const callerId = body.payload?.telephony?.caller_id || 'anonymous'; // If using Telephony Gateway

    // Security Check
    const authHeader = req.get('X-OpenClaw-Auth');
    // In a real app, fetch this from Secret Manager at runtime
    const expectedToken = process.env.WEBHOOK_SECRET || 'secret-token-change-me-in-prod';

    if (authHeader !== expectedToken) {
      console.warn('Unauthorized Webhook Attempt');
      return res.status(403).send('Unauthorized');
    }

    console.log(`Received call from ${callerId} (Lang: ${languageCode}, Intent: ${intent})`);

    // Prepare message for OpenClaw Agent
    const message = {
      source: 'dialogflow',
      session_id: session,
      caller_id: callerId,
      language: languageCode,
      intent: intent,
      transcript: text,
      timestamp: new Date().toISOString()
    };

    // Publish to Pub/Sub (The "Inbox")
    const dataBuffer = Buffer.from(JSON.stringify(message));
    await pubSubClient.topic(TOPIC_NAME).publishMessage({ data: dataBuffer });

    // Respond to Dialogflow immediately to keep the line open
    // In a synchronous world, we'd wait for OpenClaw, but for scalability,
    // we acknowledge receipt and might play "hold music" or a generic "Checking..." message.
    // Or, if OpenClaw is fast enough (<5s), we could wait.
    // Here we return a simple confirmation.

    res.json({
      fulfillment_response: {
        messages: [
          {
            text: {
              text: [
                "One moment please, I'm checking on that.",
                "Un momento por favor, estoy verificando."
              ]
            }
          }
        ]
      }
    });

  } catch (error) {
    console.error('Error processing fulfillment:', error);
    res.status(500).send('Internal Server Error');
  }
});
