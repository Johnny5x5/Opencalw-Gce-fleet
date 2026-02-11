variable "project_id" {
  description = "The GCP Project ID."
  type        = string
}

variable "region" {
  description = "The GCP Region."
  type        = string
}

variable "department_name" {
  description = "The name of the department (e.g., hq, engineering)."
  type        = string
}

variable "vpc_network_id" {
  description = "The ID of the VPC network."
  type        = string
}

variable "subnet_id" {
  description = "The ID of the subnet."
  type        = string
}

variable "min_replicas" {
  description = "Minimum number of instances in the group."
  type        = number
  default     = 1
}

variable "max_replicas" {
  description = "Maximum number of instances in the group."
  type        = number
  default     = 5
}

variable "machine_type" {
  description = "The machine type for the instances."
  type        = string
  default     = "e2-standard-2" # Default to standard compute (non-emulator)
}

variable "startup_script" {
  description = "The content of the startup script."
  type        = string
}

variable "enable_nested_virt" {
  description = "Enable nested virtualization (required for Android Emulator)."
  type        = bool
  default     = false
}

variable "enable_confidential_compute" {
  description = "Enable Confidential Computing (AMD SEV) for memory encryption."
  type        = bool
  default     = false
}

variable "skills_gcs_url" {
  description = "GCS URL (gs://bucket/skills.zip) to download the agent skills from."
  type        = string
  default     = "" # Optional, if empty, uses placeholder
}

variable "skills_bucket_name" {
  description = "Name of the GCS bucket hosting the skills. Used for IAM bindings."
  type        = string
  default     = "" # Optional
}

variable "kms_key_id" {
  description = "The ID of the Cloud KMS Crypto Key for encryption."
  type        = string
  default     = "" # Optional, if empty, uses Google-managed keys
}

variable "retention_period" {
  description = "WORM Retention Period in seconds. 0 = Disabled."
  type        = number
  default     = 0
}
