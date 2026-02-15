# NomadOS RAG Architecture
## The Librarian Technical Specification

### 1. Overview
The "Librarian" is a userspace daemon (Core 3/Storage) that indexes all user-provided data (PDFs, Markdown, Maps) into a local Vector Database, allowing the 8B LLM (Core 2/NPU) to retrieve relevant context instantly.

### 2. Components
#### A. The Indexer (Rust - Core 3)
*   **Role:** Background worker that watches filesystem changes.
*   **Library:** `lance` (LanceDB) or `qdrant-client` (Rust).
*   **Process:**
    1.  **Ingest:** Read file (PDF/MD/TXT).
    2.  **Chunk:** Split into 500-token segments (overlapping).
    3.  **Embed:** Use a tiny, fast Embedding Model (e.g., `all-MiniLM-L6-v2`) running on CPU/NPU to convert text to vectors.
    4.  **Store:** Save vectors + metadata to the NVMe Vector DB.

#### B. The Vector Store (NVMe - RAID 0)
*   **Technology:** LanceDB (Embedded, Serverless, Native Rust).
*   **Storage Path:** `/data/nomad/library/vectors.lance`
*   **Performance:**
    *   **Search Speed:** < 50ms for 1M vectors.
    *   **Disk I/O:** Sequential reads optimized for NVMe.

#### C. The Retriever (Rust - Core 2)
*   **Role:** Intercepts user queries before they hit the LLM.
*   **Process:**
    1.  User asks: "How to purify water?"
    2.  Retriever embeds query: `[0.1, -0.5, ...]`
    3.  Retriever searches Vector Store for nearest neighbors (Cosine Similarity).
    4.  Retriever fetches top 3 chunks (e.g., from `survival_manual.pdf`).
    5.  Retriever constructs prompt:
        ```
        Context:
        [Chunk 1: Boiling kills 99.9%...]
        [Chunk 2: Iodine tablets dosage...]

        User Question: How to purify water?
        Answer based on Context:
        ```

#### D. The Generator (NPU - Core 2)
*   **Model:** Llama-3-8B-Quantized (Int4/Int8).
*   **Runtime:** `rknpu2` (Rockchip NPU) or `ggml` with NPU backend.
*   **Output:** Streams tokens to the TUI.

### 3. The Query Router (Hybrid Intelligence)
To implement the **80/20 Rule** ("The Tether"), the Query Router acts as a gateway before the Librarian.

*   **Logic:**
    1.  **Complexity Check:** If query length > 500 tokens OR user explicitly tags `#strategic`, Route to Cloud.
    2.  **Capability Check:** If query asks for "Satellite Analysis" or "Encryption Breaking" (tasks beyond 8B capabilities), Route to Cloud.
    3.  **Default:** Route to Local Librarian (8B Model).

*   **Cloud Handoff Protocol:**
    *   If routed to Cloud:
        1.  Create Bundle: `type: "ai_heavy_lift"`, `priority: "flash"`.
        2.  Payload: `{ "query": "Analyze these coordinates...", "context": [User Attached Files] }`.
        3.  Wait for Uplink Response (Async).
        4.  TUI displays: `[CLOUD] Request Sent. Estimated Reply: 20s`.

### 4. Implementation Plan
#### Phase 1: The Core Library (Rust)
*   Create `packages/nomad-os/ai-core/src/librarian.rs`.
*   Implement `Indexer` struct using `lance`.
*   Implement `Retriever` struct.

#### Phase 2: The Embedding Model
*   Port `all-MiniLM-L6-v2` to `rknpu2` format (`.rknn`).
*   Implement `Embedder` trait in `nomad-drivers`.

#### Phase 3: The LLM Integration
*   Update `nomad-ai-core` to wrap the `Retriever` -> `Generator` pipeline.
*   Expose `ask_librarian(query: &str)` API to the TUI.

#### Phase 4: The Router Integration
*   Implement `QueryRouter` struct in `nomad-ai-core`.
*   Connect `QueryRouter` to `nomad-system`'s Bundle Protocol interface.

### 5. Data Flow
`User Query` -> `Query Router`
    |-> [Tactical] -> `Embedder` -> `Local Vector Search` -> `Local NPU` -> `TUI`
    |-> [Strategic] -> `Bundle Protocol` -> `Cloud Uplink` -> `Federal AI` -> `Downlink` -> `TUI`
