use std::env;

const START_YEAR: u32 = 1;
const END_YEAR: u32 = 100;

// Sustainability Constants (Adjusted for Equilibrium)
const INITIAL_FISH_STOCK: i32 = 1000;
const REGEN_RATE_NORMAL: i32 = 120; // Enough to offset harvest
const REGEN_RATE_REST: i32 = 200;  // High growth during rest
const HARVEST_RATE_COMMERCIAL: i32 = 100;
const HARVEST_RATE_PERSONAL: i32 = 10;

fn main() {
    println!("=== Sovereign Fishing Laws Emulation (100-Year Simulation) ===");
    println!("Purpose: Verify Commercial Fishing Moratorium on Jubilee & Grand Jubilee Years");

    let mut fish_stock = INITIAL_FISH_STOCK;

    for year in START_YEAR..=END_YEAR {
        let is_jubilee = year % 7 == 0;
        let is_grand_jubilee = year % 50 == 0;
        let mut commercial_ban = false;
        let mut status = "OPEN";

        // Determine Status
        if is_grand_jubilee {
            commercial_ban = true;
            status = "GRAND JUBILEE (Rest & Rebuild)";
        } else if is_jubilee {
            commercial_ban = true;
            status = "JUBILEE (Rest)";
        }

        // Apply Effects
        if commercial_ban {
            // Commercial Fishing Banned
            // Personal Fishing Allowed
            fish_stock -= HARVEST_RATE_PERSONAL;
            fish_stock += REGEN_RATE_REST;
        } else {
            // Commercial & Personal Allowed
            fish_stock -= HARVEST_RATE_COMMERCIAL + HARVEST_RATE_PERSONAL;
            fish_stock += REGEN_RATE_NORMAL;
        }

        // Output Year Status
        let comm_status = if commercial_ban { "BANNED" } else { "ACTIVE" };
        println!("Year {:3}: Status: [{:^25}] | Commercial: {:^8} | Personal: ACTIVE | Fish Stock: {:5}",
                 year, status, comm_status, fish_stock);

        // Safety Check
        if fish_stock <= 0 {
            eprintln!("CRITICAL: Fish Stock Depleted! Simulation Failed.");
            std::process::exit(1);
        }
    }

    println!("\n=== Simulation Complete: Ecosystem Sustainable ===");
}
