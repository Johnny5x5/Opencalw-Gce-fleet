# ADR-005: Post-App Paradigm (Generative UI)

## Status
Accepted

## Context
Traditional operating systems (Android, Windows) rely on static "Apps" that trap data. This forces the user to be the integration layer. NomadOS aims to be an AI-First competitor.

## Decision
We adopt the **Post-App Paradigm**:
1.  **No Apps:** We replace static binaries with **Intents** (e.g., "Plan Trip").
2.  **GenUI:** The NPU generates the Interface (UIDL) in real-time based on context.
3.  **Polymorphic Scaling:** The UI physically restructures itself based on device form factor (Phone vs. Station) via kernel core reallocation.

## Consequences
*   **Positive:** Massive reduction in user friction. True "AI-First" experience.
*   **Negative:** High NPU load. Radical departure from existing UX conventions.
*   **Reference:** `docs/strategy/POST_APP_PARADIGM.md`
