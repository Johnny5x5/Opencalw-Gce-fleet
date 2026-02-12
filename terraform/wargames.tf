# War Games Configuration
# This file defines the 20 adversarial teams for the "OpenClaw War Game".
# Each team is a distinct department with its own resources, simulating a large-scale
# internal competition or stress test.

locals {
  war_teams = [
    "red", "blue", "green", "yellow", "orange",
    "purple", "cyan", "magenta", "lime", "pink",
    "teal", "lavender", "maroon", "olive", "navy",
    "aquamarine", "turquoise", "silver", "gold", "black"
  ]
}

# Iterate over the list of teams and create a department for each
module "war_game_team" {
  source   = "./modules/department"
  for_each = toset(local.war_teams)

  project_id      = var.project_id
  region          = var.region
  department_name = "team-${each.key}" # e.g., team-red, team-blue
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id

  # Resource Allocation for War Games
  # Note: 20 teams * 1 instance = 20 instances minimum.
  # Ensure project quotas allow for this (approx 40 vCPUs).
  min_replicas = 1
  max_replicas = 2
  machine_type = "e2-standard-2"

  # Standard Bootstrap & Skills
  startup_script    = data.local_file.bootstrap_script.content
  skills_gcs_url    = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id        = google_kms_crypto_key.conglomerate_key.id
}
