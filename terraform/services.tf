resource "google_project_service" "dialogflow" {
  project = var.project_id
  service = "dialogflow.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudfunctions" {
  project = var.project_id
  service = "cloudfunctions.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "run" {
  project = var.project_id
  service = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifactregistry" {
  project = var.project_id
  service = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudbuild" {
  project = var.project_id
  service = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "aiplatform" {
  project = var.project_id
  service = "aiplatform.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "discoveryengine" {
  project = var.project_id
  service = "discoveryengine.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "bigquery" {
  project = var.project_id
  service = "bigquery.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "sheets" {
  project = var.project_id
  service = "sheets.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "docs" {
  project = var.project_id
  service = "docs.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "drive" {
  project = var.project_id
  service = "drive.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "calendar" {
  project = var.project_id
  service = "calendar.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "chat" {
  project = var.project_id
  service = "chat.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "secretmanager" {
  project = var.project_id
  service = "secretmanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "kms" {
  project = var.project_id
  service = "kms.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "logging" {
  project = var.project_id
  service = "logging.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "accesscontextmanager" {
  project = var.project_id
  service = "accesscontextmanager.googleapis.com"
  disable_on_destroy = false
}
