const { google } = require('googleapis');

/**
 * OpenClaw Skill: Google Meet Scheduler
 *
 * Allows agents to schedule Google Calendar events with Meet links.
 * Prerequisites: Service Account with Domain-Wide Delegation to a user's calendar.
 */

// Initialize API
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

module.exports = {
  name: 'google-meet-scheduler',
  description: 'Schedule meetings on Google Calendar with Meet links.',

  actions: {
    /**
     * Schedule a meeting.
     * @param {string} summary - Meeting title.
     * @param {string} start_time - ISO string (e.g., "2024-01-01T10:00:00Z").
     * @param {Array<string>} attendees - List of email addresses.
     * @param {string} calendar_id - Target calendar (default: primary).
     */
    schedule_meeting: async ({ summary, start_time, attendees, calendar_id = 'primary' }) => {
      // Calculate end time (default 1 hour)
      const start = new Date(start_time);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const event = {
        summary: summary,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        attendees: attendees ? attendees.map(email => ({ email })) : [],
        conferenceData: {
          createRequest: {
            requestId: "meet-" + Date.now(), // Unique string
            conferenceSolutionKey: { type: "hangoutsMeet" }
          }
        }
      };

      const res = await calendar.events.insert({
        calendarId: calendar_id,
        resource: event,
        conferenceDataVersion: 1, // Required to create Meet link
      });

      return `Meeting scheduled: ${res.data.htmlLink}\nMeet Link: ${res.data.conferenceData?.entryPoints?.[0]?.uri || 'No Link'}`;
    }
  }
};
