// Nomad Hardware Abstraction Layer
// Abstracting the "Word Size" for Elastic Computing

#![no_std]

#[cfg(feature = "titan")]
pub type NomadWord = u128; // Rust doesn't have native u512 yet, using u128 as the "Next Step" proxy

#[cfg(not(feature = "titan"))]
pub type NomadWord = u64; // Standard RK3588 Mode

pub trait Arch {
    fn word_size() -> usize;
    fn page_size() -> usize;
}

pub struct RK3588;

impl Arch for RK3588 {
    fn word_size() -> usize { 64 }
    fn page_size() -> usize { 4096 }
}

pub struct Titan512;

impl Arch for Titan512 {
    fn word_size() -> usize { 512 }
    fn page_size() -> usize { 65536 } // 64KB Pages for Massive Memory
}

pub fn current_word_size() -> usize {
    if cfg!(feature = "titan") {
        Titan512::word_size()
    } else {
        RK3588::word_size()
    }
}
