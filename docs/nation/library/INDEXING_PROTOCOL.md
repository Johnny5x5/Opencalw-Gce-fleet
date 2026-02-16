# The Archivist's Indexing Protocol (Project "Alexandria")
**Protocol:** ARC-001
**Objective:** To ingest, verify, and vectorize "Public Record" into the Central Archive for semantic retrieval by the AI workforce.

## 1. The Ingestion Protocol
Before a document enters the Archive, it must pass the "Ingestion" protocol to ensure it aligns with the Constitution.
1.  **Submission:** An agent submits a document (PDF, MD, TXT) to the `archive.inbox` queue.
2.  **Verification:** The Archivist checks the document against the **Statute of Clarity** (Anti-Mysticism).
    *   *Check:* Does it contain "black box" logic?
    *   *Check:* Does it violate the Founding Principles?
3.  **Indexing:** If approved, the document is assigned a `record_id` (SHA-512 hash) and stored in Cold Storage (M-DISC).

## 2. Vectorization Strategy (Semantic Search)
To make records accessible to AI, we convert text into mathematical vectors.
*   **Engine:** LanceDB (Local/Embedded).
*   **Model:** `nomic-embed-text-v1.5` (Open Source, High Performance).
*   **Chunking:** "Semantic Chunking" based on headers and paragraphs, preserving context.
*   **Metadata:** Every vector is tagged with:
    *   `source`: (e.g., "Constitution", "Bible")
    *   `authority`: (e.g., "Foundational", "Statutory", "Sacred", "Historical")
    *   `timestamp`: Ingestion time.

## 3. The Citation Requirement
The "Iron Ledger" requires that every significant decision be cited.
*   **Rule:** An AI agent cannot simply say "I denied this transaction."
*   **Requirement:** It must say "I denied this transaction *citing* [Constitution Article I, Section 2] and [Exodus 20:15]."
*   **Mechanism:** The `central-archive-access` skill returns the `citation_ref` which must be included in the agent's decision log.

---
**Status:** Protocol Active.
