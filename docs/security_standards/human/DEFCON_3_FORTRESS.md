# DEFCON 3: Fortress (DoD IL4 / CMMC Level 3)

**Objective:** Defense against Advanced Persistent Threats (APTs) and IP Theft.
**Risk Profile:** High. Protecting Trade Secrets or Government Data.
**Cost:** High (~$300+/mo). **Friction:** High.

## Technical Controls (Includes Level 2)
*   **Perimeter:**
    *   **VPC Service Controls (VPC-SC):** A "Force Field" preventing API calls from outside the trusted network, even with valid credentials.
*   **Egress Filter:**
    *   **Secure Web Proxy:** All outbound traffic is blocked by default.
    *   **Allowlist:** Only `github.com`, `googleapis.com`, `pypi.org` allowed.
    *   **DNS:** Private DNS only. No public resolution.
*   **Supply Chain:**
    *   **Binary Authorization:** Only container images signed by Cloud Build can run.
    *   **Artifact Registry:** Private mirror of npm/pypi. Direct internet install blocked.

## Operational Policy
*   **Two-Person Rule:** Destructive actions require human approval via Hardware Token.
*   **Code:** `main` branch protected. Cloud Build signs artifacts.
