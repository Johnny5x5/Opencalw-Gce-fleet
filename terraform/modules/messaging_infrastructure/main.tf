# NomadOS Messaging Infrastructure
# Provisions a RabbitMQ Cluster with MQTT Plugin enabled

variable "gcp_region" {
  description = "Google Cloud Region"
  type        = string
  default     = "us-central1"
}

variable "cluster_name" {
  description = "Name of the RabbitMQ Cluster"
  type        = string
  default     = "nomad-message-bus"
}

# 1. Kubernetes Cluster (GKE Autopilot)
# In a real deployment, we would assume a K8s cluster exists.
# This resource simulates the RabbitMQ Helm Chart deployment.

resource "helm_release" "rabbitmq" {
  name       = "rabbitmq-ha"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "rabbitmq"
  version    = "12.0.0"

  set {
    name  = "auth.username"
    value = "nomad_admin"
  }

  set {
    name  = "auth.password"
    value = var.rabbitmq_password
  }

  # Enable MQTT Plugin
  set {
    name  = "extraPlugins"
    value = "rabbitmq_mqtt rabbitmq_web_mqtt rabbitmq_management"
  }

  # Enable AMQP 1.0 (Optional, for wider compatibility)
  set {
    name  = "amqp10.enabled"
    value = "true"
  }

  set {
    name  = "replicaCount"
    value = "3"
  }
}

variable "rabbitmq_password" {
  description = "Admin password for RabbitMQ"
  type        = string
  sensitive   = true
}

output "mqtt_endpoint" {
  value = "mqtt.nomad.internal:1883"
  description = "Internal MQTT Endpoint for the Bridge"
}

output "amqp_endpoint" {
  value = "amqp.nomad.internal:5672"
  description = "Internal AMQP Endpoint for AI Workers"
}
