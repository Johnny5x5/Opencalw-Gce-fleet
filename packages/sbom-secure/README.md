# SBOM Secure (Project "Iron Ledger")

**Classification:** DEFCON 4 (Bunker)
**Status:** Alpha (Scaffolding)

This module provides the "Iron Ledger", a high-security, high-performance Software Bill of Materials (SBOM) system designed for the Sovereign Digital Nation.

## Mission
To ensure total supply chain dominance by enforcing a strict "Verify, then Trust" policy for all software artifacts.

## Architecture
See `docs/departments/software/SBOM_MASTER_PLAN.md` for the full architectural specification.

## Usage for AI Agents

This module exposes a high-level API for AI agents to query and verify software components.

### Example Query
```javascript
const sbom = require('sbom-secure');

// Verify an artifact's signature
const isVerified = await sbom.verifyArtifact({
  hash: "sha256:...",
  signature: "..."
});

// Query vulnerability impact
const impact = await sbom.queryImpact({
  cveId: "CVE-2024-1234"
});
```

## Security Protocols (DEFCON 4)
*   **Air-Gap Simulation:** This module must be run in a restricted environment.
*   **Key Management:** Root keys must be stored in Hardware Security Modules (HSM).
*   **Attestation:** All outputs are cryptographically signed.

## Development Directives
1.  **Rust Core:** Performance critical components should be implemented in Rust (see `src/core/`).
2.  **AI First:** All APIs must return semantic, machine-readable data.
3.  **Zero Trust:** Assume all inputs are malicious until verified.
