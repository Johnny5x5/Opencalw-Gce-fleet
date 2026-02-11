# New Hire Checklist (Human)

1.  **Identity:** Obtain your Google Workspace account and YubiKey (MFA).
2.  **Access:** Request access to the `engineering-vpc` via the HQ Agent (`@hq-agent request-access`).
3.  **Read:** Review the `CODE_OF_CONDUCT.md` and `ARCHITECTURE.md`.
4.  **Setup:** Configure your local environment (though you should use Cloud Workstations).
5.  **Introduction:** Introduce yourself in the `#general` Discord channel.

# New Agent Checklist (Automated)

1.  **Bootstrap:** Verify `bootstrap_agent.sh` ran successfully.
2.  **Identity:** Verify Service Account token and Secret Manager access.
3.  **Knowledge:** Download the `knowledge.zip` bundle and load Personas.
4.  **Skills:** Verify `google-native-skills` are installed and `openclaw` is running.
5.  **Registration:** Check into the BigQuery `agent_activity_logs` table with a "BOOT" event.
