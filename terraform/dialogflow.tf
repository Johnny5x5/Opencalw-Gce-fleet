resource "google_dialogflow_cx_agent" "call_center_agent" {
  display_name = "openclaw-call-center"
  location     = "global" # Multi-regional deployment
  project      = var.project_id

  default_language_code = "en"
  supported_language_codes = ["es-419", "fr", "hi"] # Multilingual Support: Spanish (Latin America), French, Hindi

  time_zone = "America/New_York"

  description = "Global Call Center Agent powered by OpenClaw"

  # Advanced Settings
  enable_stackdriver_logging = true # Logs to Cloud Logging (Critical for analytics)
  enable_spell_correction    = true

  speech_to_text_settings {
    enable_speech_adaptation = true
  }

  depends_on = [google_project_service.dialogflow]
}

# Webhook to Connect to OpenClaw via Cloud Function
resource "google_dialogflow_cx_webhook" "openclaw_webhook" {
  parent       = google_dialogflow_cx_agent.call_center_agent.id
  display_name = "openclaw-fulfillment"

  generic_web_service {
    # The URL of the Cloud Function we created
    uri = google_cloudfunctions2_function.fulfillment.service_config[0].uri
  }
}

# The Default Start Flow
# This is where the call begins.
resource "google_dialogflow_cx_flow" "default_start_flow" {
  display_name = "Default Start Flow"
  parent       = google_dialogflow_cx_agent.call_center_agent.id

  event_handlers {
    event = "sys.no-match-default"
    trigger_fulfillment {
      messages {
        text {
          text = ["Sorry, I didn't get that. Can you say it again?", "Perdón, no entendí. ¿Puede repetirlo?", "Désolé, je n'ai pas compris."]
        }
      }
    }
  }

  event_handlers {
    event = "sys.no-input-default"
    trigger_fulfillment {
      messages {
        text {
          text = ["Are you still there?", "¿Sigues ahí?"]
        }
      }
    }
  }
}

# Welcome Page
# This page greets the user.
resource "google_dialogflow_cx_page" "welcome_page" {
  parent       = google_dialogflow_cx_flow.default_start_flow.id
  display_name = "Welcome"

  entry_fulfillment {
    messages {
      text {
        text = ["Welcome to OpenClaw Corporation. How can I help you today?", "Bienvenido a OpenClaw Corporation. ¿En qué puedo ayudarle hoy?"]
      }
    }
    # Link to the OpenClaw Webhook
    # In a real flow, this would be on specific intents/routes, not just entry.
    # But for demonstration, we show how to link it.
    webhook = google_dialogflow_cx_webhook.openclaw_webhook.id
    tag     = "welcome"
  }

  # Simple transition to capture intent (Simplified for demo)
  # In a real app, we'd add routes based on intents here.
}
