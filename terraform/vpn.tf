# VPN Gateway for Hybrid Connectivity
# Allows connecting the Conglomerate VPC to an On-Premise Data Center.
# Commented out to avoid billing ($0.05/hour) until needed.

# resource "google_compute_ha_vpn_gateway" "vpn_gateway" {
#   name    = "conglomerate-vpn"
#   network = google_compute_network.vpc.id
#   region  = var.region
# }

# resource "google_compute_external_vpn_gateway" "on_prem_gateway" {
#   name            = "on-prem-gateway"
#   redundancy_type = "SINGLE_IP_INTERNALLY_REDUNDANT"
#   interface {
#     id = 0
#     ip_address = "203.0.113.1" # Placeholder IP
#   }
# }

# resource "google_compute_vpn_tunnel" "tunnel1" {
#   name                  = "vpn-tunnel-1"
#   region                = var.region
#   vpn_gateway           = google_compute_ha_vpn_gateway.vpn_gateway.id
#   peer_external_gateway = google_compute_external_vpn_gateway.on_prem_gateway.id
#   shared_secret         = "secret-shared-key"
#   router                = google_compute_router.router.id
#   vpn_gateway_interface = 0
# }
