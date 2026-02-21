# Hyperscale Engine (Software Dominance Class)
# Only enabled if `enable_hyperscale` is explicitly set to true.
# Includes Circuit Breakers to prevent accidental bankruptcy.

module "hyperscale_engine" {
  source             = "./modules/hyperscale_engine"
  count              = var.enable_hyperscale ? 1 : 0
  project_id         = var.project_id
  region             = var.region
  billing_account_id = var.billing_account_id
}
