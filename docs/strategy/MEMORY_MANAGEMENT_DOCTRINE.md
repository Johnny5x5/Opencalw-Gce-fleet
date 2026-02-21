# NomadOS Memory Management Doctrine
## The "Janitor Core" Architecture (Sidecar GC)

### 1. The Challenge: Pause-Free Intelligence
Traditional managed languages (Java, Python, Go) suffer from "Stop-the-World" Garbage Collection (GC). The program pauses while the system cleans up memory.
*   **Mission Impact:** In a real-time combat or survival scenario, a 50ms pause can be fatal.
*   **User Requirement:** Enable a future "Fire-and-Forget" programming language that has no built-in GC but relies on the OS to clean up.

### 2. The Solution: Hardware-Isolated GC
We utilize the multi-core architecture to physically separate execution from cleanup.

#### The 8-Core Allocation (Standard Tablet)
*   **Core 0 (The Kernel):** seL4 Hypervisor. Manages protection domains.
*   **Core 1 (The Janitor):** **Dedicated System-Wide Garbage Collector.**
*   **Cores 2-7 (The User):** Application Logic / AI / Radio.

### 3. The "Sidecar" Mechanism
1.  **Allocation:** The User App (Core 2) requests a memory page. It writes data efficiently (Bump Allocation). It *never* frees memory.
2.  **Observation:** The Janitor (Core 1) has read-access to Core 2's memory map (via seL4 capabilities).
3.  **Tracing:** The Janitor continuously scans the memory graph in the background, identifying "Dead Objects" (unreachable data).
4.  **Reclamation:** The Janitor unmaps dead pages and returns them to the free pool.
5.  **Compaction:** If enabled, the Janitor copies live data to new pages to reduce fragmentation (copy-on-write).

### 4. Benefits
*   **Zero Pauses:** The application never stops.
*   **Simpler Language:** The user's custom language compiles to raw machine code without a heavy runtime. It just assumes "infinite memory" (because the Janitor makes it so).
*   **Security:** The GC is privileged system code running in a separate enclave. A buggy app cannot corrupt the GC logic.

### 5. Implementation Strategy
*   **Phase 1:** Implement a "Bump Allocator" in the Rust System library.
*   **Phase 2:** Implement the "Scanner" Unikernel on Core 1.
*   **Phase 3:** Define the IPC protocol for "Memory Pressure" signals (Janitor telling App to slow down if cleanup lags behind).
