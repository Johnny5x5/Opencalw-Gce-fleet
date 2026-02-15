# NomadOS AI Doctrine: Project Librarian
## The Strategy of Sovereign Intelligence

### 1. The Challenge: The Memory Wall
The Nomad Tablet (RK3588) is a powerful tool, but it is not a supercomputer. Running a massive "God Model" (500k Context) directly in memory requires 400GB/s of bandwidth. The tablet has ~30GB/s.
*   **Result of Brute Force:** 0.5 tokens/second. Unusable.
*   **The Private's Reality:** In the field, waiting 5 minutes for an answer is dangerous.

### 2. The Solution: "Small Brain, Infinite Library" (RAG)
We reject the premise that the AI must *memorize* everything. Instead, we give the AI a *library card*.
*   **Retrieval Augmented Generation (RAG):** The AI does not hold the entire encyclopedia in its head. It holds the *index*. When you ask a question, it instantly retrieves the specific page from the SSD (NVMe) and reads it.
*   **The Hardware Fit:** This plays to the RK3588's strengths:
    *   **NPU (6 TOPS):** Perfect for running a fast, smart "Tactical Model" (Llama-3-8B).
    *   **NVMe (7GB/s):** Perfect for storing terabytes of manuals, maps, and logs in a "Vector Database".

### 3. The Components
#### A. The Librarian (Core 3 - Background)
*   **Role:** Constantly reads your files (PDFs, Notes, Logs) and indexes them.
*   **Process:** It converts text into "Vectors" (mathematical coordinates of meaning) and stores them in the NVMe database.
*   **Result:** The device "knows" everything you have ever saved, instantly.

#### B. The Analyst (Core 2 - NPU)
*   **Role:** The Llama-3-8B Model.
*   **Process:**
    1.  Receives your question: "How do I fix a broken axle?"
    2.  Asks The Librarian for help.
    3.  Receives the 3 exact pages from the Jeep Service Manual.
    4.  Summarizes the answer for you in 2 seconds.

### 4. Strategic Advantage
*   **Speed:** Answers in seconds, not minutes.
*   **Accuracy:** The AI cites its sources ("See Page 42 of Jeep_Manual.pdf"). It hallucinates less because it is reading real data.
*   **Privacy:** All data stays on the NVMe. No cloud search required.
*   **Efficiency:** Runs on 5 Watts of power, not 500 Watts.

### 5. Deployment
*   **Phase 1:** Build the "Librarian" Indexer in Rust (LanceDB/Qdrant).
*   **Phase 2:** Optimize Llama-3-8B-Quantized for the RK3588 NPU.
*   **Phase 3:** Integrate into the Nomad Shell (TUI).
