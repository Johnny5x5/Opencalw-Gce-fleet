#![no_std]

pub trait RadioInterface {
    fn transmit(&mut self, data: &[u8]) -> bool;
    fn receive(&mut self) -> Option<[u8; 256]>;
}

pub struct LoRaDriver;

impl RadioInterface for LoRaDriver {
    fn transmit(&mut self, _data: &[u8]) -> bool {
        // Send via SX1262 SPI
        true
    }

    fn receive(&mut self) -> Option<[u8; 256]> {
        // Poll LoRa buffer
        None
    }
}

pub struct WifiDriver;

impl RadioInterface for WifiDriver {
    fn transmit(&mut self, _data: &[u8]) -> bool {
        // Send via TCP/IP
        true
    }

    fn receive(&mut self) -> Option<[u8; 256]> {
        None
    }
}
