# ADR-002: Functional AI Split ("Scout & Commander")

## Status
Accepted

## Context
NomadOS must operate in high-latency, intermittent network environments (DTN) while leveraging massive AI models (70B+ parameters) that cannot fit on the tablet hardware (RK3588).
We evaluated:
1.  **Split Inference (Tensor Parallelism):** Splitting one model across the network. Rejected due to latency intolerance (speed of light lag freezes generation).
2.  **Functional Split:** Using distinct local and cloud models.

## Decision
We adopt the **"Scout & Commander" Functional Split**:
1.  **The Scout (Local):** An 8B Quantized Model running on the RK3588 NPU using RAG (The Librarian). It handles 80% of tactical queries autonomously.
2.  **The Commander (Cloud):** A 70B+ Model running in the Federal Cloud. It handles "Strategic" queries sent via compressed "SitRep" bundles.

## Consequences
*   **Positive:** Full offline autonomy. Massive bandwidth savings (Text vs Tensors). High energy efficiency.
*   **Negative:** State synchronization between Scout and Commander is asynchronous.
*   **Reference:** `docs/strategy/AI_SPLIT_DISSERTATION.md`
