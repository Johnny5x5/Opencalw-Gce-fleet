# Backlog Item: War Council Mini-Library

**Status:** Pending
**Priority:** Medium
**Department:** War Council

## Objective
Establish a formal "Mini-Library" for the War Council to govern the War Games, ensuring they remain productive stress tests and do not devolve into chaos.

## Requirements

1.  **Directory Structure:**
    -   Create `src/knowledge/war_council/`.

2.  **Content:**
    -   **Rules of Engagement (ROE) `roe.md`:**
        -   Define prohibited targets (e.g., Production Database, Payroll).
        -   Define allowed attack vectors (e.g., DDoS, SQL Injection, Social Engineering).
        -   Define strict "Cease Fire" conditions.
    -   **Scenarios `scenarios.json`:**
        -   `Capture the Flag`: Steal a specific file from the adversary's GCS bucket.
        -   `King of the Hill`: Maintain uptime on a service while under attack.
        -   `Data Heist`: Exfiltrate "dummy" PII without detection.
    -   **Adjudication Protocols `adjudication.json`:**
        -   Scoring logic for wins/losses.
        -   Penalties for violating ROE.

3.  **Integration:**
    -   Update the `war_council.json` persona to explicitly reference these documents as its "Law".
