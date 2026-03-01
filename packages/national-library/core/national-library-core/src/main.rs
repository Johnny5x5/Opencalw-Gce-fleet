use std::env;
use national_library_core::{Scribe, Librarian};

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        println!("Usage: library [ingest|ask <query>]");
        return;
    }

    let command = &args[1];

    if command == "ingest" {
        println!("The Rust Library is digesting knowledge...");
        let mut scribe = Scribe::new();
        match scribe.ingest_directory("./src/knowledge/library") {
            Ok(count) => println!("Digestion Complete. Processed {} documents.", count),
            Err(e) => println!("Error: {}", e),
        }
    } else if command == "ask" {
        if args.len() < 3 {
            println!("Please provide a query.");
            return;
        }
        let query = &args[2..].join(" ");
        println!("\nQuerying the Rust Library for: '{}'...\n", query);

        // In a real app, we would load the index from disk.
        // Here, for the MVP, we re-ingest on the fly.
        let mut scribe = Scribe::new();
        let _ = scribe.ingest_directory("./src/knowledge/library");

        let librarian = Librarian::new(scribe.index);
        let results = librarian.search(query);

        if results.is_empty() {
            println!("The Library is silent.");
        } else {
            for doc in results {
                println!("[MATCH] {}", doc.title);
                println!("        URN: {}", doc.id);
                println!("        Path: {}", doc.path);
                println!("");
            }
        }
    }
}
