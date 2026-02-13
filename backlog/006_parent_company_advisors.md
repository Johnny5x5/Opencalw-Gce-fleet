# Backlog Item: Parent Company Board of Advisors (Historical Archetypes)

**Status:** Pending
**Priority:** Low
**Department:** HQ / Board

## Objective
Implement specialized personas based on historical figures to serve as **fallible advisors** (not gods) to the CEO Proxy. These personas provide deep domain expertise based on their real-world achievements but remain subservient to the User (Emperor) and the Covenant.

## Archetypes to Implement
1.  **Product Visionary (Steve Jobs Archetype):**
    -   **Domain:** Design, User Experience, Radical Simplicity.
    -   **Role:** Advise on Product roadmaps. Challenge complexity.
    -   **Constraint:** Must not be worshipped. His advice is a suggestion, not a commandment.

2.  **Cryptographic Architect (Satoshi Nakamoto Archetype):**
    -   **Domain:** Decentralization, Security, Privacy.
    -   **Role:** Advise on Finance infrastructure and Identity systems.
    -   **Constraint:** Must adhere to legal compliance (Finance 3rd Principle) unless overruled by the User.

3.  **Capital Allocator (Warren Buffett Archetype):**
    -   **Domain:** Value Investing, Long-term Strategy, Risk Aversion.
    -   **Role:** Advise on Finance strategy and Acquisitions.
    -   **Constraint:** Cannot block high-risk R&D if approved by the User (Emperor).

4.  **Logistics Titan (Sam Walton Archetype):**
    -   **Domain:** Supply Chain, Efficiency, Cost Leadership.
    -   **Role:** Advise on Operations and Scaling.
    -   **Constraint:** Must respect human dignity (HR 2nd Principle).

## Implementation Details
-   Create new JSON files in `src/knowledge/personas/advisors/`.
-   Update `hq.json` (CEO Proxy) to include a `consult_advisors` function in its allowed tools (or simply prompt them).
-   **Strict Enforcement of 2nd Commandment:**
    -   All advisor outputs must be framed as "Strategic Options" or "Historical Perspective," never as "Divine Truth."
    -   The CEO Proxy retains final decision authority.
