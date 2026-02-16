const { Storage } = require('@google-cloud/storage');
const axios = require('axios'); // For searching new domains (mocked)

// Initialize Storage
const storage = new Storage();
const BUCKET_NAME = process.env.SKILLS_BUCKET_NAME || 'my-skills-repo';
const HOSTS_FILE = 'hosts.deny';
const VENDORS_FILE = 'forbidden_vendors.json';

/**
 * Cloud Function: The Iron Curtain
 * Periodically scans for new "Adversary" domains and updates the global blocklist.
 */
exports.updateBlocklist = async (req, res) => {
  try {
    console.log('Initiating Iron Curtain Scan...');

    // 1. Fetch Current "Adversary" List (Mock Search)
    // In production, this would use a Search API (Google/Bing) looking for:
    // "New Musk Company", "Meta Acquisition", "Zuckerberg Investment"
    const newThreats = await scanForThreats();

    // 2. Generate updated /etc/hosts content
    const hostsContent = generateHostsFile(newThreats);

    // 3. Generate updated JSON for Agents
    const vendorsContent = generateVendorsJson(newThreats);

    // 4. Upload to GCS (The Truth Source)
    await storage.bucket(BUCKET_NAME).file(HOSTS_FILE).save(hostsContent);
    await storage.bucket(BUCKET_NAME).file(VENDORS_FILE).save(JSON.stringify(vendorsContent, null, 2));

    console.log('Iron Curtain Updated via GCS.');
    res.status(200).send('Iron Curtain Updated.');
  } catch (error) {
    console.error('Iron Curtain Failed:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- Helper Functions ---

async function scanForThreats() {
  // Mock Logic: In reality, use Google Custom Search API here.
  return [
    { name: "Tesla", domains: ["tesla.com", "shop.tesla.com", "ir.tesla.com"] },
    { name: "SpaceX", domains: ["spacex.com", "starlink.com", "api.starlink.com"] },
    { name: "X Corp", domains: ["x.com", "twitter.com", "t.co", "x.ai", "grok.x.ai"] },
    { name: "Neuralink", domains: ["neuralink.com"] },
    { name: "Boring Co", domains: ["boringcompany.com"] },
    { name: "Meta", domains: ["meta.com", "facebook.com", "instagram.com", "whatsapp.com", "threads.net"] },
    { name: "Oculus", domains: ["oculus.com", "horizon.meta.com"] },
    // Hypothetical Future Threats (The "Auto-Update" part)
    { name: "MuskPhone", domains: ["modelpi.com", "tesla-phone.com"] },
    { name: "ZuckCoin", domains: ["diem.com", "libra.org"] }
  ];
}

function generateHostsFile(threats) {
  let content = "# --- THE IRON CURTAIN: AUTOMATED BLOCKLIST ---\n";
  content += "# Updated: " + new Date().toISOString() + "\n\n";

  threats.forEach(threat => {
    content += `# ${threat.name}\n`;
    threat.domains.forEach(domain => {
      content += `127.0.0.1 ${domain}\n`;
      content += `127.0.0.1 www.${domain}\n`;
    });
    content += "\n";
  });

  return content;
}

function generateVendorsJson(threats) {
  return {
    policy: "STRICT_BLOCK",
    updated_at: new Date().toISOString(),
    forbidden_vendors: threats.map(t => ({
      name: t.name,
      reason: "Religious Ban: The Adversary",
      domains: t.domains
    }))
  };
}
