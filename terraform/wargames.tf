variable "enable_war_games" {
  description = "Enable the War Games Arena (200 Teams + VPC + Peering). High Cost Warning!"
  type        = bool
  default     = false
}

# 1. The Arena Network (Isolated VPC)
# Only created if War Games are enabled.
resource "google_compute_network" "wargames_vpc" {
  count                   = var.enable_war_games ? 1 : 0
  name                    = "wargames-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "wargames_subnet" {
  count                     = var.enable_war_games ? 1 : 0
  name                      = "wargames-subnet-01"
  ip_cidr_range             = "10.200.0.0/16" # Huge range for 200 teams
  region                    = var.region
  network                   = google_compute_network.wargames_vpc[0].id
  private_ip_google_access  = true
}

# 2. The "Switch" (VPC Peering)
# Allows the Main VPC (where War Council lives) to reach the Arena.
# Controlled by the same variable.

resource "google_compute_network_peering" "main_to_wargames" {
  count                = var.enable_war_games ? 1 : 0
  name                 = "main-to-wargames"
  network              = google_compute_network.vpc.id
  peer_network         = google_compute_network.wargames_vpc[0].id
  export_custom_routes = true
  import_custom_routes = true
}

resource "google_compute_network_peering" "wargames_to_main" {
  count                = var.enable_war_games ? 1 : 0
  name                 = "wargames-to-main"
  network              = google_compute_network.wargames_vpc[0].id
  peer_network         = google_compute_network.vpc.id
  export_custom_routes = true
  import_custom_routes = true
}

# 3. Firewall Rules for The Arena
# Allow internal communication between teams (Optional: Can block for harder mode)
resource "google_compute_firewall" "wargames_allow_internal" {
  count   = var.enable_war_games ? 1 : 0
  name    = "wargames-allow-internal"
  network = google_compute_network.wargames_vpc[0].name

  allow {
    protocol = "icmp"
  }
  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }
  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }
  source_ranges = ["10.200.0.0/16"]
}

# Allow War Council (from Main VPC 10.0.0.0/20) to access Arena
resource "google_compute_firewall" "wargames_allow_council" {
  count   = var.enable_war_games ? 1 : 0
  name    = "wargames-allow-council"
  network = google_compute_network.wargames_vpc[0].name

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "443", "3000", "8080"]
  }
  source_ranges = [var.subnet_cidr] # The main VPC range
}

# 4. Core War Game Teams (The Primary Colors)
# Explicitly defined with higher resources and specific roles.

module "team_red" {
  source   = "./modules/department"
  # Only create if war games are enabled
  count    = var.enable_war_games ? 1 : 0

  project_id      = var.project_id
  region          = var.region
  department_name = "team-red"

  vpc_network_id  = google_compute_network.wargames_vpc[0].id
  subnet_id       = google_compute_subnetwork.wargames_subnet[0].id

  # Red Team gets more power to attack
  min_replicas = 1
  max_replicas = 3
  machine_type = "e2-standard-2"

  startup_script    = data.local_file.bootstrap_script.content
  skills_gcs_url    = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id        = google_kms_crypto_key.conglomerate_key.id
}

module "team_blue" {
  source   = "./modules/department"
  count    = var.enable_war_games ? 1 : 0

  project_id      = var.project_id
  region          = var.region
  department_name = "team-blue"

  vpc_network_id  = google_compute_network.wargames_vpc[0].id
  subnet_id       = google_compute_subnetwork.wargames_subnet[0].id

  # Blue Team gets standard power to defend
  min_replicas = 1
  max_replicas = 3
  machine_type = "e2-standard-2"

  startup_script    = data.local_file.bootstrap_script.content
  skills_gcs_url    = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id        = google_kms_crypto_key.conglomerate_key.id
}

module "team_green" {
  source   = "./modules/department"
  count    = var.enable_war_games ? 1 : 0

  project_id      = var.project_id
  region          = var.region
  department_name = "team-green"

  vpc_network_id  = google_compute_network.wargames_vpc[0].id
  subnet_id       = google_compute_subnetwork.wargames_subnet[0].id

  min_replicas = 1
  max_replicas = 2
  machine_type = "e2-medium"

  startup_script    = data.local_file.bootstrap_script.content
  skills_gcs_url    = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id        = google_kms_crypto_key.conglomerate_key.id
}

module "team_black" {
  source   = "./modules/department"
  count    = var.enable_war_games ? 1 : 0

  project_id      = var.project_id
  region          = var.region
  department_name = "team-black"

  vpc_network_id  = google_compute_network.wargames_vpc[0].id
  subnet_id       = google_compute_subnetwork.wargames_subnet[0].id

  # Black team is small but agile
  min_replicas = 1
  max_replicas = 1
  machine_type = "e2-medium"

  startup_script    = data.local_file.bootstrap_script.content
  skills_gcs_url    = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id        = google_kms_crypto_key.conglomerate_key.id
}

# 5. The Grunt Army (Remaining Teams)
# Dynamically generated using `range` if enabled.
# We skip the first 4 "colors" effectively, or just add them as extra targets.
# To keep it simple, we just generate team-001 to team-196.
locals {
  team_ids = var.enable_war_games ? [for i in range(1, 197) : format("team-%03d", i)] : []
}

module "war_game_team" {
  source   = "./modules/department"
  for_each = toset(local.team_ids)

  project_id      = var.project_id
  region          = var.region
  department_name = each.key

  vpc_network_id  = google_compute_network.wargames_vpc[0].id
  subnet_id       = google_compute_subnetwork.wargames_subnet[0].id

  min_replicas = 1
  max_replicas = 1
  machine_type = "e2-micro"

  startup_script    = data.local_file.bootstrap_script.content
  skills_gcs_url    = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id        = google_kms_crypto_key.conglomerate_key.id
}
