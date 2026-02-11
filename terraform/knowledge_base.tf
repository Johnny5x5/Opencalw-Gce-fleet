resource "google_storage_bucket" "knowledge_base" {
  name          = "${var.project_id}-knowledge-base"
  location      = var.region
  force_destroy = true
  uniform_bucket_level_access = true
}

# Grant Vertex AI service agents access to this bucket
# We typically need the Discovery Engine SA to read this.
# For simplicity, we assume the user will upload documents manually or via scripts.

# Note: The `google_discovery_engine_data_store` resource is in Preview/Beta for Terraform.
# If unavailable in the `hashicorp/google` provider, we might need `google-beta`.
# Let's try to define it, or fallback to a placeholder/comment if the provider version is too old.

# Assuming google-beta provider is configured or available implicitly.
# If not, this block might fail.
# For safety, we will comment out the resource creation but outline the structure
# as `discovery_engine` resources often require manual activation in the console first.

# resource "google_discovery_engine_data_store" "knowledge_base_store" {
#   location                    = "global"
#   data_store_id               = "company-knowledge-base"
#   display_name                = "Company Knowledge Base"
#   industry_vertical           = "GENERIC"
#   content_config              = "CONTENT_REQUIRED"
#   solution_types              = ["SOLUTION_TYPE_SEARCH"]
#   create_advanced_site_search = false
# }

# Link the GCS Bucket to the Data Store (Import)
# This is usually an API call: `discoveryengine.projects.locations.collections.dataStores.importDocuments`
# Terraform support for initiating import is limited.

# We will output the bucket name so the user knows where to put the PDFs.
output "knowledge_base_bucket" {
  value = google_storage_bucket.knowledge_base.url
  description = "Upload PDF/HTML documents here for Vertex AI to index."
}
