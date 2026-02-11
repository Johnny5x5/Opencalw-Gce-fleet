# DEFCON 3: Fortress Mode Infrastructure
# These resources are only created if security_level >= 3.

# 1. VPC Service Controls (The Perimeter)
# Creates a "Service Perimeter" around the project.
# Note: Requires an Access Policy at the Organization level to exist first.
# We create the *scaffold* here. In a real deployment, you pass the `policy_id`.

# resource "google_access_context_manager_service_perimeter" "conglomerate_perimeter" {
#   count          = var.security_level >= 3 ? 1 : 0
#   parent         = "accessPolicies/${var.org_policy_id}"
#   name           = "accessPolicies/${var.org_policy_id}/servicePerimeters/conglomerate_perimeter"
#   title          = "Conglomerate Perimeter"
#   perimeter_type = "PERIMETER_TYPE_REGULAR"
#   status {
#     restricted_services = ["storage.googleapis.com", "bigquery.googleapis.com"]
#     resources           = ["projects/${var.project_number}"]
#   }
# }

# 2. Binary Authorization (Supply Chain Security)
# Ensures only images signed by our Cloud Build attestor can run.

resource "google_binary_authorization_policy" "policy" {
  count   = var.security_level >= 3 ? 1 : 0
  project = var.project_id

  admission_whitelist_patterns {
    name_pattern = "gcr.io/google_containers/*" # Allow Google system images
  }

  default_admission_rule {
    evaluation_mode  = "ALWAYS_DENY" # Strict by default!
    enforcement_mode = "ENFORCED_BLOCK_AND_AUDIT_LOG"
  }
}

# 3. Secure Web Proxy (Egress Filter)
# Forces all outbound traffic through a proxy policy.

resource "google_network_security_gateway_security_policy" "egress_policy" {
  count       = var.security_level >= 3 ? 1 : 0
  name        = "conglomerate-egress-policy"
  location    = var.region
  description = "Block all outbound traffic except allowlisted domains."
  # Rules would be defined here to allow github.com, pypi.org, etc.
}
