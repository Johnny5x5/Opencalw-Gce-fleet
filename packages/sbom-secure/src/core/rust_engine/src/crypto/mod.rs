pub mod pqc;

pub struct CryptoContext {
    pub algorithm_version: String,
}

impl CryptoContext {
    pub fn new() -> Self {
        CryptoContext {
            algorithm_version: "v1.0 (Hybrid)".to_string(),
        }
    }
}
