const { google } = require('googleapis');

/**
 * OpenClaw Skill: Google Workspace Connector
 *
 * Allows agents to create Docs, update Sheets, and manage Files.
 * Prerequisites: Domain-Wide Delegation or Direct Service Account Sharing.
 */

// Initialize APIs using Application Default Credentials (ADC)
const auth = new google.auth.GoogleAuth({
  scopes: [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
  ],
});

const docs = google.docs({ version: 'v1', auth });
const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });

module.exports = {
  name: 'google-workspace-connector',
  description: 'Create and edit Google Docs, Sheets, and Drive files.',

  actions: {
    // --- Google Docs ---
    create_doc: async ({ title, content }) => {
      // 1. Create the Doc
      const res = await docs.documents.create({
        requestBody: { title: title },
      });
      const documentId = res.data.documentId;

      // 2. Insert Content
      if (content) {
        await docs.documents.batchUpdate({
          documentId: documentId,
          requestBody: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: content,
                },
              },
            ],
          },
        });
      }
      return `Document created: https://docs.google.com/document/d/${documentId}`;
    },

    read_doc: async ({ document_id }) => {
      const res = await docs.documents.get({ documentId: document_id });
      // Very basic extraction of text
      const content = res.data.body.content
        .map(c => c.paragraph?.elements?.map(e => e.textRun?.content).join(''))
        .join('\n');
      return content;
    },

    // --- Google Sheets ---
    create_sheet: async ({ title }) => {
      const res = await sheets.spreadsheets.create({
        requestBody: { properties: { title: title } },
      });
      return `Spreadsheet created: https://docs.google.com/spreadsheets/d/${res.data.spreadsheetId}`;
    },

    append_rows: async ({ spreadsheet_id, range, values }) => {
      // values is array of arrays: [["A1", "B1"], ["A2", "B2"]]
      const res = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheet_id,
        range: range, // e.g., "Sheet1!A1"
        valueInputOption: "USER_ENTERED",
        requestBody: { values: values },
      });
      return `Appended ${res.data.updates.updatedRows} rows.`;
    },

    read_sheet: async ({ spreadsheet_id, range }) => {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheet_id,
        range: range,
      });
      return res.data.values;
    },

    // --- Google Drive ---
    list_files: async ({ query }) => {
      const res = await drive.files.list({
        q: query, // e.g., "mimeType = 'application/vnd.google-apps.folder'"
        fields: 'files(id, name, mimeType)',
      });
      return res.data.files;
    }
  }
};
