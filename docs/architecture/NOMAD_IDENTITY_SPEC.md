# NomadOS Identity Specification
## The "Keystone" Architecture

### 1. The Concept: Self-Sovereign Identity (SSI)
You do not log in to NomadOS with a Google or Apple account. You **are** the Root Authority.
*   **DID (Decentralized Identifier):** Your identity is a public key, not a username.
*   **Portable:** You can move your Identity to a new device by physically moving the "Keystone" (Hardware Token) or restoring a Seed Phrase.

### 2. Components
#### A. The Keystone (Driver)
*   **Hardware:** Wraps the Secure Element (e.g., ATECC608 on generic boards, or internal SE on RK3588).
*   **Role:** Holds the `Root Private Key`. It never leaves the chip.
*   **Operations:** `Sign(Message)`, `Decrypt(Blob)`.

#### B. The Wallet (System Service)
*   **Role:** Manages "Sub-Keys" derived from the Root.
    *   **Identity Key:** For signing Chat Messages and SitReps.
    *   **Finance Key:** For Bitcoin/Monero wallets.
    *   **Access Key:** For unlocking NomadFS objects.

#### C. The Handshake (Attestation)
*   **Protocol:** When two Nomads meet, they exchange DIDs.
*   **Trust:** You can "Vouch" for another Nomad (signing their DID), creating a Web of Trust.

### 3. Implementation Strategy
*   **Crate:** `packages/nomad-os/identity`
*   **Standards:** W3C DID, Ed25519 signatures.
