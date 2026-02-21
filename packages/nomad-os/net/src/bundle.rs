#![no_std]

// RFC 5050 Bundle Protocol (Simplified)

pub struct PrimaryBlock {
    pub version: u8, // 0x07 for BPv7
    pub flags: u64,
    pub destination: u64, // Nomad Node ID
    pub source: u64,
    pub timestamp: u64,
    pub ttl: u64,
}

pub struct PayloadBlock {
    pub length: u64,
    pub data: [u8; 1024], // Fixed buffer for simulation
}

pub struct Bundle {
    pub primary: PrimaryBlock,
    pub payload: PayloadBlock,
}

impl Bundle {
    pub fn new(dest: u64, data: &[u8]) -> Self {
        // Create new bundle
        Self {
            primary: PrimaryBlock {
                version: 7,
                flags: 0,
                destination: dest,
                source: 0, // Self
                timestamp: 0,
                ttl: 90 * 24 * 3600, // 90 Days
            },
            payload: PayloadBlock {
                length: data.len() as u64,
                data: [0; 1024], // In real code, copy data here
            },
        }
    }
}
