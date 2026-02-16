# The National Library of the Sovereign Digital Nation
**Classification:** PUBLIC / CIVIC
**Version:** 1.0 (Architecture)
**Vision:** An AI-First Repository of Universal Truth.

## 1. Core Philosophy: AI-First Knowledge Graph
Unlike a traditional library which stores "books" for humans, this library stores "vectors" for AI.
*   **The Atom:** The fundamental unit of knowledge is not a "File", but a "Semantic Chunk".
*   **The Retrieval:** Knowledge is not "searched" by keyword, but "retrieved" by intent (RAG - Retrieval Augmented Generation).
*   **The Citation:** Every output must be cryptographically linked to its source (The Iron Ledger).

## 2. Technical Architecture
The Library is built as a modular software system (`packages/national-library`).

### 2.1 The "Scribe" (Ingestion Pipeline)
*   **Function:** Converts raw human formats (PDF, Markdown, HTML) into machine understanding.
*   **Process:**
    1.  **Normalization:** Clean text, remove artifacts.
    2.  **Chunking:** Split text into semantic units (e.g., "Paragraph", "Article").
    3.  **Embedding:** Generate vector embeddings (using `nomic-embed-text-v1.5`).
    4.  **Indexing:** Store vectors in `LanceDB` (Serverless Vector Database).

### 2.2 The "Librarian" (Retrieval Engine)
*   **Function:** Serves truth to AI agents.
*   **API:**
    *   `search(query: string, filter: Metadata)` -> `Chunk[]`
    *   `citation(chunk_id: string)` -> `SourceDocument`
*   **Optimization:** Uses "Hybrid Search" (Keyword + Semantic) for precision.

### 2.3 Storage Layer
*   **Hot Storage (Vectors):** LanceDB (Fast, Local/Cloud Hybrid).
*   **Cold Storage (Raw):** Object Storage (GCS/S3) + M-DISC (Physical Backup).
*   **Metadata:** SQLite / TiKV (Relational Metadata).

## 3. Access Control (The Gatekeeper)
*   **Public Wing:** Constitution, Laws, Public Records (Open to all Citizens).
*   **Sacred Wing:** Religious Texts (Open to all Citizens).
*   **Restricted Wing:** War Council Strategy, Encryption Keys (Restricted to Generals).

## 4. Integration
*   **Skills:** The `central-archive-access` skill wraps this library software.
*   **Agents:** The "Archivist" persona manages this system.
