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

### 4. Hybrid Intelligence: "The Tether" (80/20 Rule)
While the local Analyst (8B Model) handles 80% of tasks, some missions require massive reasoning power (e.g., decrypting complex patterns, analyzing satellite imagery, or running 500k-token legal reviews).

*   **The 20% Solution:**
    *   **The Router:** A lightweight classifier determines if a query is "Tactical" (Local) or "Strategic" (Cloud).
    *   **The Bundle:** Strategic queries are packaged into an encrypted bundle (`type: "ai_heavy_lift"`) and sent via the Uplink when connectivity allows.
    *   **The Federal Brain:** The Cloud Backend processes the request using a massive "God Model" (e.g., Gemini 1.5 Pro) and returns the answer in the next downlink bundle.
    *   **Result:** You get "Supercomputer" answers, just with a time delay.

### 5. Strategic Advantage
*   **Speed:** Answers in seconds, not minutes (for 80% of tasks).
*   **Accuracy:** The AI cites its sources ("See Page 42 of Jeep_Manual.pdf"). It hallucinates less because it is reading real data.
*   **Privacy:** All data stays on the NVMe. No cloud search required unless explicitly requested.
*   **Efficiency:** Runs on 5 Watts of power, not 500 Watts.

### 6. Deployment
*   **Phase 1:** Build the "Librarian" Indexer in Rust (LanceDB/Qdrant).
*   **Phase 2:** Optimize Llama-3-8B-Quantized for the RK3588 NPU.
*   **Phase 3:** Integrate into the Nomad Shell (TUI).
*   **Phase 4:** Implement "The Tether" Query Router for Cloud handoff.
