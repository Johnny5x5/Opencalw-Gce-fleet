#![no_std]

pub mod bundle;
pub mod radio;

pub struct NomadNet {
    // Main Networking Stack
}

impl NomadNet {
    pub fn new() -> Self {
        Self {}
    }

    pub fn send_packet(&self, _data: &[u8]) {
        // Route to appropriate radio
    }
}
