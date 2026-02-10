# 1. Identity (Service Account)
resource "google_service_account" "sa" {
  account_id   = "sa-${var.department_name}"
  display_name = "Service Account for ${var.department_name} Department"
}

# 2. Storage (GCS Bucket)
resource "google_storage_bucket" "files" {
  name          = "${var.project_id}-${var.department_name}-files"
  location      = var.region
  force_destroy = true # Allow destruction for this demo/prototype
  uniform_bucket_level_access = true
}

# Grant SA access to its own bucket
resource "google_storage_bucket_iam_member" "sa_bucket_admin" {
  bucket = google_storage_bucket.files.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.sa.email}"
}

# 3. Communication (Pub/Sub Topic)
resource "google_pubsub_topic" "inbox" {
  name = "${var.department_name}-inbox"
}

# Grant SA access to publish/subscribe to its own topic
resource "google_pubsub_topic_iam_member" "sa_pubsub_editor" {
  topic  = google_pubsub_topic.inbox.name
  role   = "roles/pubsub.editor"
  member = "serviceAccount:${google_service_account.sa.email}"
}

# Grant SA access to Firestore/Datastore ("World Model")
resource "google_project_iam_member" "sa_datastore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.sa.email}"
}

# 4. Compute (Instance Template & MIG)

# Health Check for Auto-Healing
resource "google_compute_region_health_check" "http_health_check" {
  name                = "${var.department_name}-hc"
  region              = var.region
  check_interval_sec  = 10
  timeout_sec         = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3

  http_health_check {
    port = 8080
    request_path = "/health" # Assumes OpenClaw/Node app exposes this
  }
}

# Instance Template
resource "google_compute_instance_template" "template" {
  name_prefix  = "${var.department_name}-template-"
  machine_type = var.machine_type
  region       = var.region

  # Boot Disk
  disk {
    source_image = "ubuntu-os-cloud/ubuntu-2204-lts"
    auto_delete  = true
    boot         = true
    disk_size_gb = 50
    disk_type    = "pd-balanced"
  }

  # Network Interface
  network_interface {
    network    = var.vpc_network_id
    subnetwork = var.subnet_id
    # No access config block = No public IP
  }

  # Identity & Scopes
  service_account {
    email  = google_service_account.sa.email
    scopes = ["cloud-platform"]
  }

  # Security Hardening (DoD Level)
  shielded_instance_config {
    enable_secure_boot          = true
    enable_vtpm                 = true
    enable_integrity_monitoring = true
  }

  # Nested Virtualization (Required for Android Emulator)
  # Only enabled if the variable is set (for Device Lab)
  advanced_machine_features {
    enable_nested_virtualization = var.enable_nested_virt
  }

  metadata = {
    startup-script = var.startup_script
    department     = var.department_name
    enable-oslogin = "TRUE"
  }

  tags = ["allow-health-check"]

  lifecycle {
    create_before_destroy = true
  }
}

# Managed Instance Group (MIG)
resource "google_compute_region_instance_group_manager" "mig" {
  name               = "${var.department_name}-mig"
  base_instance_name = "${var.department_name}-agent"
  region             = var.region
  target_size        = var.min_replicas

  version {
    instance_template = google_compute_instance_template.template.id
  }

  named_port {
    name = "http"
    port = 8080
  }

  named_port {
    name = "agent"
    port = 3000
  }

  auto_healing_policies {
    health_check      = google_compute_region_health_check.http_health_check.id
    initial_delay_sec = 300
  }
}

# Autoscaler
resource "google_compute_region_autoscaler" "autoscaler" {
  name   = "${var.department_name}-autoscaler"
  region = var.region
  target = google_compute_region_instance_group_manager.mig.id

  autoscaling_policy {
    max_replicas    = var.max_replicas
    min_replicas    = var.min_replicas
    cooldown_period = 60

    cpu_utilization {
      target = 0.6
    }
  }
}

# 5. Internal Load Balancer (ILB)
# Exposes the MIG as a single internal IP endpoint

resource "google_compute_region_backend_service" "ilb_backend" {
  name                  = "${var.department_name}-ilb-backend"
  region                = var.region
  protocol              = "TCP"
  load_balancing_scheme = "INTERNAL"
  health_checks         = [google_compute_region_health_check.http_health_check.id]
  backend {
    group = google_compute_region_instance_group_manager.mig.instance_group
  }
}

resource "google_compute_forwarding_rule" "ilb_forwarding_rule" {
  name                  = "${var.department_name}-ilb-frontend"
  region                = var.region
  load_balancing_scheme = "INTERNAL"
  network               = var.vpc_network_id
  subnetwork            = var.subnet_id
  backend_service       = google_compute_region_backend_service.ilb_backend.id
  ports                 = ["8080", "3000"] # 8080=HealthCheck, 3000=Agent
  # Internal IP is automatically allocated
}
