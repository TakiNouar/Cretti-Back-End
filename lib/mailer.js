
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


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


  const msg = {
    to: process.env.MAIL_TO,
    from: process.env.MAIL_FROM,
    subject: `New contact from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "N/A"}`,
      `Company: ${company || "N/A"}`,
      `How they heard about us: ${referral || "N/A"}`,
      `Services interested in: ${servicesList}`,
      `Budget range: ${budgetRange}`,
      `Newsletter subscription: ${newsletter ? "Yes" : "No"}`,
      "",
      "Message:",
      message,
    ].join("\n"),
  };

  try {
    await sgMail.send(msg);

  } catch (error) {
    console.error("Failed to send owner email:", error);
    throw new Error("Failed to send notification email");
  }
};


const sendUserConfirmation = async (formData) => {
  const { name, email } = formData;

  const msg = {
    to: email,
    from: process.env.MAIL_FROM,
    subject: "We received your message",
    text: `Hi ${name},\n\nThanks for reaching out! We received your message and will get back to you shortly.\n\n— Team`,
  };

  try {
    await sgMail.send(msg);

  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
};

module.exports = { sendOwnerEmail, sendUserConfirmation };
