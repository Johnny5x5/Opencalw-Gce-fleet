const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;

// The Scribes API
// Purpose: Provides historical context and record-keeping for ANY social group.

app.get('/history/context', (req, res) => {
  const { topic } = req.query;
  console.log(`[SCRIBES] Retrieving context for topic: "${topic}"`);

  // Logic: Mock historical database query
  let context = "No specific precedent found.";
  if (topic.toLowerCase().includes("surveillance")) {
    context = "Warning: Similar initiatives failed in 2022 due to privacy concerns.";
  }

  res.json({
    auditor: "The Scribes",
    context: context
  });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Scribes API running on port ${PORT}`));
}

module.exports = app;
