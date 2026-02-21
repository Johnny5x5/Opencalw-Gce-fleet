const fs = require('fs');
const path = require('path');

/**
 * Enforces the DEFCON 4 Bunker Security Policy.
 * This module checks environment variables and system state.
 */

const POLICY_PATH = path.join(__dirname, '../SECURITY_POLICY.json');
const POLICY = JSON.parse(fs.readFileSync(POLICY_PATH, 'utf8'));

function checkEnvironment() {
  const violations = [];

  // 1. Check for HSM Presence (Simulated check)
  if (POLICY.access_control.requires_hsm && !process.env.HSM_KEY_ID) {
    violations.push("CRITICAL: HSM_KEY_ID environment variable missing. Hardware Security Module required.");
  }

  // 2. Check for Air Gap (Simulated check)
  if (POLICY.network.air_gap_simulation && process.env.INTERNET_ACCESS === 'true') {
    violations.push("CRITICAL: Internet access detected. Air Gap violation.");
  }

  // 3. Check for Signed Commits (Simulated check)
  if (POLICY.supply_chain.require_signed_commits && process.env.GIT_GPG_SIGN !== 'true') {
    violations.push("WARNING: GPG Signing not enforced on current git config.");
  }

  return violations;
}

module.exports = {
  POLICY,
  checkEnvironment
};
