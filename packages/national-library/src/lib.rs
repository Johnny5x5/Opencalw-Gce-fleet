use std::fs;
use std::path::Path;
use walkdir::WalkDir;
use serde::{Serialize, Deserialize};
use regex::Regex;
use sled::Db;
use std::collections::HashMap;

mod guardian; // Integrated Guardian Module
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
        for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.extension().map_or(false, |ext| ext == "md") {
                if path.to_string_lossy().ends_with(".intent.md") {
                    continue;
                }
                if self.ingest_file(path)? {
                    count += 1;
                }
            }
        }
        self.db.flush()?;
        Ok(count)
    }

    fn ingest_file(&self, path: &Path) -> anyhow::Result<bool> {
        let raw_text = fs::read_to_string(path)?;
        let (metadata, content) = self.parse_frontmatter(&raw_text);

        let json_meta = serde_json::to_string(&metadata)?;
        if let Err(_e) = validate_law(&json_meta) {
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
                    metadata.insert(k, v);
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
                let doc: Document = bincode::deserialize(&value)?;

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

        results.sort_by(|a, b| {
            let score_a = if a.title.to_lowercase().contains(&term) { 10 } else { 5 };
            let score_b = if b.title.to_lowercase().contains(&term) { 10 } else { 5 };
            score_b.cmp(&score_a)
        });

        Ok(results)
    }
}
