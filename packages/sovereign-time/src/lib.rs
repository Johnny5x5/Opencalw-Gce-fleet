use chrono::{DateTime, Utc, Datelike, TimeZone};

pub struct SovereignCalendar {
    pub now: DateTime<Utc>,
    pub epoch: DateTime<Utc>,
}

impl SovereignCalendar {
    pub fn new() -> Self {
        Self {
            now: Utc::now(),
            epoch: DateTime::parse_from_rfc3339("2024-05-21T00:00:00Z").unwrap().with_timezone(&Utc),
        }
    }

    pub fn get_hebrew_year(&self) -> u32 {
        let year = self.now.year() as u32;
        let month = self.now.month();
        let mut h_year = year + 3760;
        if month >= 10 { h_year += 1; }
        h_year
    }

    pub fn get_status(&self) -> CalendarStatus {
        let diff = self.now.signed_duration_since(self.epoch);
        let sovereign_year = (diff.num_days() as f64 / 365.25).floor() as u32 + 1;
        let hebrew_year = self.get_hebrew_year();

        let shemitah_pos = hebrew_year % 7;
        let is_release_year = shemitah_pos == 0;
        let shemitah_year = if shemitah_pos == 0 { 7 } else { shemitah_pos };
        let years_to_release = if is_release_year { 0 } else { 7 - shemitah_pos };

        let jubilee_pos = hebrew_year % 50;
        let is_grand_reset = jubilee_pos == 0;
        let jubilee_year = if jubilee_pos == 0 { 50 } else { jubilee_pos };
        let years_to_reset = if is_grand_reset { 0 } else { 50 - jubilee_pos };

        CalendarStatus {
            gregorian_date: self.now.format("%Y-%m-%d").to_string(),
            hebrew_year,
            sovereign_year,
            shemitah: CycleStatus { current: shemitah_year, is_special: is_release_year, years_remaining: years_to_release },
            jubilee: CycleStatus { current: jubilee_year, is_special: is_grand_reset, years_remaining: years_to_reset },
        }
    }

    pub fn get_holidays(&self) -> Vec<Holiday> {
        let year = self.now.year();
        let mut events = Vec::new();

        // 1. Founding Day (Fixed)
        events.push(Holiday {
            name: "Founding Day".to_string(),
            date: format!("{}-05-21", year),
            type_: "Sovereign".to_string(),
            description: "The day the First Code was committed.".to_string(),
        });

        // 2. Rosh Hashanah (Approx - Hardcoded for 2024-2026 MVP)
        // In prod, use Hillel algorithm.
        let rosh_dates = [
            (2024, "10-02"), (2025, "09-22"), (2026, "09-11"), (2027, "10-01")
        ];

        for (y, d) in rosh_dates {
            if y == year {
                events.push(Holiday {
                    name: "Rosh Hashanah (New Year)".to_string(),
                    date: format!("{}-{}", y, d),
                    type_: "Biblical".to_string(),
                    description: "The head of the year. Cycle increments.".to_string(),
                });
            }
        }

        // 3. Jubilee Release (Yom Kippur of 50th Year)
        // Calculated dynamically based on Jubilee status
        let status = self.get_status();
        if status.jubilee.is_special {
             events.push(Holiday {
                name: "The Grand Release (Yom Kippur)".to_string(),
                date: format!("{}-10-12", year), // Approx
                type_: "Biblical/Legal".to_string(),
                description: "All debts cancelled. All slaves freed.".to_string(),
            });
        }

        // Sort by date
        events.sort_by(|a, b| a.date.cmp(&b.date));
        events
    }
}

pub struct CalendarStatus {
    pub gregorian_date: String,
    pub hebrew_year: u32,
    pub sovereign_year: u32,
    pub shemitah: CycleStatus,
    pub jubilee: CycleStatus,
}

pub struct CycleStatus {
    pub current: u32,
    pub is_special: bool,
    pub years_remaining: u32,
}

pub struct Holiday {
    pub name: String,
    pub date: String, // YYYY-MM-DD
    pub type_: String,
    pub description: String,
}
