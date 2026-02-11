resource "google_storage_bucket_object" "knowledge_zip" {
  name   = "knowledge-base.zip"
  bucket = google_storage_bucket.skills_repo.name
  source = data.archive_file.knowledge_zip.output_path
}

data "archive_file" "knowledge_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../src/knowledge"
  output_path = "${path.module}/knowledge.zip"
}
