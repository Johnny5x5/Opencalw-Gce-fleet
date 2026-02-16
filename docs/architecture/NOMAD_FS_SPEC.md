# NomadFS Specification
## The Sovereign Semantic Object Store

### 1. Overview
NomadFS eliminates the concept of "Files" and "Folders". Instead, it stores "Objects" (Blobs) that are Content-Addressed (Hash) and Semantically Indexed (Vector).

### 2. The Trinity of Data
Every piece of data in NomadFS has three components:
1.  **The Blob:** The raw data (Encrypted at rest).
2.  **The Merkle Hash:** The immutable ID of the data (e.g., `sha256:a7f...`).
3.  **The Semantic Vector:** The "meaning" of the data (e.g., `[0.1, -0.9, ...]`).

### 3. Architecture
#### Layer 1: The Block Store (NVMe)
*   **Role:** Raw storage management.
*   **Technology:** Log-Structured Merge (LSM) Tree.
*   **Optimization:** Writes strictly sequentially to maximize Flash lifespan and write speed (7GB/s).

#### Layer 2: The Object Store (Content Addressable)
*   **Role:** Deduplication and Verification.
*   **Logic:** If you save the same email twice, it is only stored once.
*   **Encryption:** `ChaCha20-Poly1305` encryption key is derived from the User's Root Key + The Object Hash.

#### Layer 3: The Semantic Layer (The "Folder" Replacement)
*   **Role:** Retrieval.
*   **Logic:** Instead of a Directory Table (`/home/docs`), we maintain a **Vector Index** (HNSW Graph).
*   **Query:** `fs.find(vector: "Project Nomad Specs")` -> Returns list of Object Hashes.

### 4. Integration with AI
*   **The Librarian:** Is effectively the "File System Driver." It manages Layer 3.
*   **GenUI:** Queries Layer 3 to find data to render.

### 5. The Replication Engine (Tri-Tier Sync)
A background process (`SyncDaemon`) manages data flow between tiers.

*   **Mode 1 (Local):** Default. Writes to local NVMe LSM Tree.
*   **Mode 2 (Mesh/TiKV):**
    *   **Trigger:** WiFi/LoRa adjacency detected.
    *   **Action:** Form Raft Consensus Group with neighbors.
    *   **Sync:** Replicate objects tagged `scope:clan`.
*   **Mode 3 (Cloud/TiDB):**
    *   **Trigger:** Uplink active (Satellite/LTE).
    *   **Action:** Connect to Federal TiDB Cluster (TiKV Backend).
    *   **Sync:** Replicate objects tagged `scope:federal` or `scope:strategic`.
    *   **Protocol:** Native TiKV Replication (Rust-to-Rust) for maximum efficiency and compatibility.

### 6. Implementation Strategy
*   **Crate:** `packages/nomad-os/storage`
*   **Traits:** `BlockDevice`, `ObjectStore`, `SemanticIndex`, `ReplicationProvider`.
*   **Adapters:** `LSMAdapter`, `TiKVAdapter` (Unified for Mesh and Cloud).
