# NomadOS Hardware Doctrine
## The "Iron Hardware" Specification

### 1. Architectural Philosophy
NomadOS mandates a "Shared-Nothing" hardware architecture to enforce absolute isolation between critical system functions. We reject monolithic kernels that mix radio drivers with user applications.

### 2. The 4-Core Mandate (Minimum Viable Product)
The OS is designed around strict physical separation of duties.

#### Core 0: The Sovereign (User Interaction)
*   **Role:** Dedicated to the User Interface (UI), Application Logic, and "The Watcher" audit log.
*   **Architecture:** High-Performance (64-bit/128-bit RISC-V).
*   **Access:** Full User Permissions, No direct Radio access.

#### Core 1: The Sentry (Communications)
*   **Role:** Manages all Radio Links (LoRa, Satellite, WiFi, Cellular).
*   **Architecture:** Ultra-Low Power (32-bit RISC-V).
*   **Access:** Hardware Radio Peripheral Access Only. Cannot read User Memory directly. Communication with Core 0 is via secure Inter-Process Communication (IPC).
*   **Task:** Runs the "Radio Manager" (Spectrum Guard, Listen-Before-Talk).

#### Core 2: The Vault (Cryptography)
*   **Role:** Dedicated Hardware Encryption/Decryption.
*   **Architecture:** Ultra-Low Power + Hardware Accelerators (AES-NI, SHA-256).
*   **Access:** Key Storage Access Only.
*   **Task:** Encrypts/Decrypts all traffic leaving/entering the device. "Black/Red" separation point.

#### Core 3: The Scribe (Storage & Persistence)
*   **Role:** Manages the Filesystem and DTN Bundles.
*   **Architecture:** Low Power (32-bit/64-bit).
*   **Access:** Flash Storage Controller Access Only.
*   **Task:** Writes encrypted bundles to disk. Manages the Merkle-DAG integrity checks.

### 3. The Heterogeneous AMP Strategy (Scalability)
NomadOS scales from IoT to Workstation using Asymmetric Multi-Processing.

#### Class A: The "Sovereign Sensor" (IoT/Drone)
*   **CPU:** 4x Cortex-M4/M7 or RISC-V32 (All ULP).
*   **Radio:** LoRa + BLE.
*   **Power:** Years on battery.

#### Class B: The "Sovereign Tablet" (Nomad Reference Prototype)
*   **SoC:** Rockchip RK3588 (8nm).
*   **CPU:** Heterogeneous Octa-Core.
    *   **Cluster 1 (Performance):** 4x Cortex-A76 @ 2.4GHz.
    *   **Cluster 2 (Efficiency/Comms):** 4x Cortex-A55 @ 1.8GHz.
*   **NPU:** 6 TOPS (Int8) dedicated Neural Processing Unit.
*   **VPU:** 8K@60fps H.265/VP9 Hardware Decoder/Encoder.
*   **Memory Architecture (Virtual RAM):**
    *   **RAM:** 32GB LPDDR4X (Soldered).
    *   **AI Cache:** **Dual M.2 NVMe Slots (PCIe 3.0 x4)** configured in RAID 0.
    *   **Bandwidth:** ~7GB/s throughput allows loading 70B+ parameter models directly from disk ("Swap as RAM").
*   **Display:** 10" E-Ink (Daylight Readable) or 1000-nit Transflective LCD.

#### Class C: The "Sovereign Station" (Laptop/Desktop)
*   **Cluster 1 (Efficiency):** 4x ULP Cores (Radio/Sensor/Crypto/Storage). *Always On.*
*   **Cluster 2 (Performance):** 16x 128-bit RISC-V Cores (The "Brain").
*   **NPU:** 50+ TOPS for local LLM Training/Inference.
*   **GPU:** Discrete GPU for 3D/Compute.

### 4. Custom Silicon Strategy (2029 Target)
*   **ISA:** RISC-V (Open Standard).
*   **Word Size:** 128-bit Address Space (Future Proofing).
*   **Fabric:** NoC (Network-on-Chip) with physical firewalls between cores.
*   **Security:** Built-in "Root of Trust" (RoT) independent of the manufacturer.

### 5. Peripheral Requirements
*   **NPU:** Mandatory for all classes. Neural Processing Unit for AI-driven OS tasks.
*   **Radio:** Software Defined Radio (SDR) capability preferred for maximum flexibility.
