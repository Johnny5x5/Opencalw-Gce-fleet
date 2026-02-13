# Low-Latency Trading Architecture (The "No-GC" Framework)

## 1. Core Philosophy: Zero Garbage Collection
For High-Frequency Trading (HFT) and sensitive algorithmic execution, the unpredictable pauses of Garbage Collection (in Java, Node.js, Python) are unacceptable.

**The Execution Core MUST be written in C++ or Rust.**

## 2. Infrastructure: Compute-Optimized
-   **Instance Type:** `c2-standard-4` (Google Compute Optimized).
-   **Why:** Highest clock speeds (3.1+ GHz) for single-threaded execution loops.
-   **Networking:** Premium Tier. Co-located in `us-east4` (Virginia) or `us-central1` (Iowa) depending on exchange proximity.
-   **OS:** Ubuntu 22.04 LTS (Minimal), tuned with `isolcpus` and `hugepages` for deterministic performance.

## 3. Modular Connector Architecture
The system supports multiple brokerages via a standardized C++ Interface (`ITradingConnector`).

### Supported Brokers (Planned)
1.  **Alpaca Markets:**
    -   **Asset Class:** Stocks, Crypto.
    -   **Protocol:** REST / WebSocket (Paper & Live).
    -   **Use Case:** Mid-frequency, Algorithm testing.
2.  **Interactive Brokers (IBKR):**
    -   **Asset Class:** Global Multi-Asset (Stocks, Options, Futures, Forex).
    -   **Protocol:** TWS API (C++ SDK) via Gateway.
    -   **Use Case:** Professional execution, broad market access.
3.  **Tradier:**
    -   **Asset Class:** Options focus.
    -   **Protocol:** REST API.
4.  **Coinbase Pro / Exchange:**
    -   **Asset Class:** Crypto.
    -   **Protocol:** FIX / WebSocket.

## 4. Separation of Concerns (The "Brain" vs The "Hand")

### **The Brain (Strategy Layer)**
-   **Language:** Python (TensorFlow, PyTorch, Pandas).
-   **Role:** Market analysis, Signal generation, Machine Learning inference.
-   **Constraint:** Can be slower (ms latency ok).
-   **Communication:** ZeroMQ (IPC) or Shared Memory Ring Buffer to talk to the Execution Core.

### **The Hand (Execution Layer)**
-   **Language:** C++20 or Rust.
-   **Role:** Order management, Risk checks, Exchange connectivity.
-   **Constraint:** Microsecond latency. **NO GC.**
-   **Safety:** Hardcoded risk limits (Max Drawdown, Max Order Size) checked *before* every wire transmission.

## 5. Data Pipeline
-   **Market Data:** Ingested via WebSocket (C++) -> Normalized -> Ring Buffer -> Strategy.
-   **Order Entry:** Strategy Signal -> Ring Buffer -> Execution Core (C++) -> Risk Check -> Broker API.

## 6. Implementation Roadmap
1.  **Phase 1:** Build the C++ Execution Core skeleton (Order Book management).
2.  **Phase 2:** Implement Alpaca Connector (REST/WS).
3.  **Phase 3:** Build the Python-to-C++ Bridge (ZeroMQ).
4.  **Phase 4:** Deploy onto `c2-standard-4` and run Paper Trading tests.
