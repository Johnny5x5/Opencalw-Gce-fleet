# Security Level Variable
# 1 = Standard (Private IPs, NAT)
# 2 = Compliance (Logs, Encryption) - CURRENT STATE
# 3 = Fortress (Proxy, Binary Auth, VPC-SC)
variable "security_level" {
  description = "The security posture level of the infrastructure."
  type        = number
  default     = 2
}
