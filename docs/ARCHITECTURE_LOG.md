# The Story of NomadOS: Architectural Decisions Log
## "Why we built it this way."

This log serves as the index for the **Architecture Decision Records (ADRs)**. It tells the story of how we moved from a concept to a Sovereign OS.

### The Foundation (The Kernel)
*   **[ADR-001: Hybrid Sovereignty](adr/0001-hybrid-sovereignty-kernel.md)**
    *   *The Choice:* We rejected Linux (fragile) and pure Exokernels (complex). We chose **seL4** as the immutable foundation, running **Federated Rust Unikernels** for speed and safety.

### The Brain (Artificial Intelligence)
*   **[ADR-002: The Functional Split](adr/0002-functional-ai-split.md)**
    *   *The Choice:* We rejected splitting a single neural network across a radio link. We chose **Scout & Commander**: A local genius (8B Model) for survival, and a cloud god (70B+) for strategy.

### The Body (Boot & Hardware)
*   **[ADR-003: The Gatekeeper (Limine)](adr/0003-limine-bootloader.md)**
    *   *The Choice:* We rejected writing our own UEFI parser. We chose **Limine** to guarantee a deterministic, secure boot state before our Rust code runs.

### The Memory (Storage)
*   **[ADR-004: The Tri-Tier Data Plane](adr/0004-tri-tier-storage.md)**
    *   *The Choice:* We unified storage around **Rust & TiKV**.
        *   Tier 1: **NomadFS** (Local Flash).
        *   Tier 2: **TiKV** (Mesh Replication).
        *   Tier 3: **TiDB** (Cloud Backup).

### The Soul (User Experience)
*   **[ADR-005: The Post-App Paradigm](adr/0005-post-app-paradigm.md)**
    *   *The Choice:* We stopped building "Apps." We built **GenUI**, where the NPU hallucinates the interface in real-time based on your Intent.

---
*For more details on the philosophy behind these choices, consult the `docs/strategy/` folder.*
