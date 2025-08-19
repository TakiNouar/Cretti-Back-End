const Brevo = require("@getbrevo/brevo");
const client = new Brevo.TransactionalEmailsApi();
client.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendOwnerEmail = async (formData) => {
  const {
    name,
    email,
    phone,
    referral,
    company,
    services,
    minBudget,
    maxBudget,
    message,
    newsletter,
  } = formData;

  const budgetRange =
    minBudget && maxBudget ? `£${minBudget} - £${maxBudget}` : "Not specified";
  const servicesList =
    services && services.length > 0 ? services.join(", ") : "Not specified";

  const textContent = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "N/A"}`,
    `Company: ${company || "N/A"}`,
    `How they heard about us: ${referral || "N/A"}`,
    `Services interested in: ${servicesList}`,
    `Budget range: ${budgetRange || "Not specified"}`,
    `Newsletter subscription: ${newsletter ? "Yes" : "No"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const htmlContent = `
    <h3>New contact from ${name}</h3>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone || "N/A"}</p>
    <p><b>Company:</b> ${company || "N/A"}</p>
    <p><b>Referral:</b> ${referral || "N/A"}</p>
    <p><b>Services interested in:</b> ${servicesList}</p>
    <p><b>Budget range:</b> ${budgetRange}</p>
    <p><b>Newsletter:</b> ${newsletter ? "Yes" : "No"}</p>
    <p><b>Message:</b><br/>${message || "No message provided"}</p>
  `;

  const msg = {
    sender: { email: process.env.MAIL_FROM, name: process.env.NAME_FROM },
    to: [{ email: process.env.MAIL_TO }],
    subject: `New contact from ${name}`,
    textContent,
    htmlContent,
  };

  try {
    await client.sendTransacEmail(msg);
  } catch (error) {
    console.error("Failed to send owner email:", error.response?.data || error);
    throw new Error("Failed to send notification email");
  }
};

const sendUserConfirmation = async (formData) => {
  const { name, email } = formData;

  const textContent = `Hi ${name},\n\nThanks for reaching out! We received your message and will get back to you shortly.\n\n— Team`;

  const htmlContent = `
    <p>Hi ${name},</p>
    <p>Thanks for reaching out! We received your message and will get back to you shortly.</p>
    <p>— Team</p>
  `;

  const msg = {
    sender: { email: process.env.MAIL_FROM, name: process.env.NAME_FROM },
    to: [{ email }],
    subject: "We received your message",
    textContent,
    htmlContent,
  };

  try {
    await client.sendTransacEmail(msg);
  } catch (error) {
    console.error(
      "Failed to send confirmation email:",
      error.response?.data || error
    );
    throw new Error("Failed to send confirmation email");
  }
};

module.exports = { sendOwnerEmail, sendUserConfirmation };
