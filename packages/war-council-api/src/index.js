const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// The War Council API
// Purpose: Provides strategic auditing for ANY social group or project.

app.post('/strategy/audit', (req, res) => {
  const { proposal, context } = req.body;
  console.log(`[WAR COUNCIL] Auditing proposal: "${proposal}"`);

  // Logic: Mock strategic assessment
  let risk = "LOW";
  let approved = true;
  let feedback = "Strategic alignment confirmed.";

  if (proposal.toLowerCase().includes("surrender") || proposal.toLowerCase().includes("weakness")) {
    risk = "CRITICAL";
    approved = false;
    feedback = "VETO: This proposal undermines our defensive posture.";
  }

  res.json({
    auditor: "War Council",
    status: approved ? "APPROVED" : "REJECTED",
    risk_level: risk,
    feedback: feedback
  });
});

// Standalone mode or export for testing
if (require.main === module) {
  app.listen(PORT, () => console.log(`War Council API running on port ${PORT}`));
}

module.exports = app;
