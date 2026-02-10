resource "google_storage_bucket" "skills_repo" {
  name          = "${var.project_id}-skills-repo"
  location      = var.region
  force_destroy = true
  uniform_bucket_level_access = true
}

data "archive_file" "skills_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../packages/google-native-skills"
  output_path = "${path.module}/google-native-skills.zip"
}

resource "google_storage_bucket_object" "skills_archive" {
  name   = "google-native-skills.${data.archive_file.skills_zip.output_md5}.zip"
  bucket = google_storage_bucket.skills_repo.name
  source = data.archive_file.skills_zip.output_path
}

# Grant ALL service accounts read access to this bucket
# For simplicity in this demo, we make the objects readable by authenticated users
# or we iterate through the departments.
# A better approach is to grant "roles/storage.objectViewer" to the specific department SAs.
# But since we don't have a list of SAs here easily (without outputs),
# let's rely on the fact that they are in the same project.
# Actually, the bootstrap script uses `gsutil` which uses the VM's SA.
# We need to grant read access.

# IAM Bindings are now handled in the department module, which grants access
# specifically to each department's service account using `var.skills_bucket_name`.
# This is more secure than a blanket binding here.
