resource "google_project_service" "secretmanager" {
  project = var.project_id
  service = "secretmanager.googleapis.com"
  disable_on_destroy = false
}

# 1. Discord Token
resource "google_secret_manager_secret" "discord_token" {
  secret_id = "discord-token"
  replication {
    automatic = true
  }
  depends_on = [google_project_service.secretmanager]
}

# 2. Twilio Account SID
resource "google_secret_manager_secret" "twilio_account_sid" {
  secret_id = "twilio-account-sid"
  replication {
    automatic = true
  }
  depends_on = [google_project_service.secretmanager]
}

# 3. Twilio Auth Token
resource "google_secret_manager_secret" "twilio_auth_token" {
  secret_id = "twilio-auth-token"
  replication {
    automatic = true
  }
  depends_on = [google_project_service.secretmanager]
}

# 4. Twilio Phone Number
resource "google_secret_manager_secret" "twilio_phone_number" {
  secret_id = "twilio-phone-number"
  replication {
    automatic = true
  }
  depends_on = [google_project_service.secretmanager]
}
