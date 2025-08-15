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

const appendToSheet = async (formData) => {
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

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:J", // Updated range for more columns
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });
  } catch (error) {
    console.error("Google Sheets API error:", error);
    throw new Error("Failed to append data to Google Sheets");
  }
};

module.exports = { appendToSheet };
