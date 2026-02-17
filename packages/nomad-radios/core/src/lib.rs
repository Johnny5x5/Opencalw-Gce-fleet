#![no_std]

pub enum FrequencyZone {
    Green, // ISM/Civilian
    Amber, // Ham/Licensed
    White, // RX Only (Air/Weather)
    Red,   // Military/Forbidden
}

pub struct GeoLocation {
    pub lat: f64,
    pub lon: f64,
    pub country: &'static str, // ISO code
}

pub trait SpectrumGuard {
    fn check_tx_allowed(&self, freq_hz: u64, power_dbm: i32, loc: &GeoLocation) -> Result<(), &'static str>;
}

pub struct GlobalSpectrumDatabase;

impl GlobalSpectrumDatabase {
    pub fn get_zone(freq_hz: u64, country: &str) -> FrequencyZone {
        // Simplified Logic for Simulation
        match (freq_hz, country) {
            // US ISM Bands
            (902_000_000..=928_000_000, "US") => FrequencyZone::Green,
            (2_400_000_000..=2_483_500_000, _) => FrequencyZone::Green,

            // Marine VHF (156MHz)
            (156_000_000..=162_000_000, _) => FrequencyZone::Amber,

            // Airband
            (118_000_000..=137_000_000, _) => FrequencyZone::White,

            // Military UHF
            (225_000_000..=400_000_000, _) => FrequencyZone::Red,

            _ => FrequencyZone::Amber, // Default to Caution
        }
    }
}
