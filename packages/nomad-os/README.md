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

## The 8-Core Mandate (Nomad Tablet)

NomadOS is designed for a **Heterogeneous AMP** architecture (Rockchip RK3588):

*   **Core 0 (Kernel):** seL4 Hypervisor.
*   **Core 1 (Janitor):** System-wide Garbage Collector (The "Sidecar" GC).
*   **Core 2 (User):** UI Shell / Application Logic.
*   **Core 3 (Radio):** Comms/Drivers (The Sentry).
*   **Core 4-7 (AI Cluster):** "The Brain" (Vector Search / NPU Inference). Dynamically woken up in "Station Mode".
