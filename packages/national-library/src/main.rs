use clap::{Parser, Subcommand};
use national_library::{Scribe, Librarian};
use colored::*;

#[derive(Parser)]
#[command(name = "sovereign-library")]
#[command(about = "The Official CLI of the Sovereign National Library", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    /// Path to the Library Database
    #[arg(short, long, default_value = "./library.db")]
    db: String,
}

#[derive(Subcommand)]
enum Commands {
    /// Ingest knowledge from the 13 Pillars
    Ingest {
        /// Path to the knowledge source
        #[arg(short, long, default_value = "./src/knowledge/library")]
        path: String,
    },
    /// Query the Library for Truth
    Ask {
        /// The question or keyword
        query: Vec<String>,
    },
}

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Ingest { path } => {
            println!("{}", "The Library is digesting knowledge...".green().bold());
            let scribe = Scribe::new(&cli.db)?;
            match scribe.ingest_directory(path) {
                Ok(count) => println!("{}", format!("Digestion Complete. Processed {} documents.", count).green()),
                Err(e) => println!("{}", format!("Error: {}", e).red()),
            }
        }
        Commands::Ask { query } => {
            let query_str = query.join(" ");
            println!("{}", format!("\nQuerying the Library for: '{}'...\n", query_str).cyan());

            let librarian = Librarian::new(&cli.db)?;
            let results = librarian.search(&query_str)?;

            if results.is_empty() {
                println!("{}", "The Library is silent on this matter.".yellow());
            } else {
                for doc in results {
                    println!("{} {}", "[MATCH]".green().bold(), doc.title.bold());
                    println!("        URN: {}", doc.id);
                    println!("        Path: {}", doc.path);
                    println!("");
                }
            }
        }
    }

    Ok(())
}
