# Global Software Index (The "Repository of Everything")
# Stores metadata for 3M+ tracked software projects.

resource "google_bigquery_dataset" "index" {
  dataset_id                  = "global_software_index"
  friendly_name               = "Global Software Index"
  description                 = "Metadata for 3M+ tracked projects. Enabled only in Hyperscale mode."
  location                    = var.region
  default_table_expiration_ms = null # Permanent Index
}

resource "google_bigquery_table" "tracked_projects" {
  dataset_id = google_bigquery_dataset.index.dataset_id
  table_id   = "tracked_projects"

  schema = <<EOF
[
  { "name": "repo_url", "type": "STRING", "mode": "REQUIRED" },
  { "name": "ecosystem", "type": "STRING", "mode": "NULLABLE" },
  { "name": "license", "type": "STRING", "mode": "NULLABLE" },
  { "name": "strategic_value", "type": "FLOAT", "mode": "NULLABLE" },
  { "name": "last_crawled", "type": "TIMESTAMP", "mode": "NULLABLE" }
]
EOF
}

# Project Factory Queue (Dynamic Spawning)
resource "google_pubsub_topic" "factory_queue" {
  name = "project-factory-queue"
}

# Circuit Breaker (Cost Safety)
# Hard limit to prevent "Million Dollar Bill"
resource "google_billing_budget" "hyperscale_budget" {
  billing_account = var.billing_account_id
  display_name    = "Hyperscale Engine Safety Cap"

  amount {
    specified_amount {
      currency_code = "USD"
      units         = 100 # $100 cap for safety. Increase manually.
    }
  }

  threshold_rules {
    threshold_percent = 0.5
  }
  threshold_rules {
    threshold_percent = 0.9
  }

  all_updates_rule {
    pubsub_topic = "projects/${var.project_id}/topics/${google_pubsub_topic.factory_queue.name}" # Self-kill signal
    disable_default_iam_recipients = true
  }
}
