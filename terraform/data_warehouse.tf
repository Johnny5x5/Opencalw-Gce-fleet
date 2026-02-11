resource "google_bigquery_dataset" "warehouse" {
  dataset_id                  = "conglomerate_warehouse"
  friendly_name               = "Conglomerate Data Warehouse"
  description                 = "Central repository for Agent logs, Call Center transcripts, and Business Intelligence."
  location                    = var.region
  default_table_expiration_ms = 31536000000 # 1 Year Retention

  access {
    role          = "OWNER"
    user_by_email = "serviceAccount:${google_project_service.bigquery.project_id}@appspot.gserviceaccount.com" # Placeholder: Project Owner
  }

  # Grant Access to Department Service Accounts (Future Improvement: iterate departments)
  # For now, we assume the SAs have roles/bigquery.dataEditor at the project level
  # or we grant "allAuthenticatedUsers" (Internal) read access if safe.
}

# Table 1: Agent Activity Logs (The "Thought Process")
resource "google_bigquery_table" "agent_logs" {
  dataset_id = google_bigquery_dataset.warehouse.dataset_id
  table_id   = "agent_activity_logs"

  schema = <<EOF
[
  {
    "name": "timestamp",
    "type": "TIMESTAMP",
    "mode": "REQUIRED",
    "description": "Time of the event"
  },
  {
    "name": "agent_id",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "Unique ID of the OpenClaw Agent"
  },
  {
    "name": "department",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "Department Name (HQ, HR, etc.)"
  },
  {
    "name": "action",
    "type": "STRING",
    "mode": "NULLABLE",
    "description": "Action performed (e.g., 'create_doc', 'answer_call')"
  },
  {
    "name": "details",
    "type": "JSON",
    "mode": "NULLABLE",
    "description": "Structured details of the action"
  }
]
EOF
}

# Table 2: Call Center Transcripts (The "Voice Record")
resource "google_bigquery_table" "call_center_logs" {
  dataset_id = google_bigquery_dataset.warehouse.dataset_id
  table_id   = "call_center_transcripts"

  schema = <<EOF
[
  {
    "name": "call_id",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "Unique Call ID (from Dialogflow)"
  },
  {
    "name": "start_time",
    "type": "TIMESTAMP",
    "mode": "REQUIRED"
  },
  {
    "name": "end_time",
    "type": "TIMESTAMP",
    "mode": "NULLABLE"
  },
  {
    "name": "language_code",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "sentiment_score",
    "type": "FLOAT",
    "mode": "NULLABLE"
  },
  {
    "name": "transcript",
    "type": "STRING",
    "mode": "NULLABLE",
    "description": "Full text transcript of the conversation"
  }
]
EOF
}
