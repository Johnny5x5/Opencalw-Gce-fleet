#!/bin/bash
# NomadOS TUI Launcher Script

echo "=== NomadOS Dashboard Launcher ==="
echo "Checking for Rust toolchain..."

if ! command -v cargo &> /dev/null
then
    echo "[WARN] Rust ('cargo') could not be found."
    echo "To run the TUI, please install Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo "Simulating launch instead..."
    echo "[SIMULATION] Launching Dashboard..."
    echo "[SIMULATION] | Status | Mission | Mesh | Console |"
    echo "[SIMULATION] | Core 0: 12% | Core 1: 99% |"
    echo "[SIMULATION] Dashboard Active. Press Ctrl+C to exit."
    exit 0
fi

echo "Compiling Nomad Userland..."
cd packages/nomad-os/userland
cargo run --release
