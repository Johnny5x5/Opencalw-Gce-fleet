// Nomad Librarian: RAG Core
#![no_std]

extern crate alloc;
use alloc::vec::Vec;
use alloc::string::String;

// --- Vector Store Interface ---

pub trait VectorStore {
    fn insert(&mut self, text: &str, vector: &[f32]);
    fn search(&self, query_vector: &[f32], top_k: usize) -> Vec<String>;
}

pub struct LanceDBStub {
    // In a real impl, this would hold the connection to the LanceDB on NVMe
    pub path: &'static str,
}

impl LanceDBStub {
    pub fn new() -> Self {
        Self { path: "/data/nomad/library/vectors.lance" }
    }
}

impl VectorStore for LanceDBStub {
    fn insert(&mut self, _text: &str, _vector: &[f32]) {
        // Mock Insert: Write to NVMe
    }

    fn search(&self, _query_vector: &[f32], _top_k: usize) -> Vec<String> {
        // Mock Search: Return dummy results
        let mut results = Vec::new();
        results.push(String::from("Found match in manual.pdf (Chunk #42)"));
        results.push(String::from("Found match in map_log.txt (Chunk #7)"));
        results
    }
}

// --- The Indexer ---

pub struct Indexer {
    pub store: LanceDBStub,
}

impl Indexer {
    pub fn new() -> Self {
        Self { store: LanceDBStub::new() }
    }

    pub fn ingest_file(&mut self, filename: &str) {
        // 1. Read File
        // 2. Chunk Text
        // 3. Embed (Call NPU)
        // 4. Store
        self.store.insert(filename, &[0.1, 0.2, 0.3]); // Dummy vector
    }
}

// --- The Retriever ---

pub struct Retriever {
    pub store: LanceDBStub,
}

impl Retriever {
    pub fn new() -> Self {
        Self { store: LanceDBStub::new() }
    }

    pub fn query(&self, _question: &str) -> Vec<String> {
        // 1. Embed Question (Call NPU)
        let query_vec = [0.1, 0.2, 0.3];

        // 2. Search Vector DB
        self.store.search(&query_vec, 3)
    }
}
