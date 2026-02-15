# NomadOS Queuing Doctrine
## Dual-Side Asynchronous Reliability

### 1. The Challenge: Disconnected Operations
In a hostile environment, direct synchronous calls (HTTP POST) are guaranteed to fail. The Tablet might be offline for 90 days. The Cloud might be rebooting.
*   **Solution:** We decouple the sender from the receiver using **Store-and-Forward Queues**.

### 2. Local-Side Queue (The "Outbox")
The Nomad Tablet (Scout) must never block on a network request.
*   **Technology:** `sled` (Embedded Rust Database) or `SQLite`.
*   **Protocol:**
    1.  User types command.
    2.  System writes command to local `Outbox.db`.
    3.  Background `CommsDaemon` (Core 1) wakes up.
    4.  If Network == UP, `CommsDaemon` pushes message to Cloud.
    5.  If Cloud ACK received, delete from `Outbox.db`.
    6.  If Network == DOWN, sleep and retry later (Exponential Backoff).

### 3. Cloud-Side Queue (The "Inbox")
The Federal Cloud (Commander) must handle bursts of traffic from thousands of Nomads simultaneously.
*   **Strategy:** Multi-Cloud Abstraction Layer.
*   **Supported Backends:**
    *   **Google Cloud Pub/Sub:** (Primary for GCP deployments). Native, serverless, global scale.
    *   **RabbitMQ (AMQP):** (Primary for Multi-Cloud/On-Premise). Run on AWS, Azure, or bare metal. Standard protocol.
*   **Protocol:**
    1.  Uplink Function receives Bundle.
    2.  Uplink authenticates Bundle (HMAC).
    3.  Uplink *immediately* pushes Bundle to the configured Queue (PubSub or RabbitMQ).
    4.  Uplink returns `202 Accepted` to the Tablet.
    5.  A separate "Worker Fleet" pulls from the Queue and processes the heavy AI task.

### 4. Implementation Plan
*   **Phase 1:** Implement `QueueAdapter` interface in `nomad-uplink`.
*   **Phase 2:** Implement `RabbitMQAdapter` and `PubSubAdapter`.
*   **Phase 3:** Update `nomad-system` to persist messages to disk before sending.
