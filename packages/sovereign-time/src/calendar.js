// The Sovereign Calendar (v2.0 - Dual Stack)
// Tracks Shemitah/Jubilee AND Gregorian/Hebrew Dates.

const EPOCH = new Date("2024-05-21T00:00:00Z"); // The Founding

// Simplified Hebrew Calendar Logic (Approximation for 2024-2030 Era)
// In production, use a library like 'hebcal'
const HEBREW_EPOCH = new Date("2023-09-15T18:00:00Z"); // Rosh Hashanah 5784
const HEBREW_YEAR_BASE = 5784;

class SovereignCalendar {
  constructor() {
    this.now = new Date();
  }

  getHebrewYear(gregorianDate) {
    // Approx logic: Rosh Hashanah is usually in Sept/Oct.
    // If date is before Sept 15, it's prev year.
    // This is a rough approximation for the MVP CLI.
    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1; // 1-12

    // Hebrew year starts roughly in Sept (Month 9)
    // 2024 -> 5784 (until Sept) -> 5785
    let hYear = year + 3760;
    if (month >= 10) hYear++; // Post-Rosh Hashanah

    return hYear;
  }

  getStatus() {
    const diffTime = Math.abs(this.now - EPOCH);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Sovereign Year (1-based from Founding)
    const sovereignYear = Math.floor(diffDays / 365.25) + 1;

    // Hebrew Calendar
    const hebrewYear = this.getHebrewYear(this.now);

    // Shemitah (7-Year Cycle) - Based on Hebrew Year
    // 5782 was a Shemitah. 5789 is next.
    // Cycle: (Year % 7) == 0 -> Release Year?
    // Actually 5782 % 7 = 0. So yes.
    const shemitahPos = hebrewYear % 7;
    const isReleaseYear = shemitahPos === 0;
    const yearsToRelease = isReleaseYear ? 0 : (7 - shemitahPos);

    // Jubilee (50-Year Cycle)
    // Counts sets of 7.
    const jubileePos = hebrewYear % 50;
    const isGrandReset = jubileePos === 0;
    const yearsToReset = isGrandReset ? 0 : (50 - jubileePos);

    return {
      gregorian_date: this.now.toISOString().split('T')[0],
      hebrew_year: hebrewYear,
      sovereign_year: sovereignYear,
      shemitah: {
        current_year_in_cycle: shemitahPos === 0 ? 7 : shemitahPos,
        status: isReleaseYear ? "RELEASE YEAR (SHEMITAH)" : "Accumulation Phase",
        years_remaining: yearsToRelease
      },
      jubilee: {
        current_year_in_cycle: jubileePos === 0 ? 50 : jubileePos,
        status: isGrandReset ? "GRAND JUBILEE (YOVEL)" : "Standard Cycle",
        years_remaining: yearsToReset
      }
    };
  }
}

module.exports = SovereignCalendar;
