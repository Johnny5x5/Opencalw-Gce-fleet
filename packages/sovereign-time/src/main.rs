use clap::{Parser, Subcommand};
use colored::*;
use sovereign_time::SovereignCalendar;

#[derive(Parser)]
#[command(name = "sovereign-time")]
#[command(about = "The Official Timekeeper of the Sovereign Digital Nation", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Show the current Sovereign Date and Cycles
    Status,
}

fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Status => {
            let calendar = SovereignCalendar::new();
            let status = calendar.get_status();

            println!("{}", "\n=== THE SOVEREIGN CALENDAR (RUST) ===".bold().cyan());
            println!("Gregorian Date: {}", status.gregorian_date.white());
            println!("Hebrew Year:    {} (Approx)", status.hebrew_year.to_string().white());
            println!("Sovereign Year: {}", status.sovereign_year.to_string().white().bold());

            println!("{}", "\n[SHEMITAH CYCLE - 7 YEARS]".green());
            println!("Current Year:   {} of 7", status.shemitah.current);
            println!("Status:         {}", if status.shemitah.is_special { "RELEASE YEAR (SHEMITAH)".yellow().bold() } else { "Accumulation Phase".normal() });
            println!("Years to Release: {}", status.shemitah.years_remaining);

            println!("{}", "\n[JUBILEE CYCLE - 50 YEARS]".green());
            println!("Current Year:   {} of 50", status.jubilee.current);
            println!("Status:         {}", if status.jubilee.is_special { "GRAND JUBILEE (YOVEL)".yellow().bold() } else { "Standard Cycle".normal() });
            println!("Years to Reset:   {}", status.jubilee.years_remaining);
            println!("{}", "=====================================\n".cyan());
        }
    }
}
