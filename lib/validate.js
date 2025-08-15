const { z } = require("zod");

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  referral: z.string().optional(),
  company: z.string().optional(),
  services: z.array(z.string()).optional(),
  minBudget: z.string().optional(),
  maxBudget: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  newsletter: z.boolean().optional(),
  honeypot: z.string().optional(),
});

const parseContact = (body) => {
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    const err = new Error("Validation failed");
    err.status = 400;
    err.publicMessage = "Invalid input";
    err.details = details;
    throw err;
  }
  return result.data;
};

module.exports = { contactSchema, parseContact };
