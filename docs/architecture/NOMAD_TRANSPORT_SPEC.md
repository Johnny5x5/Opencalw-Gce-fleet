# NomadOS Transport Specification
## The "Hybrid Bridge" Architecture (MQTT + AMQP)

### 1. Overview
This specification defines the transport layer for the Nomad ecosystem. It bridges the hostile, high-latency "Edge" environment (The Wilderness) with the reliable, high-throughput "Core" environment (The Cloud).

### 2. The Protocols
#### A. The Edge Protocol: MQTT v5
*   **Target:** Device <-> Cloud Gateway.
*   **Why:** Lightweight headers, Keep-Alive management, "Last Will & Testament" (LWT) for device status, and QoS levels for guaranteed delivery.
*   **Transport Wrapper:** MQTT packets are encapsulated inside **DTN Bundles** (RFC 5050) when operating over non-TCP links (LoRa/Satellite).
*   **Security:** mTLS (Mutual TLS) for authentication + AES-256 Payload Encryption.

#### B. The Core Protocol: AMQP 0-9-1
*   **Target:** Gateway <-> AI Workers.
*   **Why:** Reliable message routing, dead-letter queues, and robust acknowledgement patterns for server-side processing.

### 3. Topic Structure
The topic namespace follows a strict hierarchy to enforce tenancy and security.

#### Uplink (Device -> Cloud)
*   `nomad/{region}/{device_id}/uplink/sitrep`
    *   **Payload:** Compressed JSON/Protobuf (Situation Report).
    *   **QoS:** 1 (At least once).
*   `nomad/{region}/{device_id}/uplink/telemetry`
    *   **Payload:** Battery, Signal Strength, Core Status.
    *   **QoS:** 0 (At most once - fire and forget).

#### Downlink (Cloud -> Device)
*   `nomad/{region}/{device_id}/downlink/orders`
    *   **Payload:** Encrypted Mission Orders.
    *   **QoS:** 2 (Exactly once).
*   `nomad/{region}/{device_id}/downlink/updates`
    *   **Payload:** OTA Firmware chunks.
    *   **QoS:** 1.

### 4. The Bridge Architecture
The **Nomad Uplink** functions as the "Protocol Bridge".

1.  **Ingest:** Receives MQTT Packet from Device.
2.  **Auth:** Verifies Device Certificate (x509) or HMAC.
3.  **Route:** Repackages payload into an AMQP Message.
    *   *Routing Key:* `task.ai.analysis.strategic`
4.  **Process:** AI Worker consumes AMQP message, generates response.
5.  **Reply:** AI Worker publishes AMQP message to `response.device.{id}`.
6.  **Egress:** Bridge consumes AMQP reply and publishes MQTT message to `nomad/.../downlink`.

### 5. Retained Messages (The "Digital Twin")
The MQTT Broker is configured to **Retain** the last known "SitRep".
*   *Benefit:* If the Cloud Dashboard connects, it immediately sees the device's last known state (e.g., "Battery: 12%, Location: Cave"), even if the device is currently offline.
