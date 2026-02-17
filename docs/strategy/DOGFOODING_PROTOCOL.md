# The Dogfooding Protocol: Survival of the Fittest

**Classification:** MANDATORY DOCTRINE // INTERNAL
**Enforcement:** War Games Inc. & The Chaplaincy

## 1. The Principle
**"We eat our own cooking before we serve it to the guests."**

We are building a "Sovereign Autonomous Enterprise." If our own software (NomadOS, Iron Ledger, Agents) cannot survive inside our own environment, it is unworthy of existence.

## 2. The Mandate
1.  **No Release without Blood:** No code reaches `main` (Gold Master) without passing a "Live Fire" exercise in The Arena.
2.  **Internal Customer First:**
    - The Parent Company is the **first customer** of War Games Inc.
    - The Parent Company is the **first customer** of the Chaplaincy (Moral Audit).
    - The Parent Company is the **first customer** of NomadOS (Infrastructure).
3.  **The Feedback Loop:** Failures in The Arena must result in immediate "Emergency Engineering Tickets" in the backlog.

## 3. Implementation
*   **The Gauntlet:** A CI/CD pipeline stage where the build is deployed to a "Target Box" and attacked by 5 "Red Team" agents for 1 hour.
*   **Success:** The system remains responsive and no data is exfiltrated.
*   **Failure:** The build is rejected, and the logs are sent to the War Council.
