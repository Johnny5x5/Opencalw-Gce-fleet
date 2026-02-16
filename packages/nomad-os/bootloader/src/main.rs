#![no_std]
#![no_main]

// NomadOS Second Stage Bootloader (Post-Limine)
// This code runs AFTER Limine has successfully loaded us.
// The CPU is already in 64-bit Long Mode. Paging is enabled.

use core::panic::PanicInfo;

// The Limine Boot Protocol Request
// We ask Limine to give us the Memory Map.
static MEMORY_MAP_REQUEST: limine::MemoryMapRequest = limine::MemoryMapRequest::new(0);

#[no_mangle]
pub extern "C" fn _start() -> ! {
    // 1. Verify we were loaded by a compliant bootloader
    if MEMORY_MAP_REQUEST.get_response().is_none() {
        // Panic if we don't have a map.
        loop {}
    }

    let memmap = MEMORY_MAP_REQUEST.get_response().unwrap();

    // 2. Mock TPM Measurement (Hash the Kernel)
    measure_kernel_integrity();

    // 3. Handover to Guardian (nomad-system)
    // In a real impl, we would jump to the entry point of the System crate.

    loop {
        // Spin forever (We are the OS now)
    }
}

fn measure_kernel_integrity() {
    // Simulation: Calculate SHA-256 of the next stage
    // Unlock TPM keys if valid
}

#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}
