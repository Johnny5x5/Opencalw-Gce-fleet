const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

// The Chaplaincy API
// Purpose: Provides moral auditing for ANY social group or project.

app.post('/moral/audit', (req, res) => {
  const { proposal, context } = req.body;
  console.log(`[CHAPLAINCY] Auditing proposal: "${proposal}"`);

  // Logic: Mock moral assessment
  let approved = true;
  let feedback = "No moral objection.";

  if (proposal.toLowerCase().includes("theft") || proposal.toLowerCase().includes("idol")) {
    approved = false;
    feedback = "VETO: This proposal violates the Commandments.";
  }

  res.json({
    auditor: "The Chaplaincy",
    status: approved ? "APPROVED" : "REJECTED",
    feedback: feedback
  });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Chaplaincy API running on port ${PORT}`));
}

module.exports = app;
