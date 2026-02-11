# Customer Managed Encryption Keys (CMEK)
# NIST 800-53 SC-28: Protection of Information at Rest

resource "google_kms_key_ring" "key_ring" {
  name     = "${var.project_id}-key-ring"
  location = var.region
}

resource "google_kms_crypto_key" "conglomerate_key" {
  name            = "conglomerate-crypto-key"
  key_ring        = google_kms_key_ring.key_ring.id
  rotation_period = "7776000s" # 90 Days (Standard rotation policy)

  # Support for Hardware Security Modules (HSM)
  # Default is SOFTWARE, can be upgraded to HSM for Finance/Banking compliance.
  purpose          = "ENCRYPT_DECRYPT"
  version_template {
    protection_level = var.key_protection_level
    algorithm        = "GOOGLE_SYMMETRIC_ENCRYPTION"
  }

  lifecycle {
    prevent_destroy = true # Prevent accidental deletion of keys (Data loss prevention)
  }
}

# Grant GCS Service Account access to use the key
data "google_storage_project_service_account" "gcs_account" {
}

resource "google_kms_crypto_key_iam_member" "gcs_key_user" {
  crypto_key_id = google_kms_crypto_key.conglomerate_key.id
  role          = "roles/cloudkms.cryptoKeyEncrypterDecrypter"
  member        = "serviceAccount:${data.google_storage_project_service_account.gcs_account.email_address}"
}

# Grant Compute Engine Service Account access to use the key (for Disks)
data "google_project" "current" {
}

resource "google_kms_crypto_key_iam_member" "compute_key_user" {
  crypto_key_id = google_kms_crypto_key.conglomerate_key.id
  role          = "roles/cloudkms.cryptoKeyEncrypterDecrypter"
  member        = "serviceAccount:service-${data.google_project.current.number}@compute-system.iam.gserviceaccount.com"
}

# Audit Logging (Data Access Logs)
# NIST 800-53 AU-2: Audit Events

resource "google_project_iam_audit_config" "audit_config" {
  project = var.project_id
  service = "allServices" # Enable for all supported services

  audit_log_config {
    log_type = "ADMIN_READ" # Log when admins read configuration
  }

  audit_log_config {
    log_type = "DATA_READ" # Log when data is read (High volume, but required for HIPAA/Finance)
  }

  audit_log_config {
    log_type = "DATA_WRITE" # Log when data is modified
  }
}
