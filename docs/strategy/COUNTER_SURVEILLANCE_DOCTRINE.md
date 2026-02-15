# NomadOS Counter-Surveillance Doctrine
## Strategic Defense in a Hostile Environment

### 1. The Threat Landscape
We operate in an environment where state and corporate actors employ pervasive surveillance ("The Panopticon"). NomadOS assumes all external networks are hostile, all radio links are monitored, and device physical security may be compromised.

### 2. Active Defense Principles

#### A. The "Glass House" Protocol (Data at Rest & In Use)
*   **Full Disk Encryption (FDE):** All user data is encrypted with AES-256-XTS.
*   **Deniable Encryption:** The OS supports "Hidden Volumes". A distress password unlocks a plausible "decoy" OS with innocuous data, while the real OS remains cryptographically invisible.
*   **Secure Enclaves:** Critical keys (Identity, Signal, Crypto) never leave the "Vault Core" (Core 2) or the Hardware Security Module (HSM).
*   **Ram Scrubbing:** Upon panic or shutdown, memory is actively overwritten to prevent Cold Boot attacks.

#### B. The "Ghost" Protocol (Network Obfuscation)
*   **Traffic Shaping (Chaff):** The OS generates constant, low-bandwidth background noise ("chaff") indistinguishable from real traffic.
    *   *Real:* Sending a 1KB text message.
    *   *Chaff:* Sending 1KB of random noise to a decoy server every minute.
    *   *Result:* An observer sees constant activity; they cannot correlate traffic bursts with user actions.
*   **Mixnet Integration:** Default routing through Tor (TCP) or I2P (UDP) for non-latency-critical traffic.
*   **MAC Address Randomization:** Aggressive rotation of L2 identifiers on every connection.

#### C. The "Mirror" Protocol (Intrusion Detection)
*   **Honey-Files:** The OS places "bait" files (e.g., `passwords.txt`, `contacts.db`) in accessible areas. Accessing them triggers an immediate lockdown and silent alert.
*   **Canary Tokens:** Network requests to unique URLs that trip alarms if accessed.
*   **The Watcher:** An immutable, append-only log (Merkle Tree) of *every* capability grant and system call. The user can audit this log to see exactly what processes are doing.

#### D. The "Radio Silence" Protocol (Emission Control)
*   **Listen-Before-Talk (LBT):** Strict adherence to passive monitoring before transmission to avoid RF triangulation.
*   **Burst Transmission:** Compress data into micro-bursts to minimize "Time on Air".
*   **Frequency Hopping:** Rapid, pseudo-random frequency changes (FHSS) on LoRa/HF bands to evade jamming and interception.

### 3. Hardware Counter-Measures
*   **Kill Switches:** Physical hardware switches to disconnect Battery, Microphone, and Camera.
*   **Tamper Detection:** Sensors (light, pressure) inside the chassis to detect physical intrusion, triggering a "Panic Wipe".

### 4. Operational Security (PACE)
*   **Primary:** Satellite / Mesh (Encrypted Overlay).
*   **Alternate:** Public WiFi (via VPN/Tor).
*   **Contingency:** Sneakernet (Physical SD Card swap).
*   **Emergency:** "Scorched Earth" (Device Self-Destruct).
