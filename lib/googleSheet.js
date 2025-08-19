const { google } = require("googleapis");

function getAuth() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n"
  );
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

// ✅ Ensures headers exist & styles them
async function ensureHeadersAndStyle(sheets, spreadsheetId) {
  const headerValues = [
    [
      "Timestamp",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Referral",
      "Services",
      "Budget",
      "Newsletter",
      "Message",
    ],
  ];

  // Write headers into row 1
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Sheet1!A1:J1",
    valueInputOption: "RAW",
    requestBody: { values: headerValues },
  });

  // Style headers + table
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        // Header styling
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.95, green: 0.95, blue: 0.95 },
                textFormat: { foregroundColor: { red: 0, green: 0, blue: 0 } }, // black text
                horizontalAlignment: "CENTER",
                verticalAlignment: "MIDDLE",
                borders: {
                  top: {
                    style: "SOLID_THICK",
                    color: { red: 0, green: 0, blue: 0 },
                  },
                  bottom: {
                    style: "SOLID_THICK",
                    color: { red: 0, green: 0, blue: 0 },
                  },
                  left: {
                    style: "SOLID_THICK",
                    color: { red: 0, green: 0, blue: 0 },
                  },
                  right: {
                    style: "SOLID_THICK",
                    color: { red: 0, green: 0, blue: 0 },
                  },
                },
              },
            },
            fields:
              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,borders)",
          },
        },
        // Table body styling
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.95, green: 0.95, blue: 0.95 },
                borders: {
                  top: {
                    style: "SOLID_THICK",
                    color: { red: 0, green: 0, blue: 0 },
                  },
                  bottom: {
                    style: "SOLID_THICK",
                    color: { red: 0, green: 0, blue: 0 },
                  },
                  left: {
                    style: "SOLID_THICK",
                    color: { red: 0, green: 0, blue: 0 },
                  },
                  right: {
                    style: "SOLID_THICK",
                    color: { red: 0, green: 0, blue: 0 },
                  },
                },
              },
            },
            fields: "userEnteredFormat(backgroundColor,borders)",
          },
        },
      ],
    },
  });
}

async function appendToSheet(formData) {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY ||
    !process.env.GOOGLE_SHEET_ID
  ) {
    throw new Error("Missing required Google Sheets environment variables");
  }

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Ensure headers & style exist
    await ensureHeadersAndStyle(sheets, spreadsheetId);

    // Format fields
    const budgetRange =
      formData.minBudget && formData.maxBudget
        ? `£${formData.minBudget} - £${formData.maxBudget}`
        : "Not specified";

    const servicesList =
      formData.services && formData.services.length > 0
        ? formData.services.join(", ")
        : "Not specified";

    const values = [
      [
        new Date().toISOString(),
        formData.name,
        formData.email,
        formData.phone || "",
        formData.company || "",
        formData.referral || "",
        servicesList,
        budgetRange,
        formData.newsletter ? "Yes" : "No",
        formData.message,
      ],
    ];

    // Append row
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:J",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    const updates = appendResponse.data.updates;
    const updatedRange = updates.updatedRange;
    const rowIndex = parseInt(updatedRange.match(/\d+$/)[0], 10) - 1;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            mergeCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 9,
                endColumnIndex: 13,
              },
              mergeType: "MERGE_COLUMNS",
            },
          },
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 9,
                endColumnIndex: 13,
              },
              cell: { userEnteredFormat: { wrapStrategy: "WRAP" } },
              fields: "userEnteredFormat.wrapStrategy",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Google Sheets API error:", error);
    throw new Error("Failed to append data to Google Sheets");
  }
}

module.exports = { appendToSheet };
