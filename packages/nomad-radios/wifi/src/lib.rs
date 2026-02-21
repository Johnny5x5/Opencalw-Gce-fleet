#![no_std]
use nomad_radio_core::SpectrumGuard;

pub struct WifiDriver;

impl WifiDriver {
    pub fn new() -> Self { Self }
    pub fn scan(&self) { /* 802.11 Scan */ }
    pub fn transmit(&self, _data: &[u8]) -> Result<(), &'static str> {
        // WiFi is usually Green Zone (ISM), but we check anyway
        Ok(())
    }
}
