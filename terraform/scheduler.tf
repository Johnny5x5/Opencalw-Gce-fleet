# Green Ops Scheduler (Cloud Scheduler -> Cloud Functions -> Instance Group)
# Resizes the 'device-lab' and 'engineering' groups to 0 at night to save carbon/money.

resource "google_project_service" "cloudscheduler" {
  project = var.project_id
  service = "cloudscheduler.googleapis.com"
  disable_on_destroy = false
}

# Cloud Function to resize MIGs
resource "google_cloudfunctions2_function" "scaler" {
  name        = "green-ops-scaler"
  location    = var.region
  description = "Resizes Instance Groups based on schedule"

  build_config {
    runtime     = "nodejs20"
    entry_point = "resizeMig"
    source {
      storage_source {
        bucket = google_storage_bucket.function_bucket.name
        object = google_storage_bucket_object.zip_archive.name # Reusing bucket, logic in index.js needs expansion
      }
    }
  }
}

# Schedule: Shutdown at 10 PM
resource "google_cloud_scheduler_job" "shutdown_job" {
  name             = "green-ops-shutdown"
  description      = "Scale down Device Lab at night"
  schedule         = "0 22 * * *" # 10 PM
  time_zone        = "America/New_York"
  attempt_deadline = "320s"

  http_target {
    http_method = "POST"
    uri         = google_cloudfunctions2_function.scaler.service_config[0].uri
    body        = base64encode("{\"target_size\": 0, \"group\": \"device-lab-mig\"}")

    # Auth
    oidc_token {
      service_account_email = google_service_account.sa_scheduler.email
    }
  }
}

# Schedule: Startup at 6 AM
resource "google_cloud_scheduler_job" "startup_job" {
  name             = "green-ops-startup"
  description      = "Scale up Device Lab in morning"
  schedule         = "0 6 * * *" # 6 AM
  time_zone        = "America/New_York"

  http_target {
    http_method = "POST"
    uri         = google_cloudfunctions2_function.scaler.service_config[0].uri
    body        = base64encode("{\"target_size\": 3, \"group\": \"device-lab-mig\"}")

    oidc_token {
      service_account_email = google_service_account.sa_scheduler.email
    }
  }
}

# SA for Scheduler
resource "google_service_account" "sa_scheduler" {
  account_id   = "sa-green-ops"
  display_name = "Green Ops Scheduler SA"
}
