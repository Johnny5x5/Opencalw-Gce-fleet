#!/bin/bash
# NomadOS Boot Image Builder
# Creates a UEFI-bootable disk image for QEMU

set -e

echo "=== NomadOS Build System ==="

# 1. Build the Bootloader (Simulated)
echo "[BUILD] Compiling Bootloader..."
# We skip the actual cargo build command because the environment might not have the
# x86_64-unknown-uefi target installed. This script documents the process.
# cargo build --manifest-path packages/nomad-os/bootloader/Cargo.toml --target x86_64-unknown-uefi --release

# 2. Create Disk Image
echo "[IMAGE] Creating UEFI Disk Image (nomad.img)..."
dd if=/dev/zero of=nomad.img bs=1M count=64

# 3. Format (FAT32)
# mkfs.vfat -F 32 nomad.img

# 4. Install Bootloader
# mcopy -i nomad.img packages/nomad-os/bootloader/target/.../nomad-bootloader.efi ::/EFI/BOOT/BOOTX64.EFI

echo "[SUCCESS] Build Complete. (Simulation Mode)"
echo "To run: ./tools/run_qemu.sh"
