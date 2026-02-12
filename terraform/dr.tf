# Disaster Recovery (DR) Infrastructure
# This file defines the resources for the secondary region.
# Currently commented out to save costs, but ready for "Defcon 1" activation.

# provider "google" {
#   alias  = "dr"
#   region = var.dr_region
# }

# module "hq_dr" {
#   source          = "./modules/department"
#   providers       = { google = google.dr }
#   project_id      = var.project_id
#   region          = var.dr_region
#   department_name = "hq-dr"
#   # ... (Network/Subnet needs to be replicated in DR region)
# }

# GCS Replication
# resource "google_storage_bucket" "dr_backup" {
#   name          = "${var.project_id}-dr-backup"
#   location      = "US" # Multi-region
#   versioning { enabled = true }
# }
