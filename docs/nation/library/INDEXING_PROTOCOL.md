# The Librarian's Indexing Protocol (Project "Alexandria")
**Protocol:** LIB-001
**Objective:** To ingest, verify, and vectorize "Universal Truth" into the National Library for semantic retrieval by the AI workforce.

## 1. The Canonization Process (Ingestion)
Before a document enters the Library, it must pass the "Canonization" ritual to ensure it aligns with the Constitution.
1.  **Submission:** An agent submits a document (PDF, MD, TXT) to the `library.inbox` queue.
2.  **Verification:** The Librarian checks the document against the **Statute of Clarity** (Anti-Mysticism).
    *   *Check:* Does it contain "black box" logic?
    *   *Check:* Does it violate the Ten Commandments (e.g., idolatry)?
3.  **Indexing:** If approved, the document is assigned a `canonical_id` (SHA-512 hash) and stored in Cold Storage (M-DISC).

## 2. Vectorization Strategy (Semantic Search)
To make Truth accessible to AI, we convert text into mathematical vectors.
*   **Engine:** LanceDB (Local/Embedded).
*   **Model:** `nomic-embed-text-v1.5` (Open Source, High Performance).
*   **Chunking:** "Semantic Chunking" based on headers and paragraphs, preserving context.
*   **Metadata:** Every vector is tagged with:
    *   `source`: (e.g., "Bible KJV")
    *   `authority`: (e.g., "Divine", "Constitutional", "Historical")
    *   `timestamp`: Ingestion time.

## 3. The Citation Requirement
The "Iron Ledger" requires that every moral decision be cited.
*   **Rule:** An AI agent cannot say "I denied this transaction."
*   **Requirement:** It must say "I denied this transaction *citing* [Constitution Article I, Section 2] and [Leviticus 19:11]."
*   **Mechanism:** The `library-access` skill returns the `citation_ref` which must be included in the agent's decision log.

---
**Status:** Protocol Active.
