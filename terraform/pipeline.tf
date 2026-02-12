resource "google_vertex_ai_pipeline_job" "tuning_pipeline" {
  display_name = "gemini-fine-tuning"
  location     = var.region
  project      = var.project_id

  # This assumes a compiled Pipeline Template exists in GCS.
  # For Day 1, we define the structure.
  # template_path = "gs://${google_storage_bucket.skills_repo.name}/pipelines/tuning.json"

  # parameter_values = jsonencode({
  #   input_data  = "bq://${var.project_id}.conglomerate_warehouse.call_center_logs"
  #   epochs      = 10
  #   base_model  = "gemini-1.5-pro"
  # })
}
