---
id: "urn:lex:engineering:blueprint:sovereign_server"
title: "The Sovereign Server (Class D)"
type: "Hardware"
status: "Production"
---

# The Sovereign Server (Class D)

## Overview
A rack-mount server designed for the "Titan" architecture (512-bit). It runs the NomadOS Guardian Root Task.

## Specs
*   **CPU:** 128-Core RISC-V (Open Source Silicon).
*   **RAM:** 1TB ECC.
*   **Storage:** 1PB NVMe Pool (NomadFS Tier 1).
*   **OS:** NomadOS (seL4 Microkernel).

## Instructions
1.  Mill the chassis from aluminum block.
2.  Flash the `bootloader.bin` via JTAG.
3.  Verify the Hardware Root of Trust.
