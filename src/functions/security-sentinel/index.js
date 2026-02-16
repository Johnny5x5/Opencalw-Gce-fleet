const axios = require('axios');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  feeds: [
    'https://feeds.feedburner.com/GoogleOnlineSecurityBlog', // Google Security Blog
    'https://www.cisa.gov/cybersecurity-advisories/all.xml', // CISA Alerts
    'https://krebsonsecurity.com/feed/' // Krebs on Security
  ],
  outputFile: path.join(__dirname, '../../../data/security_insights.json')
};

async function fetchFeed(url) {
  try {
    console.log(`Fetching feed: ${url}`);
    const response = await axios.get(url);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    return result;
  } catch (error) {
    console.error(`Error fetching feed ${url}:`, error.message);
    return null;
  }
}

function extractItems(feedData) {
  if (!feedData || !feedData.rss || !feedData.rss.channel || !feedData.rss.channel[0].item) {
    return [];
  }
  return feedData.rss.channel[0].item.map(item => ({
    title: item.title[0],
    link: item.link[0],
    pubDate: item.pubDate ? item.pubDate[0] : new Date().toISOString(),
    description: item.description ? item.description[0].substring(0, 200) + '...' : ''
  }));
}

async function analyzeWithAI(items) {
  // Try to use Vertex AI if configured, otherwise fallback to heuristics
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.VERTEX_AI_PROJECT_ID) {
    try {
      console.log('Using Vertex AI for analysis...');
      // Dynamic import to avoid dependency issues if not installed
      const { VertexAI } = require('@google-cloud/vertexai');
      const vertexAI = new VertexAI({ project: process.env.VERTEX_AI_PROJECT_ID, location: 'us-central1' });
      const model = vertexAI.preview.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Analyze the following security news items and identify critical threats. For each item, provide a "risk_level" (LOW, MEDIUM, HIGH, CRITICAL) and an "action_item".
      Items: ${JSON.stringify(items.map(i => i.title))}`;

      const result = await model.generateContent(prompt);
      const response = result.response.candidates[0].content.parts[0].text;
      console.log('Vertex AI Analysis:', response);

      // Parse the response (assuming JSON or structured text, simplified for now)
      return items.map(item => ({
        ...item,
        ai_insight: "Vertex AI Analysis Complete",
        action_required: true // Assume AI found something if we asked
      }));

    } catch (e) {
      console.warn('Vertex AI failed, falling back to heuristics:', e.message);
    }
  }

  // Fallback Heuristics
  console.log('Using Heuristic Analysis...');
  return items.map(item => {
    const lowerTitle = item.title.toLowerCase();
    let insight = "Routine Update";
    let risk = "LOW";

    if (lowerTitle.includes('vulnerability') || lowerTitle.includes('cve') || lowerTitle.includes('exploit')) {
      insight = "Critical Vulnerability detected.";
      risk = "CRITICAL";
    } else if (lowerTitle.includes('apt') || lowerTitle.includes('nation') || lowerTitle.includes('state')) {
      insight = "Nation-State Activity detected.";
      risk = "HIGH";
    } else if (lowerTitle.includes('malware') || lowerTitle.includes('ransomware')) {
      insight = "Malware campaign detected.";
      risk = "HIGH";
    }

    return {
      ...item,
      risk_level: risk,
      ai_insight: insight,
      action_required: risk === "HIGH" || risk === "CRITICAL"
    };
  });
}

async function main() {
  console.log('Starting Security Sentinel...');

  // Ensure data directory exists
  const dataDir = path.dirname(CONFIG.outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let allInsights = [];

  for (const feedUrl of CONFIG.feeds) {
    const feedData = await fetchFeed(feedUrl);
    if (feedData) {
      const items = extractItems(feedData);
      console.log(`Found ${items.length} items in feed.`);

      // Analyze the top 5 most recent items
      const recentItems = items.slice(0, 5);
      const analyzed = await analyzeWithAI(recentItems);
      allInsights = allInsights.concat(analyzed);
    }
  }

  // Filter for actionable insights
  const actionable = allInsights.filter(i => i.action_required);

  const report = {
    timestamp: new Date().toISOString(),
    total_scanned: allInsights.length,
    actionable_count: actionable.length,
    insights: actionable
  };

  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(report, null, 2));
  console.log(`Report generated at ${CONFIG.outputFile}`);
  console.log(`Found ${actionable.length} actionable insights.`);
}

main().catch(console.error);
