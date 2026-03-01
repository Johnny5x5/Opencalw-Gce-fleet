use clap::{Parser, Subcommand};
use colored::*;
use iron_dome_core::IronDome;

#[derive(Parser)]
#[command(name = "iron-dome")]
#[command(about = "The Sovereign Network Defense System", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Activate Active Defense Protocols
    Active,
    /// Show Defense Status
    Status,
}

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();
    // Path relative to the binary execution context
    let doctrine_path = "../../src/knowledge/library/military/doctrines/cyber_defense_doctrine.md";

    let mut dome = IronDome::new(doctrine_path);

    match &cli.command {
        Commands::Active => {
            println!("{}", "\n=== IRON DOME: ACTIVE DEFENSE INITIATED ===".red().bold());
            dome.activate()?;

            println!("Status: {}", dome.status.green().bold());
            println!("Threats Neutralized: {}", dome.threats_blocked.to_string().yellow());
            println!("Active Rules:");
            for rule in &dome.active_rules {
                let rule_str: &str = rule.as_str();
                println!(" - {}", rule_str.cyan());
            }
            println!("{}", "===========================================\n".red());
        }
        Commands::Status => {
            // Just load doctrine for status check
            let _ = dome.activate();
            println!("System Status: {}", "OPERATIONAL".green());
        }
    }

    Ok(())
}
