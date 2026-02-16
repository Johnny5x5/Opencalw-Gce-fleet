# ADR-001: Hybrid Sovereignty Kernel (seL4 + Federated Unikernels)

## Status
Accepted

## Context
NomadOS aims to provide a "Military-Grade" secure environment while maintaining high performance for AI and File I/O on embedded hardware (RK3588).
We evaluated:
1.  **Monolithic Kernel (Linux):** Rejected due to massive attack surface and fragility (driver crashes = panic).
2.  **Pure Exokernel:** Rejected due to implementation complexity and difficulty in enforcing security policies.
3.  **Microkernel (seL4):** Verified correct, but traditionally slow/hard to develop for.

## Decision
We adopt a **Hybrid Sovereignty** architecture:
1.  **seL4** serves as the immutable Hardware Hypervisor, guaranteeing isolation between cores.
2.  **Federated Rust Unikernels** run in userspace (Root Task, Drivers, Filesystem), providing Exokernel-like performance (Zero-Copy I/O) within their secure domains.

## Consequences
*   **Positive:** Mathematically proven isolation. High performance for AI/Storage.
*   **Negative:** Requires custom driver development (Rust).
*   **Reference:** `docs/strategy/KERNEL_ARCHITECTURE_DISSERTATION.md`
