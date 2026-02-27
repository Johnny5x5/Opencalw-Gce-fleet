use anyhow::{Context, Result};
use colored::*;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

#[derive(Debug, Serialize, Deserialize)]
struct Frontmatter {
    id: String,
    title: String,
    jurisdiction: Option<String>,
    version: Option<String>,
    provenance_type: Option<String>,
    intent_uri: Option<String>,
    moral_vectors: Option<MoralVectors>,
}

#[derive(Debug, Serialize, Deserialize)]
struct MoralVectors {
    harm: Option<i32>,
    fairness: Option<i32>,
    loyalty: Option<i32>,
    authority: Option<i32>,
    purity: Option<i32>,
    liberty: Option<i32>,
}

fn main() -> Result<()> {
    println!("{}", "=== Verifying Sovereign National Library (Rust Guardian) ===".bold().green());

    // We assume the tool is run from the root of the repo, or we look for the relative path.
    // Since we are running `cargo run` inside `tools/legal-guardian`, the CWD is `tools/legal-guardian`.
    // The library is at `../../src/knowledge/library/legal`.

    let legal_dir = Path::new("../../src/knowledge/library/legal");

    // Fallback: Check if we are at root
    let legal_dir = if legal_dir.exists() {
        legal_dir
    } else {
        Path::new("src/knowledge/library/legal")
    };

    if !legal_dir.exists() {
        println!("{}", format!("Error: legal directory not found at {:?}!", legal_dir).red());
        return Ok(());
    }

    let mut success_count = 0;
    let mut fail_count = 0;
    let mut total_files = 0;

    // Regex for Frontmatter
    let re_frontmatter = Regex::new(r"(?s)^---\n(.*?)\n---").unwrap();

    for entry in WalkDir::new(legal_dir)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map_or(false, |ext| ext == "md"))
    {
        let path = entry.path();

        // Skip Intent files (they are sidecars) and README/SCHEMA
        if path.file_name().unwrap().to_str().unwrap().contains(".intent.md")
           || path.file_name().unwrap() == "README.md"
           || path.file_name().unwrap() == "SCHEMA.md" {
            continue;
        }

        total_files += 1;
        match process_file(path, &re_frontmatter) {
            Ok(_) => {
                success_count += 1;
            }
            Err(e) => {
                println!("{} {}: {}", "[FAIL]".red().bold(), path.display(), e);
                fail_count += 1;
            }
        }
    }

    println!("\n{}", "=== Summary ===".bold());
    println!("Total Files Scanned: {}", total_files);
    println!("Successful Validations: {}", success_count.to_string().green());
    println!("Failed Validations: {}", fail_count.to_string().red());

    if fail_count > 0 {
        std::process::exit(1);
    }

    Ok(())
}

fn process_file(path: &Path, re: &Regex) -> Result<()> {
    let content = fs::read_to_string(path)
        .with_context(|| format!("Failed to read file: {:?}", path))?;

    // 1. Extract Frontmatter
    let caps = re.captures(&content)
        .context("Missing YAML Frontmatter (--- ... ---)")?;

    let yaml_str = caps.get(1).unwrap().as_str();
    let fm: Frontmatter = serde_yaml::from_str(yaml_str)
        .with_context(|| "Invalid YAML Frontmatter structure")?;

    // 2. Validate Required Fields
    if fm.id.is_empty() {
        anyhow::bail!("Field 'id' is empty");
    }
    if fm.title.is_empty() {
        anyhow::bail!("Field 'title' is empty");
    }

    // 3. Verify Intent File Existence (if referenced)
    if let Some(intent_uri) = &fm.intent_uri {
        let parent = path.parent().unwrap();
        // Resolve relative path (./foo.intent.md)
        let resolved_path = if intent_uri.starts_with("./") {
             parent.join(intent_uri.trim_start_matches("./"))
        } else {
             parent.join(intent_uri)
        };

        if !resolved_path.exists() {
            anyhow::bail!("Referenced intent_uri not found: {:?}", resolved_path);
        }
    }

    // 4. Validate Moral Vectors (if present)
    if let Some(vectors) = &fm.moral_vectors {
        validate_vector("harm", vectors.harm)?;
        validate_vector("fairness", vectors.fairness)?;
        validate_vector("loyalty", vectors.loyalty)?;
        validate_vector("authority", vectors.authority)?;
        validate_vector("purity", vectors.purity)?;
        validate_vector("liberty", vectors.liberty)?;
    }

    println!("{} {}", "[PASS]".green(), path.display());
    Ok(())
}

fn validate_vector(name: &str, val: Option<i32>) -> Result<()> {
    if let Some(v) = val {
        if v < 0 || v > 1000 {
            anyhow::bail!("Moral Vector '{}' out of range (0-1000): {}", name, v);
        }
    }
    Ok(())
}
