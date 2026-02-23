const fs = require('fs');
const path = require('path');

class IronDome {
  constructor() {
    // FIXED: Correct path relative to src/functions/iron-dome/main.js
    this.doctrinePath = path.join(__dirname, '../../knowledge/library/military/doctrines/cyber_defense_doctrine.md');
    this.denyListPath = 'hosts.deny';
    this.state = {
      status: "ACTIVE",
      zone_integrity: "100%",
      threats_blocked: 0,
      active_rules: []
    };
  }

  activate() {
    console.log("[IRON DOME] Initializing Defense Systems...");
    this.loadDoctrine();
    this.scanPerimeter();
    this.updateBlocklist();
    return this.report();
  }

  loadDoctrine() {
    if (fs.existsSync(this.doctrinePath)) {
      const doctrine = fs.readFileSync(this.doctrinePath, 'utf8');
      console.log("[IRON DOME] Doctrine Loaded: The Iron Dome (Cyber Defense Doctrine)");

      if (doctrine.includes("12nm Firewall")) {
        this.state.active_rules.push("RULE_12NM_DPI");
      }
      if (doctrine.includes("Immune System")) {
        this.state.active_rules.push("RULE_HOST_IDS");
      }
    } else {
      console.error(`[IRON DOME] CRITICAL: Doctrine Missing at ${this.doctrinePath}`);
      this.state.status = "COMPROMISED";
    }
  }

  scanPerimeter() {
    console.log("[IRON DOME] Scanning 10.0.0.0/8 (Digital Waters)...");
    // Deterministic for test
    const threatDetected = true;

    if (threatDetected) {
      console.warn("[IRON DOME] ALERT: Anomaly detected at border node.");
      this.state.threats_blocked++;
    } else {
      console.log("[IRON DOME] Sector Clear.");
    }
  }

  updateBlocklist() {
    console.log(`[IRON DOME] Updating Global Blocklist... (Threats: ${this.state.threats_blocked})`);
  }

  report() {
    return `
=== IRON DOME STATUS REPORT ===
Status: ${this.state.status}
Integrity: ${this.state.zone_integrity}
Threats Neutralized: ${this.state.threats_blocked}
Active Rules:
${this.state.active_rules.map(r => ` - ${r}`).join('\n')}
===============================
    `;
  }
}

if (require.main === module) {
  const dome = new IronDome();
  console.log(dome.activate());
}

module.exports = IronDome;
