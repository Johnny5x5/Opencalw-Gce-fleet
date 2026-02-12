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
