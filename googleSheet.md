# Google Sheets Integration Guide

## What is Google Sheets API?

The Google Sheets API allows your application to automatically save form submissions directly to a Google Spreadsheet. This provides:

- **Automatic data collection** - Form submissions saved instantly
- **Easy data management** - View and organize data in familiar spreadsheet format
- **Real-time updates** - Data appears immediately in your sheet
- **No database required** - Use Google Sheets as your data storage
- **Collaboration** - Share access with team members

Perfect for contact forms, lead collection, and data gathering.

## Step-by-Step Google Sheets Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Create Project** or select existing project
3. Enter project name (e.g., "Cretti Backend")
4. Click **Create**

### Step 2: Enable Google Sheets API

1. In Google Cloud Console, go to **APIs & Services → Library**
2. Search for "Google Sheets API"
3. Click on **Google Sheets API**
4. Click **Enable**

### Step 3: Create Service Account

**Why needed:** Service accounts allow your application to access Google Sheets without user interaction.

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → Service Account**
3. Fill out the form:
   - **Service account name:** "Cretti Sheets Service"
   - **Service account ID:** Auto-generated
   - **Description:** "Service account for Google Sheets integration"
4. Click **Create and Continue**
5. Skip role assignment (click **Continue**)
6. Click **Done**

### Step 4: Generate Service Account Key

1. In **Credentials** page, find your service account
2. Click on the service account email
3. Go to **Keys** tab
4. Click **Add Key → Create New Key**
5. Select **JSON** format
6. Click **Create**

> ⚠️ **IMPORTANT:** Download and save the JSON file securely - you can't download it again!

### Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **Blank** to create new sheet
3. Rename it (e.g., "Cretti Contact Form")
4. Add headers in row 1:
   ```
   A1: Timestamp
   B1: Name
   C1: Email
   D1: Phone
   E1: Company
   F1: Referral
   G1: Services
   H1: Budget
   I1: Newsletter
   J1: Message
   ```

### Step 6: Share Sheet with Service Account

1. In your Google Sheet, click **Share**
2. Add the service account email (from the JSON file: `client_email`)
3. Set permission to **Editor**
4. Uncheck **Notify people**
5. Click **Share**

### Step 7: Get Sheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```

Copy the `SHEET_ID_HERE` part.

### Step 8: Setup Environment Variables

Add these to your `.env` file:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_sheet_id_here
```

> 💡 **Tip:** The private key should include the `\n` characters for line breaks.

### Step 9: Install Google APIs Package

In your project terminal:

```bash
npm install googleapis
```

### Step 10: Test Your Setup

Create a test file:

```javascript
// test-sheets.js
require('dotenv').config();
const { appendToSheet } = require('./lib/googleSheet');

const testData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '123-456-7890',
  company: 'Test Company',
  referral: 'Google',
  services: ['Web Development', 'SEO'],
  minBudget: 1000,
  maxBudget: 5000,
  newsletter: true,
  message: 'This is a test submission'
};

const testSheets = async () => {
  try {
    await appendToSheet(testData);
    console.log('Test data added to Google Sheets successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testSheets();
```

Run: `node test-sheets.js`

## Common Issues & Solutions

### Issue: "The caller does not have permission"
**Solution:**
- Make sure you shared the sheet with the service account email
- Check that the service account has Editor permissions
- Verify the sheet ID is correct

### Issue: "Invalid credentials"
**Solution:**
- Double-check the service account email in `.env`
- Ensure private key is properly formatted with `\n` characters
- Verify the JSON key file is not corrupted

### Issue: "Requested entity was not found"
**Solution:**
- Verify the `GOOGLE_SHEET_ID` is correct
- Make sure the sheet exists and is accessible
- Check that the range `Sheet1!A:J` matches your sheet name

### Issue: Private key formatting problems
**Solution:**
```env
# Correct format (with \n for line breaks):
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

## Understanding the Code

In your `googleSheet.js` file:

```javascript
// Creates authentication using service account credentials
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: privateKey,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Appends form data to the sheet
await sheets.spreadsheets.values.append({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: "Sheet1!A:J",
  valueInputOption: "USER_ENTERED",
  requestBody: { values },
});
```

## Data Structure

Each form submission creates a new row with:

| Column | Field | Example |
|--------|-------|---------|
| A | Timestamp | 2024-01-15T10:30:00.000Z |
| B | Name | John Doe |
| C | Email | john@example.com |
| D | Phone | +1-555-0123 |
| E | Company | Acme Corp |
| F | Referral | Google Search |
| G | Services | Web Development, SEO |
| H | Budget | £1000 - £5000 |
| I | Newsletter | Yes/No |
| J | Message | Project description... |

## Security Best Practices

- Keep the service account JSON file secure and never commit it to version control
- Use environment variables for all sensitive data
- Regularly rotate service account keys
- Limit sheet sharing to necessary team members only
- Monitor API usage in Google Cloud Console

---

Your contact form will now automatically save all submissions to Google Sheets for easy data management and analysis!