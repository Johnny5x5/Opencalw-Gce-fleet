# The National Library of the Sovereign Digital Nation
**Classification:** PUBLIC / CIVIC
**Version:** 2.0 (Refined Architecture)
**Vision:** An AI-First Repository of Universal Truth, Federated across the Republic.

## 1. Core Philosophy: The AI-First Knowledge Graph
Unlike a traditional library which stores "books" for humans, this library stores "vectors" and "ontologies" for AI.
*   **The Atom:** The fundamental unit of knowledge is not a "File", but a "Semantic Chunk" (Concept).
*   **The Retrieval:** Knowledge is not "searched" by keyword, but "retrieved" by intent (RAG - Retrieval Augmented Generation).
*   **The Citation:** Every output must be cryptographically linked to its source (The Iron Ledger).

## 2. Technical Architecture
The Library is built as a modular software system (`packages/national-library`).

### 2.1 The "Scribe" (Ingestion Pipeline)
*   **Function:** Converts raw human formats (PDF, Markdown, HTML) into machine understanding.
*   **Process:**
    1.  **Normalization:** Clean text, remove artifacts.
    2.  **Metadata Extraction:** Identify Author, Date, Classification, and Sensitivity.
    3.  **Chunking:** Split text into semantic units (e.g., "Paragraph", "Article").
    4.  **Embedding:** Generate vector embeddings (using `nomic-embed-text-v1.5`).
    5.  **Indexing:** Store vectors in `LanceDB` (Serverless Vector Database).

### 2.2 The "Librarian" (Retrieval Engine)
*   **Function:** Serves truth to AI agents.
*   **API:**
    *   `search(query: string, filter: Metadata)` -> `Chunk[]`
    *   `citation(chunk_id: string)` -> `SourceDocument`
*   **Optimization:** Uses "Hybrid Search" (Keyword BM25 + Semantic Vector) for precision.

### 2.3 Storage Layer (Tri-Tier Preservation)
*   **Tier 1 (Hot/Vectors):** LanceDB (Fast, Local/Cloud Hybrid).
*   **Tier 2 (Warm/Raw):** Object Storage (GCS/S3) for full text retrieval.
*   **Tier 3 (Cold/Deep):** M-DISC (1000-Year Physical Media) and LTO Tape (Off-site Vault).

## 3. Federation Protocol (The Knowledge Mesh)
The National Library is the *hub*, but knowledge is distributed.
*   **Corporate Silos:** Each Corporation (e.g., "Sovereign Engineering") maintains a private `PrivateLibrary`.
*   **Public Routing:** Any metadata classified as `PUBLIC` or `CIVIC` is automatically routed to the National Library via the Federation Protocol.
*   **Schema:** All nodes speak the "Universal Knowledge Graph" (RDF/Protobuf) to ensure interoperability.

## 4. Ontology (Universal Knowledge Graph)
We define standard entities to structure the chaos.
*   `Entity: Document` (The source file)
*   `Entity: Concept` (An abstract idea, e.g., "Liberty")
*   `Entity: Law` (A binding rule, e.g., "Thou shalt not steal")
*   `Entity: Agent` (The author or subject)

## 5. Access Control (The Gatekeeper)
*   **Public Wing:** Constitution, Laws, Public Records (Open to all Citizens).
*   **Sacred Wing:** Religious Texts (Bible, Torah, Gospels) (Open to all Citizens).
*   **Restricted Wing:** War Council Strategy, Encryption Keys (Restricted to Generals).

## 6. Integration
*   **Skills:** The `central-archive-access` skill wraps this library software.
*   **Agents:** The "Archivist" persona manages this system.
