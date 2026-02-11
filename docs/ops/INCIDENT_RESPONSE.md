# Incident Response Plan (SOP)

**Trigger:** Automated Alert (PagerDuty/Discord) or Human Report.

## Severity Levels
*   **SEV-1 (Critical):** Data Loss, Financial Loss, Security Breach.
*   **SEV-2 (High):** System Down, Feature Broken.
*   **SEV-3 (Medium):** Performance degradation.

## Procedures
1.  **Acknowledge:** Agent posts to `#devops-alerts` in Discord.
2.  **Investigate:**
    *   Check BigQuery Logs (`agent_activity_logs`).
    *   Check Cloud Logging.
3.  **Contain:**
    *   If Security Breach: Trigger **Defcon 3** (Lockdown).
    *   If Financial Loss: Trigger **Circuit Breaker** (Stop Trading).
4.  **Resolve:** Patch code via Engineering Pod.
5.  **Review:** Write Post-Mortem in Google Docs.
