import os
import json
import datetime
import uuid

# Mock Pub/Sub client if not available
try:
    from google.cloud import pubsub_v1
    GCP_AVAILABLE = True
except ImportError:
    GCP_AVAILABLE = False

def consume_tasks(project_id="openclaw-core", subscription_id="pmo-inbox-input-sub", inbox_dir="backlog/inbox"):
    """
    Subscribes to Google Pub/Sub and writes messages to the Inbox.
    """
    if not os.path.exists(inbox_dir):
        print(f"Inbox directory {inbox_dir} not found.")
        return

    print("🔌 Connecting to Enterprise Event Bus...")

    if not GCP_AVAILABLE or "GOOGLE_APPLICATION_CREDENTIALS" not in os.environ:
        print("⚠️ Warning: Google Cloud credentials not found. Running in MOCK MODE.")
        # Mocking incoming messages
        messages = [
            {
                "id": str(uuid.uuid4()),
                "title": "Fix Login Bug",
                "priority": "High",
                "type": "Bug",
                "prime_directive": "Existence",
                "description": "Users cannot log in via SSO. This is a critical blocker."
            }
        ]
    else:
        # Real Pub/Sub Logic (Subscriber)
        subscriber = pubsub_v1.SubscriberClient()
        subscription_path = subscriber.subscription_path(project_id, subscription_id)
        # In a real daemon, we would use streaming pull. For a cron job, we pull once.
        response = subscriber.pull(request={"subscription": subscription_path, "max_messages": 10})
        messages = []
        for received_message in response.received_messages:
            try:
                data = json.loads(received_message.message.data.decode("utf-8"))
                messages.append(data)
                subscriber.acknowledge(request={"subscription": subscription_path, "ack_ids": [received_message.ack_id]})
            except Exception as e:
                print(f"Error parsing message: {e}")

    # Process Messages
    for msg in messages:
        filename = f"{datetime.date.today().isoformat()}_remote_{msg['id'][:8]}.md"
        filepath = os.path.join(inbox_dir, filename)

        content = f"""# Title: {msg.get('title', 'Untitled Task')}
# Priority: {msg.get('priority', 'Medium')}
# Type: {msg.get('type', 'Feature')}
# Prime Directive: {msg.get('prime_directive', 'Efficiency')}

## Description
{msg.get('description', 'No description provided.')}

## Source
Imported from Event Bus (ID: {msg.get('id')})
"""
        with open(filepath, 'w') as f:
            f.write(content)

        print(f"📥 Imported: {filename}")

if __name__ == "__main__":
    consume_tasks()
