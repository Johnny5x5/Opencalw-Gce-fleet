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

### 1. Production Core (The Engine)
The core logic for parsing, verifying, and storing millions of components is designed to be decoupled from the API layer.
*   **Rust Implementation (Option A):** Located in `src/core/rust_engine/`. Optimized for raw speed and memory safety.
*   **BEAM/Elixir Implementation (Option B):** Located in `src/core/beam_engine/`. Optimized for massive concurrency and 99.999% uptime.
*   **Status:** Both are currently stubs waiting for the AI implementation team.

### 2. Prototype / Control Plane (The Interface)
The current Node.js implementation (`src/index.js`) acts as the:
*   **API Gateway:** Accepting requests from AI Agents via the Skill interface.
*   **Orchestrator:** It will eventually delegate heavy lifting to the Production Core via gRPC.

### 3. AI First
All APIs must return semantic, machine-readable data defined by the Protobuf schemas in `schemas/`.

### 4. Zero Trust
Assume all inputs are malicious until verified.
