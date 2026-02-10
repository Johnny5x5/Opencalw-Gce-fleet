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
  default     = "n2-standard-4" # Upgraded for Android Emulator (Nested Virtualization)
}

variable "startup_script" {
  description = "The content of the startup script."
  type        = string
}
