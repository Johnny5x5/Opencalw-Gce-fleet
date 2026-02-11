# Security Protection Level
# "SOFTWARE" = Standard Cloud KMS (Low Cost, High Speed)
# "HSM" = Hardware Security Module (FIPS 140-2 L3, High Security, Higher Cost)
variable "key_protection_level" {
  description = "The protection level of the Cloud KMS Crypto Key (SOFTWARE or HSM)."
  type        = string
  default     = "SOFTWARE"
}
