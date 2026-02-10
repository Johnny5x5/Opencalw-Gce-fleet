# Read the startup script once
data "local_file" "bootstrap_script" {
  filename = "${path.module}/../src/scripts/bootstrap_agent.sh"
}

# 1. Headquarters (HQ) Department
module "hq" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "hq"
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id
  min_replicas    = 2
  max_replicas    = 5
  startup_script  = data.local_file.bootstrap_script.content
}

# 2. Engineering Department
module "engineering" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "engineering"
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id
  min_replicas    = 3
  max_replicas    = 10 # Engineering scales higher
  startup_script  = data.local_file.bootstrap_script.content
}

# 3. Human Resources (HR) Department
module "hr" {
  source          = "./modules/department"
  project_id      = var.project_id
  region          = var.region
  department_name = "hr"
  vpc_network_id  = google_compute_network.vpc.id
  subnet_id       = google_compute_subnetwork.subnet.id
  min_replicas    = 1
  max_replicas    = 3
  startup_script  = data.local_file.bootstrap_script.content
}
