require("dotenv").config();

// Load security and utility packages
const helmet = require("helmet"); // Adds security headers
const cors = require("cors"); // Handles cross-origin requests
const rateLimiter = require("express-rate-limit"); // Prevents request flooding
const morgan = require("morgan"); // Logs HTTP requests

// Set up Express app
const express = require("express");
const app = express();

// Import routes
const contactRoutes = require("./routes/contactRoutes");

// Import error handlers
const notFoundMiddleWare = require("./middleWare/notFound");
const errorHandlerMiddleware = require("./middleWare/errorHandler");

// Apply security middlewares
app.use(helmet());
app.use(express.json({ limit: "25kb" })); // Parse JSON with size limit

//app.use(cors());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN.replace(/\/$/, ""),
  })
);
app.use(morgan("tiny"));

// Apply rate limiting
app.set("trust proxy", 1); // Trust proxy (needed on some hosts)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP
  })
);

// Enable form data parsing
app.use(express.urlencoded({ extended: true }));

// Health check route (used for monitoring)
app.get("/health", (_req, res) => res.json({ ok: true }));

// Register routes
app.use("/api/contact", contactRoutes);

// Error handling (keep these last)
app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
