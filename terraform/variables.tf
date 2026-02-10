variable "project_id" {
  description = "The GCP Project ID to deploy resources into."
  type        = string
}

variable "region" {
  description = "The GCP Region for resources (e.g., us-central1)."
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The default GCP Zone (e.g., us-central1-a)."
  type        = string
  default     = "us-central1-a"
}

variable "vpc_name" {
  description = "Name of the Virtual Private Cloud network."
  type        = string
  default     = "openclaw-conglomerate-vpc"
}

variable "subnet_cidr" {
  description = "CIDR range for the primary subnet."
  type        = string
  default     = "10.0.0.0/20"
}
