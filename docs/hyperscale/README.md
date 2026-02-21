# Hyperscale Engine (Software Dominance Class)

**Warning:** This capability is designed for **Global Scale** (3 Million Projects). Enabling it may incur significant costs.

## The Vision
*   **The Index:** A BigQuery database tracking metadata for every major open-source project.
*   **The Factory:** A dynamic pipeline that spawns ephemeral infrastructure for 200+ active projects in parallel.

## Safety Mechanisms
*   **Disabled by Default:** You must explicitly set `enable_hyperscale = true` in `terraform.tfvars`.
*   **Circuit Breaker:** A Google Cloud Budget Alert is configured to cap spend at **$100**. If crossed, it sends a kill signal to the Factory Queue.

## Activation
1.  Set `enable_hyperscale = true`.
2.  Provide `billing_account_id`.
3.  Run `terraform apply`.
