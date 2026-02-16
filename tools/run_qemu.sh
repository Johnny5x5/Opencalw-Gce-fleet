#!/bin/bash
# NomadOS QEMU Launcher

echo "=== NomadOS Emulator ==="
echo "Booting UEFI Image..."

# qemu-system-x86_64 \
#    -drive if=pflash,format=raw,readonly=on,file=/usr/share/ovmf/OVMF.fd \
#    -drive format=raw,file=nomad.img \
#    -nographic

echo "[SIMULATION] QEMU Started."
echo "[SIMULATION] UEFI Firmware Loaded."
echo "[SIMULATION] Executing /EFI/BOOT/BOOTX64.EFI..."
echo "[SIMULATION] Welcome to NomadOS v0.1 (Sovereign Edition)"
echo "[SIMULATION] Handing over control to seL4..."
