use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct LawObject {
    pub id: String,
    pub title: String,
    pub jurisdiction: String, // "Sovereign" or "Foreign"
    pub moral_vectors: MoralVectors,
    pub max_sentence_years: Option<u32>,
    pub intent_uri: Option<String>,
    pub license: Option<String>,
    pub provenance_type: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct MoralVectors {
    pub harm: u32,
    pub fairness: u32,
    pub loyalty: u32,
    pub authority: u32,
    pub purity: u32,
    pub liberty: u32,
}

#[wasm_bindgen]
pub fn validate_law(json_data: &str) -> Result<String, String> {
    let law: LawObject = serde_json::from_str(json_data).map_err(|e| e.to_string())?;

    // Rule 1: Jubilee Cap (Max 7 Years)
    if let Some(years) = law.max_sentence_years {
        if years > 7 {
            return Err("Jubilee Violation: Max sentence cannot exceed 7 years.".to_string());
        }
    }

    // Rule 2: Moral Weight Range (0-1000)
    if law.moral_vectors.harm > 1000 || law.moral_vectors.fairness > 1000 ||
       law.moral_vectors.loyalty > 1000 || law.moral_vectors.authority > 1000 ||
       law.moral_vectors.purity > 1000 || law.moral_vectors.liberty > 1000 {
        return Err("Moral Weight Violation: Values must be between 0 and 1000.".to_string());
    }

    // Rule 3: Intent Requirement for Sovereign Laws
    if law.jurisdiction == "Sovereign" && law.intent_uri.is_none() {
        return Err("Intent Violation: Sovereign laws must have an intent_uri.".to_string());
    }

    Ok("Valid".to_string())
}
