# Rust Migration Doctrine: The Sovereign Rewrite

## Objective
To achieve total sovereignty and performance, the entire `openclaw-conglomerate` repository must be rewritten in **Rust**. This migration is mandatory and foundational.

## Core Directives
1.  **Rust Supremacy:** All logic currently in Node.js/JavaScript must be ported to Rust.
2.  **Async All The Way:** The entire stack must be asynchronous (`async`/`await`), utilizing robust runtimes (e.g., Tokio).
3.  **Modular Granularity:**
    - Monolithic packages (like `google-native-skills`) must be shattered into individual, specialized crates (e.g., `google-chat-connector`, `google-cloud-storage`).
    - Each "Skill" or "Function" becomes its own crate/package.
4.  **Target Agnosticism:** While Rust is the language, the deployment targets are flexible but high-performance:
    - **WASM (WebAssembly):** For portable, sandboxed execution (Library Guardian, browser runtimes).
    - **BEAM (Erlang VM):** Optional integration via Rust implementations (e.g., Lumen/Firefly) for high-concurrency orchestration.
    - **Native Binary:** For raw performance on sovereign hardware.

## Migration Inventory

### Packages to Convert
- [ ] **Mobius Engine** (`packages/mobius-engine`) -> `mobius-core`
- [ ] **Council Chamber** (`packages/council-chamber`) -> `council-sim`
- [ ] **Central Archive** (`packages/central-archive`) -> `central-archive-rs`
- [ ] **Chaplaincy API** (`packages/chaplaincy-api`) -> `chaplaincy-service`
- [ ] **Scribes API** (`packages/scribes-api`) -> `scribes-service`
- [ ] **War Council API** (`packages/war-council-api`) -> `war-council-service`
- [ ] **National Library** (`packages/national-library`) -> `national-library-core`
- [ ] **SBOM Secure** (`packages/sbom-secure`) -> `sbom-guardian`

### Google Native Skills Decomposition
The `packages/google-native-skills` monolith must be broken down:
- [ ] `android-operator` crate
- [ ] `central-archive-access` crate
- [ ] `discord-connector` crate
- [ ] `google-chat-connector` crate
- [ ] `google-cloud-connector` crate
- [ ] `google-code-studio` crate
- [ ] `google-meet-scheduler` crate
- [ ] `google-multimodal-eye` crate
- [ ] `google-threat-intel` crate
- [ ] `google-voice-dialer` crate
- [ ] `google-workspace-connector` crate
- [ ] `mobius-access` crate
- [ ] `moral-reasoning` crate
- [ ] `outbound-sales` crate

### Cloud Functions
Each function in `src/functions/` becomes a standalone Rust microservice/lambda:
- [ ] `dialogflow-fulfillment`
- [ ] `iron-curtain`
- [ ] `nomad-uplink`
- [ ] `security-sentinel`

## Implementation Strategy
- **Workspace:** Establish a root Cargo Workspace to manage all these new crates.
- **Dependencies:** Standardization on `tokio` for async runtime, `serde` for data, and `tonic`/`axum` for networking.
- **Testing:** Unit tests must be co-located; integration tests in a dedicated `tests/` directory.

## Status
**Proposed** - Awaiting Execution.
