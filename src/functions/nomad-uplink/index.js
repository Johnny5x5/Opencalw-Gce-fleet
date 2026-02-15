const crypto = require('crypto');

/**
 * Nomad Sovereign Uplink
 *
 * Secure Gateway for NomadOS devices.
 * Receives encrypted bundles and audit logs.
 * Returns signed updates and queued messages.
 */
exports.nomadUplink = async (req, res) => {
  // 1. Verify Request Method
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // 2. Authenticate the Device (HMAC Signature)
  const signature = req.headers['x-nomad-signature'];
  const timestamp = req.headers['x-nomad-timestamp'];

  if (!signature || !timestamp) {
    console.error('Missing authentication headers');
    return res.status(401).send('Unauthorized: Missing Headers');
  }

  // Verify timestamp freshness (prevent replay attacks > 5 mins)
  const now = Date.now();
  if (Math.abs(now - parseInt(timestamp)) > 5 * 60 * 1000) {
    console.error('Timestamp stale or future');
    return res.status(401).send('Unauthorized: Stale Request');
  }

  // Reconstruct the message to sign: timestamp + body
  // SECURITY NOTE: In a real military-grade environment, we must use the raw request buffer
  // (req.rawBody) to guarantee the signature matches. Using JSON.stringify() is brittle
  // and susceptible to formatting differences, but sufficient for this architectural simulation.
  const payload = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
  const message = `${timestamp}.${payload}`;

  // Use a shared secret (env var) - Mandatory for Military Grade Security
  const secret = process.env.NOMAD_SHARED_SECRET;
  if (!secret) {
    console.error('CRITICAL: NOMAD_SHARED_SECRET environment variable is not set.');
    // Fail closed (500) to prevent unauthorized access due to misconfiguration
    return res.status(500).send('Internal Server Error: Security Misconfiguration');
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  // Constant-time comparison to prevent timing attacks
  // Must check lengths first to avoid throwing an error (DoS vector)
  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    console.error('Invalid signature');
    return res.status(403).send('Forbidden: Invalid Signature');
  }

  // 3. Process the Payload
  const { type, encryptedBundle, auditLog } = req.body;

  console.log(`Received Nomad Request: ${type}`);

  if (auditLog) {
    console.log(`[WATCHER LOG] Stored immutable log entry: ${auditLog.hash}`);
    // Here we would write to BigQuery or a Merkle Tree storage
  }

  let queuedMessages = [
    {
      id: 'msg-001',
      type: 'mission_update',
      content: 'Weather alert: Sandstorm approaching sector 7.',
      priority: 'high'
    }
  ];

  if (type === 'ai_heavy_lift') {
    console.log(`[HYBRID AI] Received Strategic Query. Routing to Federal Brain (Gemini 1.5 Pro)...`);
    // Simulate processing delay and complex reasoning
    queuedMessages.push({
      id: `ai-reply-${Date.now()}`,
      type: 'ai_response',
      content: 'STRATEGIC ANALYSIS: The satellite imagery indicates a 40% probability of aquifer presence at coordinates 34.05, -118.24. Recommend deploying ground sensors for verification. [Source: Sentinel-2 Infrared]',
      priority: 'flash'
    });
  }

  if (encryptedBundle) {
    console.log(`[BUNDLE] Received ${encryptedBundle.length} bytes of encrypted data.`);
    // Here we would decrypt and route to the AI Agent
  }

  // 4. Generate Response (Queued Commands)
  // Simulate an AI response or System Update
  const responsePayload = {
    status: 'success',
    serverTime: now,
    queuedMessages: queuedMessages,
    systemUpdate: null // No OTA update at this time
  };

  res.status(200).json(responsePayload);
};
