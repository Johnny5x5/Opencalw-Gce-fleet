# 1. Custom VPC Network
resource "google_compute_network" "vpc" {
  name                    = var.vpc_name
  auto_create_subnetworks = false
}

# 2. Subnet with Private Google Access
# Private Google Access allows instances with internal IPs to reach Google APIs (GCS, Pub/Sub)
# without traversing the public internet.
resource "google_compute_subnetwork" "subnet" {
  name                     = "${var.vpc_name}-subnet-01"
  ip_cidr_range            = var.subnet_cidr
  region                   = var.region
  network                  = google_compute_network.vpc.id
  private_ip_google_access = true
}

# 3. Cloud NAT (Network Address Translation)
# Allows instances to access the internet for updates (e.g., npm install)
# but prevents the internet from initiating connections to instances.
resource "google_compute_router" "router" {
  name    = "${var.vpc_name}-router"
  region  = var.region
  network = google_compute_network.vpc.id
}

resource "google_compute_router_nat" "nat" {
  name                               = "${var.vpc_name}-nat"
  router                             = google_compute_router.router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# 4. Firewall Rules

# Allow internal traffic between departments
resource "google_compute_firewall" "allow_internal" {
  name    = "${var.vpc_name}-allow-internal"
  network = google_compute_network.vpc.name

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  source_ranges = [var.subnet_cidr]
}

# Allow SSH from Google Identity-Aware Proxy (IAP)
# This eliminates the need for bastion hosts and public IPs on instances.
resource "google_compute_firewall" "allow_iap_ssh" {
  name    = "${var.vpc_name}-allow-iap-ssh"
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["35.235.240.0/20"]
}

# Allow Google Cloud Health Checks & Load Balancers
# Required for Auto-healing and Load Balancing to work.
resource "google_compute_firewall" "allow_health_check" {
  name    = "${var.vpc_name}-allow-health-check"
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
    ports    = ["8080"]
  }

  source_ranges = ["35.191.0.0/16", "130.211.0.0/22"]
  target_tags   = ["allow-health-check"]
}
