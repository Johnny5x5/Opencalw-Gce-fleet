# ADR-004: Tri-Tier Storage Architecture

## Status
Accepted

## Context
NomadOS requires a "Universal Data Plane" that works on a single offline tablet, a mesh of nearby devices, and a federal cloud, without forcing manual sync.
We evaluated:
1.  **CockroachDB everywhere:** Rejected due to resource weight on tablets.
2.  **Pure SQLite:** Rejected due to lack of mesh replication.

## Decision
We adopt a **Tri-Tier Storage Strategy** unified by the **Rust/TiKV** ecosystem:
1.  **Tier 1 (Local):** **NomadFS** (LSM Tree on NVMe) for instant access.
2.  **Tier 2 (Mesh):** **TiKV** (Distributed KV) for peer-to-peer redundancy.
3.  **Tier 3 (Cloud):** **TiDB** (TiKV-compatible SQL) for global backup.

## Consequences
*   **Positive:** Protocol unity (TiKV replication). High performance on Flash. Survivable.
*   **Negative:** Complexity of "Replication Engine" managing three modes.
*   **Reference:** `docs/strategy/DATA_REPLICATION_DOCTRINE.md`
