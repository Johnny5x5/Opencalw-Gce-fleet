# DEFCON 2: Commercial Compliance (Current Baseline)

**Objective:** Audit readiness for Finance (PCI-DSS) and Healthcare (HIPAA).
**Risk Profile:** Moderate. Holding customer money or health data.
**Cost:** Moderate (~$100/mo).

## Technical Controls (Includes Level 1)
*   **Encryption (NIST 800-53 SC-28):**
    *   **CMEK (Customer Managed Encryption Keys):** All buckets and disks encrypted with Cloud KMS.
    *   **Data in Transit:** TLS 1.2+ mandatory.
*   **Audit (NIST 800-53 AU-2):**
    *   **Data Access Logs:** Enabled for Admin, Read, and Write operations on Storage, BigQuery, and SQL.
    *   **Retention:** Logs kept for 1 year (Coldline).
*   **Compute:**
    *   **Confidential Computing (AMD SEV):** Enabled for Finance/High-Risk workloads. RAM is encrypted.

## Operational Policy
*   **Access:** No direct access to Production data. Agents use Service Accounts. Humans use "Break Glass" accounts.
