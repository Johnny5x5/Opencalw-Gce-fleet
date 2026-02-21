# Google Cloud Source Repository
resource "google_sourcerepo_repository" "repo" {
  name    = "openclaw-conglomerate"
  project = var.project_id
}

# Cloud Build Trigger (Continuous Deployment)
resource "google_cloudbuild_trigger" "deploy_trigger" {
  name        = "conglomerate-deploy"
  description = "Deploys infrastructure and skills on push to main."
  project     = var.project_id

  trigger_template {
    branch_name = "main"
    repo_name   = google_sourcerepo_repository.repo.name
  }

  filename = "cloudbuild.yaml"

  # Grant Cloud Build SA permission to manage resources
  service_account = google_service_account.sa_devops.id
}

# DevOps Service Account (The Builder)
resource "google_service_account" "sa_devops" {
  account_id   = "sa-devops"
  display_name = "DevOps Pipeline SA"
}

# Permissions for DevOps SA (Needs to be powerful to deploy TF)
resource "google_project_iam_member" "devops_owner" {
  project = var.project_id
  role    = "roles/owner" # In a real fortress, scope this down. For speed: Owner.
  member  = "serviceAccount:${google_service_account.sa_devops.email}"
}

# DevOps / Malt Bot Configuration
# This file defines the low-cost "Malt Bot" instance for routine operations.

resource "google_service_account" "malt_bot_sa" {
  account_id   = "sa-malt-bot"
  display_name = "Service Account for Malt Bot (DevOps)"
}

# Grant necessary permissions for routine tasks
resource "google_project_iam_member" "malt_bot_editor" {
  project = var.project_id
  role    = "roles/editor" # Broad access for devops tasks (refine in prod)
  member  = "serviceAccount:${google_service_account.malt_bot_sa.email}"
}

# The Malt Bot Instance (e2-micro / Free Tier Eligible)
resource "google_compute_instance" "malt_bot" {
  name         = "malt-bot-instance"
  machine_type = "e2-micro"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 30
    }
  }

  network_interface {
    network    = google_compute_network.vpc.id
    subnetwork = google_compute_subnetwork.subnet.id
    # No external IP (save cost/security)
  }

  service_account {
    email  = google_service_account.malt_bot_sa.email
    scopes = ["cloud-platform"]
  }

  # Preemptible (Spot) for maximum savings if not critical
  scheduling {
    preemptible       = true
    automatic_restart = false
  }

  metadata = {
    startup-script    = data.local_file.bootstrap_script.content
    department        = "devops"
    persona-file      = "malt_bot.json"
    vertex-ai-model   = "gemini-1.5-flash-preview-0514" # Force low-cost model
    skills-gcs-url    = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
    knowledge-gcs-url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  }

  tags = ["malt-bot", "allow-iap-ssh"]
}
