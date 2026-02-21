// Nomad Librarian: RAG Core
#![no_std]

extern crate alloc;
use alloc::vec::Vec;
use alloc::string::String;
use nomad_storage::NomadFS;

// --- The Librarian ---
// Integrates NomadFS (Storage) with the AI Core.

pub struct Librarian {
    pub fs: NomadFS,
}

impl Librarian {
    pub fn new() -> Self {
        Self { fs: NomadFS::new() }
    }

    pub fn ingest(&mut self, filename: &str, content: &[u8]) {
        // 1. Embed Content (Simulated Vector)
        let vector = [0.1; 384];

        // 2. Store in NomadFS (Blob + Vector)
        self.fs.put(content, vector);

        // 3. Log
        // println!("Indexed: {}", filename);
    }

    pub fn query(&self, _question: &str) -> Vec<String> {
        // 1. Embed Question
        let query_vec = [0.1; 384];

        // 2. Search NomadFS
        let _matches = self.fs.search(query_vec);

        // 3. Return Dummy Context (Simulating retrieval of matched blobs)
        let mut results = Vec::new();
        results.push(String::from("NomadFS: Retrieved 'Jeep Manual' (Score: 0.98)"));
        results.push(String::from("NomadFS: Retrieved 'Sector Map' (Score: 0.85)"));
        results
    }
}
