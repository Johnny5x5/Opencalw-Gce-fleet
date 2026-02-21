import os
import json
import datetime

# Mock Pub/Sub client if not available
try:
    from google.cloud import pubsub_v1
    GCP_AVAILABLE = True
except ImportError:
    GCP_AVAILABLE = False

def publish_status(project_id="openclaw-core", topic_id="pmo-status-output", status_file="STATUS.md", metrics_file="velocity_metrics.json"):
    if not os.path.exists(status_file):
        return

    print("🔌 Connecting to Enterprise Event Bus...")

    velocity = 0.0
    if os.path.exists(metrics_file):
        with open(metrics_file, 'r') as f:
            data = json.load(f)
            velocity = data.get('velocity', 0.0)

    critical_risks = []
    with open(status_file, 'r') as f:
        for line in f:
            if "🔴 **CRITICAL:**" in line:
                critical_risks.append(line.strip())

    event_data = {
        "event": "PMO.Status.Published",
        "date": datetime.date.today().isoformat(),
        "velocity": velocity,
        "critical_risks": critical_risks,
        "status": "Healthy" if not critical_risks else "At Risk"
    }

    payload = json.dumps(event_data).encode("utf-8")

    if not GCP_AVAILABLE or "GOOGLE_APPLICATION_CREDENTIALS" not in os.environ:
        print("⚠️ Warning: Google Cloud credentials not found. MOCK PUBLISH:")
        print(f"📡 OUTBOUND EVENT: {json.dumps(event_data, indent=2)}")
    else:
        publisher = pubsub_v1.PublisherClient()
        topic_path = publisher.topic_path(project_id, topic_id)
        future = publisher.publish(topic_path, payload)
        print(f"✅ Published message ID: {future.result()}")

if __name__ == "__main__":
    publish_status()
