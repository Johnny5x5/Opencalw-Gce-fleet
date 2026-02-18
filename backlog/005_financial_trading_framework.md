# Backlog Item: Financial Trading Framework (Low-Latency / No-GC)

**Status:** Pending
**Priority:** High
**Department:** Finance / Engineering

## Objective
Implement a high-performance, low-latency trading engine using C++ or Rust to avoid Garbage Collection pauses during execution, enabling professional-grade algorithmic trading.

## Requirements

1.  **Infrastructure (`terraform/modules/trading_engine`):**
    -   Provision a `c2-standard-4` (Compute Optimized) instance.
    -   Configure OS tuning: `isolcpus`, `hugepages`, `network-latency` profile.
    -   Ensure strict firewall rules (Only Strategy Layer IPs can connect).

2.  **Execution Core (C++/Rust):**
    -   **Order Management System (OMS):** comprehensive tracking of Open, Filled, Cancelled orders.
    -   **Risk Engine:** Pre-trade checks (Max Position Size, Max Daily Loss).
    -   **Connectors:**
        -   `AlpacaConnector`: WebSocket for data, REST for orders.
        -   `IBKRConnector`: Integration with IB Gateway (TWS API).
        -   `CoinbaseConnector`: FIX/WebSocket support.

3.  **Strategy Bridge:**
    -   Implement a high-speed Inter-Process Communication (IPC) mechanism (ZeroMQ or Shared Memory) to allow Python ML models to send signals to the C++ core.

4.  **Testing (Paper Mode):**
    -   All connectors must support a `PAPER_TRADING` flag.
    -   Unit tests for the Risk Engine must pass 100% before any live connection is allowed.
