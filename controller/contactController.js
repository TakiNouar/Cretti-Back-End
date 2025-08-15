const { contactSchema, parseContact } = require("../lib/validate.js");
const { sendOwnerEmail, sendUserConfirmation } = require("../lib/mailer.js");
const { appendToSheet } = require("../lib/googleSheet.js");

const contact = async (req, res) => {
  try {
    // 1) Validate input
    const data = parseContact(req.body);

    // 2) Honeypot check
    if (data.honeypot && data.honeypot.trim() !== "") {
      // Pretend success (don’t reveal spam detection to bots)
      return res.status(200).json({ message: "Message sent." });
    }

    // 3) Perform actions (run sequentially; could also Promise.all)
    await sendOwnerEmail(data);
    await sendUserConfirmation(data);
    await appendToSheet(data);

    // 4) Respond
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact form error:", error);
    res
      .status(500)
      .json({ message: "Failed to send message. Please try again." });
  }
};

module.exports = contact;
