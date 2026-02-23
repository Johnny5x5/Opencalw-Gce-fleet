use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;
use serde::{Serialize, Deserialize};
use regex::Regex;
use library_guardian::validate_law;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Document {
    pub id: String,
    pub title: String,
    pub path: String,
    pub content: String,
    pub tags: Vec<String>,
}

pub struct Scribe {
    pub index: Vec<Document>,
}

impl Scribe {
    pub fn new() -> Self {
        Self { index: Vec::new() }
    }

    pub fn ingest_directory(&mut self, root: &str) -> anyhow::Result<usize> {
        for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.extension().map_or(false, |ext| ext == "md") {
                if path.to_string_lossy().ends_with(".intent.md") {
                    continue;
                }
                self.ingest_file(path)?;
            }
        }
        Ok(self.index.len())
    }

    fn ingest_file(&mut self, path: &Path) -> anyhow::Result<()> {
        let raw_text = fs::read_to_string(path)?;
        let (metadata, content) = self.parse_frontmatter(&raw_text);

        let json_meta = serde_json::to_string(&metadata)?;
        if let Err(e) = validate_law(&json_meta) {
            // println!("[WARN] Validation Failed for {:?}: {}", path, e);
            return Ok(());
        }

        if let Some(id) = metadata.get("id") {
            let title = metadata.get("title").cloned().unwrap_or("Untitled".to_string());

            self.index.push(Document {
                id: id.to_string(),
                title,
                path: path.to_string_lossy().to_string(),
                content: content.to_lowercase(),
                tags: vec![],
            });
        }
        Ok(())
    }

    fn parse_frontmatter(&self, text: &str) -> (std::collections::HashMap<String, String>, String) {
        let re = Regex::new(r"(?s)^---\n(.*?)\n---\n(.*)$").unwrap();
        let mut metadata = std::collections::HashMap::new();
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

// The Librarian Logic (Search)
pub struct Librarian {
    index: Vec<Document>,
}

impl Librarian {
    pub fn new(index: Vec<Document>) -> Self {
        Self { index }
    }

    pub fn search(&self, query: &str) -> Vec<Document> {
        let term = query.to_lowercase();
        let mut results = Vec::new();

        for doc in &self.index {
            let mut score = 0;
            if doc.title.to_lowercase().contains(&term) {
                score += 10;
            }
            if doc.content.contains(&term) {
                score += 5;
            }

            if score > 0 {
                results.push(doc.clone());
            }
        }

        // Basic sort by relevance (mock)
        results
    }
}
