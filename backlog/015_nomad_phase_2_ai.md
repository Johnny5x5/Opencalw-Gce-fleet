# NomadOS Phase 2: Project Librarian (RAG Architecture)
## The Intelligent Nomad

### Overview
Implementation plan for the "Librarian" system, enabling the Nomad Tablet (RK3588) to perform Retrieval Augmented Generation (RAG) using a local Vector Database and 8B LLM.

### Epics
#### EPIC-200: The Librarian Core (Rust Indexer)
*   **Ticket-201:** Implement `Indexer` struct in `nomad-ai-core` using `lance` (LanceDB) or `qdrant-client`.
    *   *Acceptance Criteria:* Can ingest a directory of `.txt` files and generate a persistable vector index.
*   **Ticket-202:** Implement `TextChunker` utility.
    *   *Acceptance Criteria:* Splits text into 500-token overlapping chunks.
*   **Ticket-203:** Implement `Embedder` trait for `all-MiniLM-L6-v2`.
    *   *Acceptance Criteria:* Converts string -> `Vec<f32>` (384 dimensions).

#### EPIC-210: The Vector Store (NVMe Optimization)
*   **Ticket-211:** Optimize LanceDB configuration for NVMe RAID 0.
    *   *Task:* Tune page cache and I/O settings for high throughput.
*   **Ticket-212:** Implement "Zero-Copy" search path.
    *   *Task:* Map vector index directly from disk to memory (mmap).

#### EPIC-220: The Neural Engine (NPU Integration)
*   **Ticket-221:** Port `all-MiniLM-L6-v2` (Embedding Model) to RK3588 NPU format (`.rknn`).
    *   *Task:* Use `rknn-toolkit2` to convert ONNX model.
*   **Ticket-222:** optimize Llama-3-8B-Quantized for RK3588 NPU.
    *   *Task:* Ensure `rknpu2` backend is used for inference.

#### EPIC-230: The User Experience (TUI Integration)
*   **Ticket-231:** Add "Library" Tab to `nomad-userland` TUI.
    *   *Feature:* Browse indexed files, search status.
*   **Ticket-232:** Implement "Ask Librarian" command in Console.
    *   *Feature:* `ask "How to fix axle?"` -> Displays retrieved context + AI summary.

### Dependencies
*   `rust-lance` crate.
*   `rknpu2` driver (external binary blob).
*   `text-splitter` crate.
