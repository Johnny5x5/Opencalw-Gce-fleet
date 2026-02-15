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

### 3. The Query Router ("Scout & Commander" Protocol)
The Router implements the Functional Split (80/20 Rule) via the Bundle Protocol.

#### The Protocol
*   **Protocol Type:** `application/vnd.nomad.sitrep+cbor`
*   **Structure:**
    *   **SitRep (Situation Report):** Compressed summary from the Scout (Local).
        ```json
        {
          "type": "sitrep",
          "id": "sitrep-001",
          "timestamp": 1715788800,
          "context_hash": "sha256...",
          "summary": "User detected anomalous radio signal at 433MHz. GPS 34.05, -118.24. Requesting analysis.",
          "priority": "flash"
        }
        ```
    *   **Order (Mission Directive):** Strategic command from the Commander (Cloud).
        ```json
        {
          "type": "order",
          "id": "order-001",
          "ref_id": "sitrep-001",
          "directive": "Maintain radio silence. Signal signature matches known jammer. Move to secondary rally point.",
          "attachments": ["map_update.pdf"]
        }
        ```

#### Routing Logic
1.  **Tactical (Local):** Simple queries run on the 8B NPU model.
2.  **Strategic (Cloud):**
    *   **User Action:** Tags query `#strategic` or explicitly requests "Heavy Lift".
    *   **Scout Action:** Summarizes local context into a SitRep (1KB max).
    *   **Transmission:** SitRep is bundled and sent via Uplink.
    *   **Response:** Cloud replies with an Order bundle.

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
*   Implement `SitRepGenerator` to compress context.

### 5. Data Flow
`User Query` -> `Query Router`
    |-> [Tactical] -> `Embedder` -> `Local Vector Search` -> `Local NPU` -> `TUI`
    |-> [Strategic] -> `SitRep Generator` -> `Bundle Protocol` -> `Cloud Uplink` -> `Federal AI` -> `Downlink` -> `TUI`
