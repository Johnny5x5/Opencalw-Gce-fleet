# Data Replication Doctrine: The Tri-Tier Storage Model
## Ensuring Sovereignty from the Pocket to the Cloud

### 1. The Challenge: Scalability vs. Sovereignty
A single tablet is fast but fragile. A cloud is survivable but centralized. A mesh is resilient but slow.
*   **The Goal:** Combine all three into a seamless "Universal Data Plane."

### 2. The Tri-Tier Architecture

#### Tier 1: Local Sovereignty (NomadFS / LSM Tree)
*   **Technology:** Log-Structured Merge Tree (Rust).
*   **Location:** Device NVMe (RAID 0).
*   **Role:** The "Hot" Layer.
*   **Behavior:** All user writes go here first. It is instant (7GB/s), encrypted (Glass House), and works 100% offline.
*   **Analogy:** Your Brain's Short-Term Memory.

#### Tier 2: Clan Sovereignty (NomadNet / TiKV)
*   **Technology:** TiKV (Distributed Key-Value with Raft Consensus).
*   **Location:** Ad-hoc Mesh of nearby Nomad Devices (LoRa/WiFi).
*   **Role:** The "Warm" Layer.
*   **Behavior:** When you meet other Nomads, your devices form a temporary cluster. Shared data (Maps, Intel, Public Logs) is replicated. If your device breaks, your Clan has a copy.
*   **Analogy:** Verbal Communication with your Squad.

#### Tier 3: Federal Sovereignty (The Library / TiDB)
*   **Technology:** TiDB (Geo-Distributed SQL powered by TiKV).
*   **Location:** Federal Cloud (Multi-Region / Bunker).
*   **Role:** The "Cold/Strategic" Layer.
*   **Behavior:** When the Uplink is active, "Strategic" data is pushed to the Federal Archive using the native TiKV replication protocol. This avoids the overhead of SQL translation bridges.
*   **Analogy:** The National Archives.

### 3. The Sync Protocol (The "Waterfalls")
Data flows strictly **Upstream** based on classification.
1.  **Private Data:** Stays in Tier 1.
2.  **Clan Data:** Flows Tier 1 -> Tier 2.
3.  **Strategic Data:** Flows Tier 1 -> Tier 3.

### 4. Implementation Strategy
*   **NomadFS (Rust):** Manages Tier 1.
*   **Replication Daemon (Rust):** Watches NomadFS logs.
    *   If `tag == "clan"`, replicate to TiKV neighbor.
    *   If `tag == "strategic"`, queue for Cloud Uplink.
