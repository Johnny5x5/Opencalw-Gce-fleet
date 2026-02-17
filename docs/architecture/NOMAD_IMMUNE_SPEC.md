# NomadOS Immune System Specification
## The "Digital Antibody" Architecture

### 1. The Threat Model
Standard OS security (Linux/Windows) is "Wall-Based" (Firewalls, Permissions). Once an attacker gets inside (e.g., via a browser bug), they are free to roam.
NomadOS assumes **The Wall Will Fail**. The defense must be **Biological**.

### 2. Components
#### A. The Watcher (Behavioral IDS)
*   **Location:** Runs on **Core 1 (Janitor Core)** alongside the GC.
*   **Input:** Stream of all `seL4` capability invocations (System Calls).
*   **Logic:** Uses a lightweight Anomaly Detection AI (Random Forest) trained on "Normal Behavior".
    *   *Normal:* Text Editor writes to `/home/docs`.
    *   *Anomaly:* Text Editor tries to open `/dev/radio`.
*   **Action:** Immediate **Process Termination** (Kill).

#### B. The Lazarus Protocol (Self-Repair)
*   **Trigger:** When a process (Unikernel) is killed by The Watcher or crashes.
*   **Action:**
    1.  **Snapshot Rollback:** The Guardian mounts the previous "Known Good" snapshot of the Unikernel from NomadFS.
    2.  **Restart:** The process is relaunched in a fresh memory domain.
    3.  **Quarantine:** The specific input that caused the crash is saved to a "Virus Vault" for analysis, but isolated from the system.

#### C. The Honeypot (Deception)
*   **Strategy:** The OS populates memory with "Fake Credentials" and "Fake Files".
*   **Trigger:** If any process touches a Fake File, it is instantly flagged as malicious.

### 3. Integration with Hardware
*   **TrustZone:** The Immune System logic itself runs in ARM TrustZone (or RISC-V PMP) so it cannot be disabled by a kernel rootkit.

### 4. Implementation Strategy
*   **Crate:** `packages/nomad-os/immune`
*   **Structs:** `Watcher`, `Antibody`, `QuarantineManager`.
