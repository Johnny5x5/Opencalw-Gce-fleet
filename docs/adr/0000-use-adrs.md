# ADR-0000: Use Architecture Decision Records (ADR)

## Status
Accepted

## Context
NomadOS is a complex, high-stakes project involving novel architectures (Unikernels, RAG OS, Sovereign AI). "Social conventions" dictate that future contributors must understand *why* decisions were made, not just *what* the code does.

## Decision
We will use Architecture Decision Records (ADRs) to capture important architectural decisions, along with their context and consequences. We will store these in `docs/adr`.

## Consequences
*   **Positive:** Clear history of "Why". Prevents re-litigating settled debates (e.g., Kernel Wars).
*   **Negative:** Maintenance overhead to keep ADRs updated.
