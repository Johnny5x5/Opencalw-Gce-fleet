# NomadOS Monorepo

Welcome to the **NomadOS** source tree. This is a Sovereign, AI-Native Operating System built on seL4 and Rust.

## Directory Structure

*   **`kernel/`**: The `nomad-kernel` crate. Provides Rust bindings to the seL4 microkernel and defines the low-level capability interface.
*   **`system/`**: The `nomad-system` crate. This is the **Root Task** (the first process that runs). It acts as the "Guardian", managing resources, capabilities, and process scheduling.
*   **`drivers/`**: The `nomad-drivers` crate. Contains drivers for LoRa (Meshtastic), WiFi, and NPU hardware. Drivers run in isolated userspace processes.
*   **`ai-core/`**: The `nomad-ai-core` crate. The Neural Interface that allows the OS to schedule AI inference tasks.
*   **`userland/`**: The `nomad-userland` crate. Contains the Shell and user-facing applications.

## Build Instructions

This project requires a Rust nightly toolchain and the `cargo-xbuild` or similar cross-compilation tools for bare-metal targets.

```bash
# To check all crates
cargo check --workspace
```

## The 4-Core Mandate

NomadOS is designed for a **Heterogeneous AMP** architecture:
*   **Core 0:** User/Shell
*   **Core 1:** Comms/Drivers (Radio)
*   **Core 2:** Crypto (The Vault)
*   **Core 3:** Storage/DTN (The Scribe)
