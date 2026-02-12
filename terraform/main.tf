# Read the startup script once
data "local_file" "bootstrap_script" {
  filename = "${path.module}/../src/scripts/bootstrap_agent.sh"
}

# 1. Headquarters (HQ) Department
module "hq" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "hq"
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id
  min_replicas    = 2
  max_replicas    = 5
  machine_type    = "e2-standard-2"
  enable_nested_virt = false
  startup_script  = data.local_file.bootstrap_script.content
  skills_gcs_url  = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id      = google_kms_crypto_key.conglomerate_key.id
}

# 2. Engineering Division (The Software Conglomerate)
# Split into specialized sub-departments

module "eng_core" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "eng-core" # SRE / Infrastructure
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id
  min_replicas    = 1
  max_replicas    = 5
  machine_type    = "e2-standard-2"
  startup_script  = data.local_file.bootstrap_script.content
  skills_gcs_url  = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id      = google_kms_crypto_key.conglomerate_key.id
}

module "eng_product" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "eng-product" # Feature Builders
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id
  min_replicas    = 1
  max_replicas    = 10
  machine_type    = "e2-standard-2"
  startup_script  = data.local_file.bootstrap_script.content
  skills_gcs_url  = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id      = google_kms_crypto_key.conglomerate_key.id
}

module "eng_data" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "eng-data" # Data Engineering
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id
  min_replicas    = 1
  max_replicas    = 5
  machine_type    = "e2-standard-2"
  startup_script  = data.local_file.bootstrap_script.content
  skills_gcs_url  = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id      = google_kms_crypto_key.conglomerate_key.id
}

module "eng_qa" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "eng-qa" # Security / QA
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id
  min_replicas    = 1
  max_replicas    = 3
  machine_type    = "e2-standard-2"
  startup_script  = data.local_file.bootstrap_script.content
  skills_gcs_url  = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id      = google_kms_crypto_key.conglomerate_key.id
}

# 3. Human Resources (HR) Department
module "hr" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "hr"
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id
  min_replicas    = 1
  max_replicas    = 3
  machine_type    = "e2-standard-2"
  enable_nested_virt = false
  startup_script  = data.local_file.bootstrap_script.content
  skills_gcs_url  = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id      = google_kms_crypto_key.conglomerate_key.id
}

# 4. Device Lab Department (The Shared Android Resource)
module "device_lab" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "device-lab"
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id

  # Strict limit: Exactly 3 emulators
  min_replicas    = 3
  max_replicas    = 3

  # Special configuration for Android Emulation
  machine_type       = "n2-standard-4" # Required for Nested Virt
  enable_nested_virt = true

  startup_script  = data.local_file.bootstrap_script.content
  skills_gcs_url  = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id      = google_kms_crypto_key.conglomerate_key.id
}

# 5. Call Center Department (The Voice Agents)
module "call_center" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "call-center"
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id

  min_replicas    = 1
  max_replicas    = 10
  machine_type    = "e2-standard-2"
  enable_nested_virt = false
  startup_script  = data.local_file.bootstrap_script.content
  skills_gcs_url  = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id      = google_kms_crypto_key.conglomerate_key.id
}

# 6. Finance Department (The Trading / Banking Agents)
# High Security Configuration (Confidential Computing + WORM)
module "finance" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "finance"
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id

  # Scaling: Handles market surges
  min_replicas    = 1
  max_replicas    = 20

  # Security: Confidential Computing (AMD SEV)
  # Requires N2D machine type
  machine_type                = "n2d-standard-4"
  enable_confidential_compute = true
  enable_nested_virt          = false # Incompatible with Confidential Compute

  # Compliance: WORM Retention (7 Years = 220752000 seconds)
  # Defaulting to 0 (Disabled) for dev, set to 220752000 in prod.
  retention_period = 0

  startup_script  = data.local_file.bootstrap_script.content
  skills_gcs_url  = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id      = google_kms_crypto_key.conglomerate_key.id
}

# 7. Chaplaincy Department (The Moral Guardians)
module "chaplaincy" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "chaplaincy"
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id

  # Highly available but low volume
  min_replicas    = 1
  max_replicas    = 3

  machine_type    = "e2-standard-2"
  enable_nested_virt = false

  # Requires access to the full Knowledge Base
  startup_script  = data.local_file.bootstrap_script.content
  skills_gcs_url  = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.skills_archive.name}"
  knowledge_gcs_url = "gs://${google_storage_bucket.skills_repo.name}/${google_storage_bucket_object.knowledge_zip.name}"
  skills_bucket_name = google_storage_bucket.skills_repo.name
  kms_key_id      = google_kms_crypto_key.conglomerate_key.id
}
