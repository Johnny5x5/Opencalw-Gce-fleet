# Backlog Item: War Games Refinement (Colors & Adversaries)

**Status:** Pending
**Priority:** High
**Department:** War Council / DevOps

## Objective
Refine the "War Games Arena" from generic team IDs (`team-001`...`team-200`) to a structured, adversarial system with specific team identities and roles.

## Requirements

1.  **Adversarial Mapping:**
    -   Define a `map` of teams with specific properties:
        -   **Name:** `Red`, `Blue`, `Green`, `Black`, `White`, `Gold`, `Silver`, etc.
        -   **Adversary:** Each team must have a designated "Primary Rival" (e.g., Red vs Blue).
        -   **Role:** `Attacker` (Aggressor), `Defender` (Guardian), `Observer` (Neutral), `Innovator` (Builder).

2.  **Implementation:**
    -   Update `terraform/wargames.tf` to use a `map(object)` variable instead of a simple `range`.
    -   Dynamically assign the correct persona (`wargame_red.json`, `wargame_blue.json`, etc.) based on the team name.

3.  **Scale:**
    -   Ensure the system still supports up to 200 teams, potentially by using procedurally generated names/colors if a manual list is exhaustive (e.g., `Red-Alpha`, `Red-Beta`).

4.  **Networking:**
    -   Verify that adversarial pairs have specific firewall rules allowing interaction (attacks) while blocking others if desired.
