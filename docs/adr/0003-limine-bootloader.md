# ADR-003: Limine Bootloader

## Status
Accepted

## Context
NomadOS requires a secure, reliable way to transition from UEFI Firmware to the seL4 Kernel.
We evaluated:
1.  **Custom UEFI Parser (Rust):** Rejected due to high risk of bugs and "reinventing the wheel."
2.  **GRUB:** Rejected due to code bloat and legacy complexity.
3.  **systemd-boot:** Rejected due to Linux-centric design.

## Decision
We adopt **Limine** as the Stage 1 Bootloader.
1.  Limine handles hardware quirks and puts the CPU in a known 64-bit state.
2.  Limine loads the **Nomad Second Stage (Rust)**, which performs TPM measurement before launching seL4.

## Consequences
*   **Positive:** Deterministic boot state. Reduced codebase size. Modern protocol support.
*   **Negative:** External dependency.
*   **Reference:** `docs/strategy/BOOTLOADER_ARCHITECTURE_DISSERTATION.md`
