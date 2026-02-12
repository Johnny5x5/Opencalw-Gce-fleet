# Disaster Recovery (DR) Region Variable
variable "dr_region" {
  description = "Secondary region for Disaster Recovery (e.g., us-east1)."
  type        = string
  default     = "us-east1"
}
