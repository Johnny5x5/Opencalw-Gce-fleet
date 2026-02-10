resource "google_storage_bucket" "function_bucket" {
  name     = "${var.project_id}-functions"
  location = var.region
  force_destroy = true
}

data "archive_file" "fulfillment_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../src/functions/dialogflow-fulfillment"
  output_path = "${path.module}/dialogflow-fulfillment.zip"
}

resource "google_storage_bucket_object" "zip_archive" {
  name   = "dialogflow-fulfillment.${data.archive_file.fulfillment_zip.output_md5}.zip"
  bucket = google_storage_bucket.function_bucket.name
  source = data.archive_file.fulfillment_zip.output_path
}

# The Cloud Function (Gen 2)
# Needs to be zipped first. Since we are in an agent environment,
# let's assume the user will deploy this via gcloud or build pipeline.
# But I will outline the Terraform resource structure.

resource "google_cloudfunctions2_function" "fulfillment" {
  name        = "dialogflow-fulfillment"
  location    = var.region
  description = "Bridge between Dialogflow CX and OpenClaw via Pub/Sub"

  build_config {
    runtime     = "nodejs20"
    entry_point = "dialogflowFulfillment" # Defined in index.js
    source {
      storage_source {
        bucket = google_storage_bucket.function_bucket.name
        object = google_storage_bucket_object.zip_archive.name
      }
    }
  }

  service_config {
    max_instance_count = 10
    available_memory   = "256M"
    timeout_seconds    = 60
    environment_variables = {
      PUBSUB_TOPIC = "call-center-inbox" # Defined by the call-center department module
    }
  }
}

# Allow Public Access (Invoker) - Required for Dialogflow Webhook (secured via token ideally)
# For demo, we allow allUsers but in prod use service account authentication.
resource "google_cloud_run_service_iam_member" "member" {
  location = google_cloudfunctions2_function.fulfillment.location
  service  = google_cloudfunctions2_function.fulfillment.name
  role     = "roles/run.invoker"
  member   = "allUsers" # Publicly accessible webhook
}

# Create the Pub/Sub Topic for Call Center
# Note: The "call-center" department module will also attempt to create "call-center-inbox".
# To avoid conflict, we let the module own the topic, or we import it.
# For simplicity, we define the topic HERE and pass its name to the function.
# The module currently hardcodes the topic creation.
# Let's remove this resource and assume the module creates it.
# The function just needs the NAME string.
# resource "google_pubsub_topic" "call_center_inbox" {
#   name = "call-center-inbox"
# }
