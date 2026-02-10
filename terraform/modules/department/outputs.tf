output "department_url" {
  description = "The internal DNS/IP endpoint for the department's API."
  value       = google_compute_forwarding_rule.ilb_forwarding_rule.ip_address
}

output "pubsub_topic_name" {
  description = "The Pub/Sub topic for asynchronous messages."
  value       = google_pubsub_topic.inbox.name
}

output "gcs_bucket_url" {
  description = "The URL of the department's private GCS bucket."
  value       = google_storage_bucket.files.url
}
