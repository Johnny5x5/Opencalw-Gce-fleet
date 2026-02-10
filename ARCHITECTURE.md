# OpenClaw Conglomerate Architecture

This document outlines the architectural design for the OpenClaw "Virtual Enterprise Office" on Google Cloud Platform (GCP). The goal is to build a scalable, managed, "conglomerate-style" ecosystem where AI agents operate as distinct departments (or "Child Businesses") within a secure, Google-first environment.

## 1. High-Level Concept

The system is designed as a **Federation of Departments**. Each department (e.g., HQ, Engineering, HR) operates as an autonomous unit with its own compute, storage, and identity, but shares a common communication backbone and policy framework.

*   **Managed & Scalable:** Uses Managed Instance Groups (MIGs) and Internal Load Balancers (ILBs) for high availability and auto-scaling.
*   **Google First:** Leverages GCP native services (Pub/Sub, GCS, Firestore, Cloud NAT, IAP) wherever possible.
*   **API First:** Departments expose their capabilities via internal HTTP APIs (load balanced) and asynchronous Pub/Sub topics.
*   **DoD-Grade Security:** "Zero Trust" networking. No public IPs. Access via Identity-Aware Proxy (IAP) only. Strict Service Account permissions.

## 2. Infrastructure Design

### 2.1 Networking (The "Virtual Office Building")

*   **VPC Network:** A custom Virtual Private Cloud (VPC) hosting all departments.
*   **Subnets:** Dedicated subnets for departments or regions to ensure logical separation.
*   **Private Google Access:** Enabled on all subnets to allow private communication with Google APIs (Storage, Pub/Sub, Firestore) without traversing the public internet.
*   **Cloud NAT:** Provides secure outbound internet access for package updates (Node.js, OS patches) without exposing instances to inbound traffic.
*   **Firewall Rules:**
    *   **Deny All Inbound:** Default rule.
    *   **Allow Internal:** Traffic between departments is allowed on specific API ports (e.g., 8080).
    *   **Allow IAP:** SSH access (TCP 22) is allowed *only* from the Google IAP IP range (`35.235.240.0/20`).

### 2.2 The "Department" Module ("Business-in-a-Box")

Each department is provisioned using a standardized Terraform module containing:

1.  **Compute (The Workforce):**
    *   **Managed Instance Group (MIG):** A scalable fleet of `e2-standard-2` (or similar) instances.
    *   **OS:** Ubuntu 22.04 LTS (Minimal, Hardened).
    *   **Security:** Shielded VM enabled (Secure Boot, vTPM, Integrity Monitoring).
    *   **Scaling Policy:** CPU utilization or Custom Metric (Pub/Sub Queue Depth).

2.  **Identity (The Badge):**
    *   **Service Account:** A unique identity (e.g., `sa-engineering@...`) with *least privilege* IAM roles.
        *   Can read/write its own GCS bucket.
        *   Can pull messages from its own Pub/Sub subscription.
        *   Can write to its specific Firestore collection.

3.  **Communication (The Intercom & Mailroom):**
    *   **Internal Load Balancer (ILB):** Exposes the department's synchronous API (HTTP) to other departments.
        *   DNS: `engineering.internal`, `hr.internal`.
    *   **Pub/Sub Topic:** An asynchronous input channel (e.g., `projects/.../topics/dept-engineering-inbox`).

4.  **Storage (The Filing Cabinet):**
    *   **GCS Bucket:** Private bucket for unstructured data (logs, artifacts, documents).
    *   **Firestore Collection:** (Logical separation) For agent memory, context, and state.

### 2.3 Agent Logic & Bootstrap

Instances are stateless. They hydrate their state upon startup using a **Startup Script**:

1.  **System Hardening:** Apply security patches.
2.  **Blacklist Enforcement:** Update `/etc/hosts` to block domains associated with competitors (Twitter/X, Tesla, SpaceX, etc.) to ensure no accidental data leakage or dependency.
3.  **Install Runtime:** Node.js (LTS), OpenClaw (Latest Secure Version).
4.  **Skill Injection:** Download the "Department Skill Bundle" from a central trusted GCS bucket (`gs://admin-skills-repo/engineering.zip`).
5.  **Start Agent:** Launch OpenClaw, binding to the internal ILB port.

## 3. Security Posture

*   **No Public IPs:** Instances are completely isolated from the public internet ingress.
*   **Identity-Aware Proxy (IAP):** Administrator access (SSH) is tunneled through Google's global load balancers and authenticated via IAM. No bastion hosts required.
*   **Secret Management:** API Keys (for external LLMs like Claude/OpenRouter) are stored in **Google Secret Manager** and injected into the environment variables at runtime.

## 4. Scalability & Succession

*   **Horizontal Scaling:** MIGs automatically add instances based on load.
*   **Succession:** If a department grows into a "Child Business," its state (Firestore/GCS) can be snapshotted and migrated to a new GCP Project, while retaining the same interface contract.

## 5. Directory Structure

```
.
├── ARCHITECTURE.md          # This file
├── terraform/               # Infrastructure-as-Code
│   ├── modules/
│   │   └── department/      # Reusable "Business-in-a-Box" module
│   ├── main.tf              # Department instantiation (HQ, Eng, HR)
│   ├── network.tf           # VPC, NAT, Firewall, IAP
│   └── variables.tf
└── src/
    └── scripts/
        └── bootstrap.sh     # Agent startup & configuration
```
