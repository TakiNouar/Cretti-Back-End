# SendGrid Setup Guide for Beginners

## What is SendGrid?

SendGrid is an email delivery service that helps applications send emails reliably. Instead of using your personal Gmail or Outlook to send emails from your app, SendGrid provides:

- **Professional email delivery** - Emails won't go to spam
- **High deliverability rates** - Your emails actually reach recipients
- **Analytics** - Track if emails were opened, clicked, etc.
- **Scale** - Send thousands of emails without issues
- **API integration** - Easy to use in your code

Think of it as a postal service for your application's emails.

## Step-by-Step SendGrid Setup

### Step 1: Create SendGrid Account

1. Go to [sendgrid.com](https://sendgrid.com)
2. Click "Start for Free"
3. Fill out registration form
4. Verify your email address
5. Complete account setup

### Step 2: Verify Your Sender Identity

**Why needed:** SendGrid requires you to prove you own the email address you're sending from.

1. In SendGrid dashboard, go to **Settings → Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill out the form:
   - **From Name:** Your business name (e.g., "Cretti Team")
   - **From Email:** Your business email (e.g., "hello@cretti.com")
   - **Reply To:** Same as from email usually
   - **Company Address:** Your business address
4. Click **Create**
5. Check your email and click the verification link

### Step 3: Create API Key

**Why needed:** This is like a password that lets your code access SendGrid.

1. Go to **Settings → API Keys**
2. Click **Create API Key**
3. Choose **Restricted Access**
4. Name it (e.g., "Cretti Backend API")
5. Under **Mail Send**, select **Full Access**
6. Click **Create & View**

> ⚠️ **IMPORTANT:** Copy the API key immediately - you can't see it again!

### Step 4: Add API Key to Your Environment

In your `.env` file, add:

```env
SENDGRID_API_KEY=your_copied_api_key_here
MAIL_FROM=hello@cretti.com
MAIL_TO=owner@cretti.com
```

### Step 5: Install SendGrid Package

In your project terminal:

```bash
npm install @sendgrid/mail
```

### Step 6: Test Your Setup

ask chatgpt for a test in terminal if it didn't work ask him for the
powershell method

## Common Issues & Solutions

### Issue: "The from address does not match a verified Sender Identity"

**Solution:** Make sure `MAIL_FROM` in your `.env` matches exactly the email you verified in Step 2.

### Issue: Emails going to spam

**Solution:**

- Use your verified domain
- Add SPF/DKIM records (SendGrid provides these)
- Don't use spammy words in subject lines

### Issue: API key not working

**Solution:**

- Double-check the key was copied correctly
- Ensure no extra spaces in `.env` file
- Make sure API key has Mail Send permissions

## Understanding the Code in Your Project

In your `mailer.js` file:

```javascript
// This connects to SendGrid using your API key
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// This function sends email to the business owner
const sendOwnerEmail = async (formData) => {
  // Creates email content from form data
  const msg = {
    to: process.env.MAIL_TO, // Business owner's email
    from: process.env.MAIL_FROM, // Verified sender email
    subject: `New contact from ${name}`,
    text: "Email content here...",
  };

  // Actually sends the email
  await sgMail.send(msg);
};
```

## Free Tier Limits

- 100 emails/day for free
- Perfect for testing and small projects
- Upgrade when you need more

---

That's it! Your contact form will now send professional emails through SendGrid instead of potentially unreliable methods.
