# Outputs for the OpenClaw Conglomerate

# Core Departments
output "hq_api" {
  description = "Internal API endpoint for HQ"
  value       = module.hq.department_url
}

output "engineering_apis" {
  description = "Internal API endpoints for Engineering Division"
  value = {
    core    = module.eng_core.department_url
    product = module.eng_product.department_url
    data    = module.eng_data.department_url
    qa      = module.eng_qa.department_url
  }
}

output "hr_api" {
  description = "Internal API endpoint for HR"
  value       = module.hr.department_url
}

output "finance_api" {
  description = "Internal API endpoint for Finance"
  value       = module.finance.department_url
}

output "call_center_api" {
  description = "Internal API endpoint for Call Center"
  value       = module.call_center.department_url
}

output "chaplaincy_api" {
  description = "Internal API endpoint for Chaplaincy"
  value       = module.chaplaincy.department_url
}

output "device_lab_api" {
  description = "Internal API endpoint for Device Lab"
  value       = module.device_lab.department_url
}

# War Game Teams
output "wargames_apis" {
  description = "Internal API endpoints for War Game Teams (Red vs Blue vs ...)"
  value       = { for team, mod in module.war_game_team : team => mod.department_url }
}
