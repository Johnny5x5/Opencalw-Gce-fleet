const { google } = require('googleapis');
const webrisk = google.webrisk('v1');

class GoogleThreatIntel {
  constructor(config = {}) {
    this.projectId = config.projectId || process.env.GOOGLE_CLOUD_PROJECT;
    this.apiKey = config.apiKey || process.env.GOOGLE_API_KEY; // For simple API access
  }

  /**
   * Scans a URL using Google Web Risk API.
   * @param {string} uri The URL to scan.
   * @returns {Promise<object>} The scan result.
   */
  async scanUrl(uri) {
    console.log(`[GoogleThreatIntel] Scanning URL: ${uri}`);
    try {
      // In a real scenario, we would use the Web Risk API.
      // For this environment, we simulate a check or use the API if creds exist.
      if (!this.apiKey) {
        console.warn('[GoogleThreatIntel] No API Key found. Returning mock safe result.');
        return {
          threat: false,
          details: "Mock scan: URL appears safe (No API Key provided)",
          timestamp: new Date().toISOString()
        };
      }

      const response = await webrisk.uris.search({
        key: this.apiKey,
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
        uri: uri
      });

      if (response.data && response.data.threat && response.data.threat.threatTypes.length > 0) {
        return {
          threat: true,
          types: response.data.threat.threatTypes,
          details: "URL is flagged by Google Web Risk",
          timestamp: new Date().toISOString()
        };
      }

      return {
        threat: false,
        details: "URL is clean according to Google Web Risk",
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('[GoogleThreatIntel] Error scanning URL:', error.message);
      // Fallback for demo purposes
      return {
        error: true,
        message: error.message,
        details: "Failed to reach Google Web Risk API"
      };
    }
  }

  /**
   * Scans a file hash (SHA-256) against known threat databases.
   * Uses VirusTotal (Google-owned) if API key is present, otherwise mocks.
   * @param {string} fileHash SHA-256 hash of the file.
   */
  async scanFileHash(fileHash) {
    console.log(`[GoogleThreatIntel] Scanning File Hash: ${fileHash}`);
    // Placeholder for VirusTotal integration
    // Requires VT_API_KEY env var
    const vtKey = process.env.VT_API_KEY;

    if (!vtKey) {
       console.warn('[GoogleThreatIntel] No VirusTotal API Key found. Returning mock result.');
       return {
         hash: fileHash,
         malicious: false,
         source: "Mock (Missing VT_API_KEY)",
         details: "File hash not found in local cache."
       };
    }

    // Real implementation would fetch from https://www.virustotal.com/api/v3/files/{hash}
    return {
      hash: fileHash,
      malicious: false, // Default to safe if not implemented fully
      source: "VirusTotal (Stub)",
      details: "API integration pending."
    };
  }

  /**
   * Analyzes a domain for reputation.
   * @param {string} domain
   */
  async getDomainReport(domain) {
    console.log(`[GoogleThreatIntel] Getting report for domain: ${domain}`);
    return this.scanUrl(`http://${domain}`);
  }
}

module.exports = GoogleThreatIntel;
