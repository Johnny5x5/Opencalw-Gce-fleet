use chrono::{DateTime, Utc, Datelike};

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
        // Approx: Hebrew year starts in Sept/Oct
        let year = self.now.year() as u32;
        let month = self.now.month();

        let mut h_year = year + 3760;
        if month >= 10 {
            h_year += 1;
        }
        h_year
    }

    pub fn get_status(&self) -> CalendarStatus {
        let diff = self.now.signed_duration_since(self.epoch);
        let sovereign_year = (diff.num_days() as f64 / 365.25).floor() as u32 + 1;

        let hebrew_year = self.get_hebrew_year();

        // Shemitah (7-Year Cycle) - Base 5782
        let shemitah_pos = hebrew_year % 7;
        let is_release_year = shemitah_pos == 0;
        let shemitah_year = if shemitah_pos == 0 { 7 } else { shemitah_pos };
        let years_to_release = if is_release_year { 0 } else { 7 - shemitah_pos };

        // Jubilee (50-Year Cycle)
        let jubilee_pos = hebrew_year % 50;
        let is_grand_reset = jubilee_pos == 0;
        let jubilee_year = if jubilee_pos == 0 { 50 } else { jubilee_pos };
        let years_to_reset = if is_grand_reset { 0 } else { 50 - jubilee_pos };

        CalendarStatus {
            gregorian_date: self.now.format("%Y-%m-%d").to_string(),
            hebrew_year,
            sovereign_year,
            shemitah: CycleStatus {
                current: shemitah_year,
                is_special: is_release_year,
                years_remaining: years_to_release,
            },
            jubilee: CycleStatus {
                current: jubilee_year,
                is_special: is_grand_reset,
                years_remaining: years_to_reset,
            },
        }
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
