// The Sovereign Calendar (v1.0)
// Tracks the Shemitah (7-Year) and Jubilee (50-Year) cycles.

const EPOCH = new Date("2024-05-21T00:00:00Z"); // The Founding

class SovereignCalendar {
  constructor() {
    this.now = new Date();
  }

  getStatus() {
    const diffTime = Math.abs(this.now - EPOCH);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Sovereign Year (1-based)
    const sovereignYear = Math.floor(diffDays / 365.25) + 1;

    // Shemitah Cycle (1-7)
    const shemitahYear = ((sovereignYear - 1) % 7) + 1;
    const yearsToRelease = 7 - shemitahYear;

    // Jubilee Cycle (1-50)
    const jubileeYear = ((sovereignYear - 1) % 50) + 1;
    const yearsToGrandReset = 50 - jubileeYear;

    return {
      date: this.now.toISOString().split('T')[0],
      sovereign_year: sovereignYear,
      shemitah: {
        current: shemitahYear,
        is_release_year: shemitahYear === 7,
        years_remaining: yearsToRelease
      },
      jubilee: {
        current: jubileeYear,
        is_grand_reset: jubileeYear === 50,
        years_remaining: yearsToGrandReset
      }
    };
  }
}

module.exports = SovereignCalendar;
