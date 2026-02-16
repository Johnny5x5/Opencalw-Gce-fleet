# NomadOS Boot Specification
## The Sequence of Sovereignty

### 1. Overview
This document defines the boot sequence for NomadOS on UEFI-compliant hardware (x86_64 for Dev/Sim, AArch64 for RK3588 Target).

### 2. The Boot Chain
#### Stage 1: Firmware (UEFI)
*   **Role:** Hardware initialization (POST).
*   **Action:** Loads `/EFI/BOOT/BOOTX64.EFI` (or `BOOTAA64.EFI`) from the ESP partition.

#### Stage 2: The Nomad Bootloader (Limine)
*   **Component:** `limine-bootloader` (External Dependency)
*   **Role:**
    1.  Standardizes the UEFI environment (Hardware Quirks).
    2.  Loads the `nomad-kernel` (seL4 + Bindings).
    3.  Passes the "Limine Boot Struct" (Memory Map, Framebuffer) to the kernel.
    4.  Ensures CPU is in 64-bit Long Mode (x86_64) or AArch64 (ARM).

#### Stage 2.5: The Nomad Second Stage (Rust)
*   **Crate:** `packages/nomad-os/bootloader`
*   **Role:**
    1.  Receives control from Limine.
    2.  Unlocks the TPM (Measured Boot).
    3.  Hands over resources to the Guardian.

#### Stage 3: The Microkernel (seL4)
*   **Role:** Enforce isolation.
*   **Action:**
    1.  Initialize CPU/MMU.
    2.  Create the initial protection domain (Root Task).
    3.  Hand over all remaining resources to the Root Task.

#### Stage 4: The Guardian (Nomad System)
*   **Role:** The OS Manager.
*   **Action:**
    1.  Start the "Janitor" Core (GC).
    2.  Start the "Radio" Driver.
    3.  Start the "Userland" Shell (TUI).

### 3. Implementation Strategy (Simulation)
For this prototype, the Bootloader will:
1.  Print "NomadOS Bootloader Initializing..." to the screen.
2.  Simulate loading the kernel.
3.  Enter an infinite loop (preventing reboot), serving as a proof of "Bare Metal Execution".
