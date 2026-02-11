# DEFCON 1: Startup Standard

**Objective:** Rapid development, market fit, low friction.
**Risk Profile:** Low. No sensitive PII/PHI.
**Cost:** Low (~$50/mo).

## Technical Controls
*   **Networking:**
    *   Private IPs Only (No Public IPs on VMs).
    *   Cloud NAT for outbound internet access.
    *   Identity-Aware Proxy (IAP) for SSH access.
*   **Identity:**
    *   Separate Service Accounts per Department.
    *   Least Privilege IAM (mostly).
*   **Data:**
    *   Standard GCS Encryption (Google-Managed Keys).
    *   Standard backups.

## Operational Policy
*   **Code:** Developers push to `main`. CI runs tests.
*   **Access:** Engineers have `Editor` access to dev project.
