# NomadOS Protocol Stack
## The "Nomad Bundle" Specification (NBP)

### 1. Architectural Layers

#### Layer 7: The Application (Mission)
*   **Protocol:** Nomad Mission Protocol (NMP).
*   **Format:** JSON/CBOR encoded tasks (e.g., `{"type": "mission", "action": "route_to_water", "lat": 45.0, "lon": -90.0}`).
*   **Encryption:** End-to-End (E2E) using Signal Double Ratchet.

#### Layer 6: The Presentation (Wrapper)
*   **Protocol:** AES-256-GCM Military Wrapper.
*   **Function:** Every outgoing packet is encrypted *before* it touches the transport layer.
*   **Header:** Unencrypted but authenticated (HMAC) routing header: `[NomadID_Dest][TTL][Priority][HMAC]`.

#### Layer 5: The Session (DTN)
*   **Protocol:** RFC 5050 Bundle Protocol (BPv7).
*   **Function:** Store-and-Forward reliability.
*   **Features:**
    *   **Custody Transfer:** Each node takes responsibility for the bundle until an ACK is received from the next hop.
    *   **TTL (Time To Live):** Configurable up to 90 days.
    *   **Fragmentation:** Large files (images/maps) are split into tiny chunks to survive intermittent links.

#### Layer 4: The Transport (Bonding)
*   **Protocol:** Nomad Multi-Link Bond (NMLB).
*   **Function:** Aggregates all available radios into a single logical pipe.
*   **Strategy:**
    *   **Latency-Sensitive:** Use Low-Latency Links (Cellular/WiFi/L-Band Sat).
    *   **Bulk Data:** Use High-Bandwidth Links (WiFi/Ka-Band Sat).
    *   **Keep-Alive:** Use Ultra-Low-Bandwidth Links (LoRa/HF Radio).

#### Layer 3: The Network (Overlay)
*   **Protocol:** cjdns / Yggdrasil (IPv6 Cryptographic Address Space).
*   **Addressing:** Device ID is its Public Key. No central DHCP or DNS required.
*   **Routing:** Source-routed (cjdns) or Greedy-routed (Yggdrasil) mesh.

#### Layer 2: The Link (Physical)
*   **Supported Mediums:**
    *   **LoRa:** Meshtastic (915MHz/868MHz/433MHz).
    *   **WiFi:** 802.11 (2.4GHz/5GHz).
    *   **Bluetooth:** BLE 5.0 (Short range mesh).
    *   **Satellite:** Iridium (SBD), Inmarsat (BGAN), Thuraya. **Startlink Blacklisted.**
    *   **HF Radio:** NVIS (Near Vertical Incidence Skywave) for regional backup.
    *   **Sneakernet:** USB/SD Card physical transfer.

### 2. The "Nomad Bridge"
A software module that acts as the gateway between the local mesh and the global internet.
*   **Role:** Translates Nomad Bundles (BPv7) to HTTPS/WSS for cloud uplink.
*   **Security:** Mutual TLS (mTLS) + HMAC Authentication.

### 3. Data Standard: Cursor on Target (CoT)
NomadOS uses the US Military standard CoT (XML/Protobuf) for all geospatial and tactical data.
*   **Why:** Interoperability with ATAK/WinTAK and other civil defense tools.
*   **Schema:** `<event version="2.0" uid="nomad-123" type="a-f-G-U-C" time="..." start="..." stale="..." how="m-g"> ... </event>`
