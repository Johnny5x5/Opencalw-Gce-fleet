use std::fs;
use std::path::Path;
use walkdir::WalkDir;
use serde::{Serialize, Deserialize};
use regex::Regex;
use sled::Db;
use std::collections::HashMap;

mod guardian;
use guardian::validate_law;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Document {
    pub id: String,
    pub title: String,
    pub path: String,
    pub content: String,
    pub tags: Vec<String>,
}

pub struct Scribe {
    db: Db,
}

impl Scribe {
    pub fn new(db_path: &str) -> anyhow::Result<Self> {
        let db = sled::open(db_path)?;
        Ok(Self { db })
    }

    pub fn ingest_directory(&self, root: &str) -> anyhow::Result<usize> {
        let mut count = 0;
        // println!("[DEBUG] Scanning root: {}", root);
        for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_file() {
                if path.extension().map_or(false, |ext| ext == "md") {
                    let path_str = path.to_string_lossy();
                    if path_str.ends_with(".intent.md") || path_str.ends_with("SCHEMA.md") || path_str.ends_with("README.md") {
                        continue;
                    }
                    if self.ingest_file(path)? {
                        count += 1;
                    }
                }
            }
        }
        self.db.flush()?;
        Ok(count)
    }

    fn ingest_file(&self, path: &Path) -> anyhow::Result<bool> {
        let raw_text = fs::read_to_string(path)?;
        let (metadata, content) = self.parse_frontmatter(&raw_text);

        // Convert metadata map to JSON Value to handle types
        let mut json_map = serde_json::Map::new();
        for (k, v) in &metadata {
            if let Ok(num) = v.parse::<u32>() {
                json_map.insert(k.clone(), serde_json::Value::Number(num.into()));
            } else if v == "true" {
                json_map.insert(k.clone(), serde_json::Value::Bool(true));
            } else if v == "false" {
                json_map.insert(k.clone(), serde_json::Value::Bool(false));
            } else {
                json_map.insert(k.clone(), serde_json::Value::String(v.clone()));
            }
        }
        // Handle nested Moral Vectors manually for now (simplification)
        // Ideally we'd recursively parse, but for now we skip strict vector validation
        // to get the ingestion working for non-law files.

        let json_obj = serde_json::Value::Object(json_map);
        let json_str = serde_json::to_string(&json_obj)?;

        if let Err(e) = validate_law(&json_str) {
            println!("[WARN] Validation Failed for {:?}: {}", path, e);
            // Strict Mode: Fail on validation error for Laws
            // Loose Mode: Log and continue
            return Ok(false);
        }

        if let Some(id) = metadata.get("id") {
            let title = metadata.get("title").cloned().unwrap_or("Untitled".to_string());

            let doc = Document {
                id: id.clone(),
                title,
                path: path.to_string_lossy().to_string(),
                content: content.to_lowercase(),
                tags: vec![],
            };

            let bytes = bincode::serialize(&doc)?;
            self.db.insert(id.as_bytes(), bytes)?;
            return Ok(true);
        }
        Ok(false)
    }

    fn parse_frontmatter(&self, text: &str) -> (HashMap<String, String>, String) {
        let re = Regex::new(r"(?s)^---\n(.*?)\n---\n(.*)$").unwrap();
        let mut metadata = HashMap::new();
        let mut content = text.to_string();

        if let Some(caps) = re.captures(text) {
            let yaml_block = caps.get(1).map_or("", |m| m.as_str());
            content = caps.get(2).map_or("", |m| m.as_str()).to_string();

            for line in yaml_block.lines() {
                if let Some((key, value)) = line.split_once(':') {
                    let k = key.trim().to_string();
                    let v = value.trim().replace("\"", "");
                    // Handle simple nesting by flattening or skipping for MVP
                    if !v.is_empty() {
                        metadata.insert(k, v);
                    }
                }
            }
        }
        (metadata, content)
    }
}

pub struct Librarian {
    db: Db,
}

impl Librarian {
    pub fn new(db_path: &str) -> anyhow::Result<Self> {
        let db = sled::open(db_path)?;
        Ok(Self { db })
    }

    pub fn search(&self, query: &str) -> anyhow::Result<Vec<Document>> {
        let term = query.to_lowercase();
        let mut results = Vec::new();

        for item in self.db.iter() {
            if let Ok((_key, value)) = item {
                if let Ok(doc) = bincode::deserialize::<Document>(&value) {
                    let mut score = 0;
                    if doc.title.to_lowercase().contains(&term) {
                        score += 10;
                    }
                    if doc.content.contains(&term) {
                        score += 5;
                    }

                    if score > 0 {
                        results.push(doc);
                    }
                }
            }
        }

        results.sort_by(|a, b| {
            let score_a = if a.title.to_lowercase().contains(&term) { 10 } else { 5 };
            let score_b = if b.title.to_lowercase().contains(&term) { 10 } else { 5 };
            score_b.cmp(&score_a)
        });

        Ok(results)
    }
}
