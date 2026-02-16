# The Mobius Decision Engine (v2.0 - Federated)
**Version:** 2.0
**Architecture:** Federated API Gateway
**Objective:** A "Mobius Strip" orchestrator that connects ANY Social Group to the Council APIs for verification.

## 1. The Core Philosophy
The Mobius Strip is not a monolith; it is a **Gateway**.
*   **Social Groups (Clients):** Independent communities (e.g., "The Guild", "Gamers", "Soldiers") use their own APIs.
*   **The Hub:** The Mobius Engine orchestrates the flow of proposals from these groups through the specialized Council APIs.

## 2. The Federated Components
Everything is an API.
*   **War Council API (`packages/war-council-api`):** Strategic auditing.
*   **Chaplaincy API (`packages/chaplaincy-api`):** Moral auditing.
*   **Scribes API (`packages/scribes-api`):** Historical context.

## 3. The Flow (The Twist)
1.  **Input:** Social Group sends `POST /deliberate` with a proposal.
2.  **Context:** Mobius calls `GET /history/context` (Scribes).
3.  **Strategy:** Mobius calls `POST /strategy/audit` (War Council).
4.  **Morality:** Mobius calls `POST /moral/audit` (Chaplaincy).
5.  **Refinement:** If rejected, Mobius loops back with feedback (The Twist).
6.  **Edict:** Approved proposal is returned to the Social Group.

## 4. Integration
Any AI team or tool can plug into this strip via the `SocialGroup` interface (`packages/social-verification/schemas/social_group.proto`).
