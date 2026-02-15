# SBOM War Survivability Protocols (Project "Aegis")
**Classification:** DEFCON 3 -> 1 (Escalation Protocol)
**Objective:** Ensure the "Iron Ledger" remains imperishable and trusted during active state-level warfare, kinetic strikes, or compromised infrastructure.

## 1. Post-Quantum Cryptography (PQC) Transition
**Threat:** "Harvest Now, Decrypt Later". State actors collecting encrypted SBOM traffic today to decrypt it once quantum computers are viable.
**Response:** Immediate adoption of NIST-standard PQC algorithms.
*   **Key Encapsulation:** **CRYSTALS-Kyber** (FIPS 203). Used for establishing secure channels (TLS 1.3 + Hybrid Key Exchange).
*   **Digital Signatures:** **CRYSTALS-Dilithium** (FIPS 204) or **Sphincs+** (FIPS 205). Used for signing SBOM artifacts and commits.
*   **Protocol:** "Hybrid Mode" is mandatory. All PQC keys must be combined with classical ECC (Elliptic Curve) keys until PQC is proven mature (10+ years).

## 2. Byzantine Fault Tolerance (BFT) & Decentralization
**Threat:** Compromise of central authority nodes, insider threats, or physical destruction of primary data centers.
**Response:** The Ledger must survive even if 33% of the network is traitorous/destroyed.
*   **Consensus:** Practical Byzantine Fault Tolerance (PBFT) or HoneyBadgerBFT (asynchronous).
*   **Distribution:**
    *   **Tier 1:** 3x Core Bunkers (Air Gapped).
    *   **Tier 2:** 100x "Witness" Nodes (NomadOS devices in the field) holding partial Merkle roots to verify integrity.

## 3. "Doomsday" Archival Strategy
**Threat:** EMP, Total Grid Collapse, Kinetic Strike on Cloud Regions.
**Response:** Non-electronic and extreme-durability storage.
*   **Medium:** M-DISC (1000-year Blu-ray) and LTO Tape (WORM).
*   **Location:** Deep underground storage (salt mines) independent of the primary "Bunker".
*   **Format:** "Human Readable" bootstrap code printed on archival paper (QR Codes + OCR-A font) to rebuild the compiler from scratch if necessary.

## 4. Self-Healing & Scorched Earth
**Threat:** Physical seizure of a node.
**Response:**
*   **Dead Man's Switch:** Nodes require a heartbeat from the "War Council" every 24 hours.
*   **Volatile Memory Encryption:** Keys live only in RAM (SRAM PUF). Power loss = Key destruction.
*   **Thermite Interlock:** (Simulated) Physical destruction of the HSM upon unauthorized chassis intrusion.

## 5. Formal Verification (The Mathematical Shield)
**Threat:** Zero-day exploits in the verification logic.
**Response:**
*   **Kernel:** seL4 (mathematically proven bug-free kernel).
*   **Parsers:** All SBOM parsers (CycloneDX) must be formally verified or written in memory-safe Rust with `forbid(unsafe_code)`.

---
**Status:** Protocol Definition Only. Implementation pending AI Engineering Team.
