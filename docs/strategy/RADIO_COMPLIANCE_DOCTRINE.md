# Radio Compliance Doctrine: The Spectrum Guard
## Preventing Federal Incidents via Software

### 1. The Prime Directive: Do Not Jam the Pentagon
Operating a Sovereign Radio capable of transmitting on any frequency is a legal minefield. Transmitting on a Military or Emergency frequency can result in immediate arrest, fines, and equipment seizure.
*   **The Mission:** We must build a **Hard Software Limit** that prevents the user from accidentally becoming a felon.

### 2. Frequency Segregation (The "Traffic Light" System)
NomadOS categorizes the RF Spectrum into four strict zones.

#### ZONE GREEN: Civilian / Unlicensed (Safe to TX)
*   **ISM Bands:** 902-928 MHz (US), 868 MHz (EU), 433 MHz (World), 2.4 GHz, 5.8 GHz.
*   **Citizens Band (CB):** 27 MHz.
*   **FRS/MURS:** Specific UHF channels (Low Power).
*   **Action:** **TX ALLOWED** (Power Limits Apply).

#### ZONE AMBER: Licensed / Restricted (Check License)
*   **Amateur Radio (Ham):** 160m - 70cm bands.
*   **GMRS:** Requires license.
*   **Maritime (Marine VHF):** Only allowed on water.
*   **Action:** **TX BLOCKED** unless User inputs a valid Call Sign and toggles "Expert Mode".

#### ZONE WHITE: Listen Only (Public Safety)
*   **Aviation:** 118-137 MHz.
*   **Weather:** NOAA 162 MHz.
*   **Action:** **RX ONLY.** TX is hard-blocked.

#### ZONE RED: Military / Government (Forbidden)
*   **Military Air:** 225-400 MHz.
*   **Federal/NATO:** Specific HF/VHF allocations.
*   **GPS/GNSS:** 1.2/1.5 GHz.
*   **Action:** **TX HARD BLOCKED.** The driver physically disables the PA (Power Amplifier). Attempting to bypass logs a "Safety Violation".

### 3. The Spectrum Guard Architecture
Every Radio Driver must implement the `SpectrumGuard` trait.

1.  **Geolocation Lock:** The OS checks GPS. If you are in the US, it applies FCC Part 15/97 rules. If you are in Europe, it applies ETSI/CEPT rules.
2.  **Listen Before Talk (LBT):** The radio listens for 10ms. If it hears *anything* on a restricted band, it aborts TX.
3.  **The "Kill Switch":** If the SDR driver detects output power on a Red Frequency, the kernel kills the process.

### 4. Implementation Strategy
*   **Database:** `packages/nomad-radios/core/src/frequency_db.rs` contains the frequency map.
*   **Logic:** `nomad-radio-sdr` checks every `transmit()` call against the DB.
