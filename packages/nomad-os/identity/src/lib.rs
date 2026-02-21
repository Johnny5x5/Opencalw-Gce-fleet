#![no_std]

pub struct Keystone;

impl Keystone {
    pub fn sign(&self, message: &[u8]) -> [u8; 64] {
        // Hardware signature (Ed25519)
        [0; 64]
    }

    pub fn get_did(&self) -> &'static str {
        "did:nomad:simulated-identity"
    }
}

pub struct Wallet;

impl Wallet {
    pub fn balance(&self) -> u64 {
        // Return simulated balance
        1000
    }
}
