variable "enable_hyperscale" {
  description = "Enable Hyperscale Engine (3M Project Tracking). WARNING: Potential high cost."
  type        = bool
  default     = false
}

variable "billing_account_id" {
  description = "Billing Account ID required for Hyperscale budget alerts."
  type        = string
  default     = ""
}
