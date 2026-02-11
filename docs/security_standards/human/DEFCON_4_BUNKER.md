# DEFCON 4: Bunker (DoD IL5 / IL6 Simulation)

**Objective:** National Security Systems / Classified Data Simulation.
**Risk Profile:** Critical. Failure = Existential Threat.
**Cost:** Very High. **Friction:** Extreme.

## Technical Controls (Includes Level 3)
*   **Hardware Security:**
    *   **Cloud HSM:** All keys managed in FIPS 140-2 Level 3 hardware.
*   **Isolation:**
    *   **Air Gap:** No internet connection whatsoever. Updates via physical media (simulated via strict pipeline).
    *   **Sole Tenant Nodes:** Dedicated physical servers (no noisy neighbors).
*   **Data Sovereignty:**
    *   **Access Transparency:** Google must justify accessing the underlying host.
    *   **Key Access Justification:** You see *why* a key was decrypted.

## Operational Policy
*   **Clearance:** Only US Citizens / Cleared Personnel.
*   **Terminals:** Access only via specific managed devices (mTLS).
