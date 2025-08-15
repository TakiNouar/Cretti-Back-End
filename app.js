require("dotenv").config();

// ============================================================================
// ENVIRONMENT CONFIGURATION (Line 1-2)
// Search for: "dotenv" or "config" to find environment variable setup
// ============================================================================
// amazonq-ignore-next-linerequire("dotenv").config();

// ============================================================================
// SECURITY & UTILITY IMPORTS (Lines 4-7)
// Search for: package names like "helmet", "cors", "rate-limit", "morgan"
// ============================================================================
// extra security packages
const helmet = require("helmet"); // Security headers middleware
const cors = require("cors"); // Cross-Origin Resource Sharing
const rateLimiter = require("express-rate-limit"); // Rate limiting middleware
const morgan = require("morgan"); // HTTP request logger

// ============================================================================
// EXPRESS APP SETUP (Lines 9-10)
// Search for: "express" or "app =" to find main app initialization
// ============================================================================
const express = require("express");
const app = express();

// ============================================================================
// ROUTE IMPORTS (Lines 12-13)
// Search for: "Routes" or "./routes/" to find route file imports
// ============================================================================
//routers
const contactRoutes = require("./routes/contactRoutes");

// ============================================================================
// ERROR HANDLING IMPORTS (Lines 15-17)
// Search for: "middleware", "error", "notFound" to find error handlers
// ============================================================================

//error handler
const notFoundMiddleWare = require("./middleWare/notFound");
const errorHandlerMiddleware = require("./middleWare/errorHandler");

// ============================================================================
// SECURITY MIDDLEWARE SETUP (Lines 19-26)
// Search for: "helmet", "json", "cors" to find security configurations
// ============================================================================
app.use(helmet()); // Apply security headers
app.use(express.json({ limit: "25kb" })); // Parse JSON requests (max 25kb)

app.use(
  cors({
    origin: process.env.CORS_ORIGIN.replace(/\/$/, ""),
  })
);

app.use(morgan("tiny")); // Log HTTP requests

// ============================================================================
// RATE LIMITING SETUP (Lines 28-35)
// Search for: "rate", "limit", "windowMs", "max" to find rate limiting config
// ============================================================================
// Basic global rate limit (tighten as needed)
app.set("trust proxy", 1); // Trust first proxy
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// ============================================================================
// BODY PARSING MIDDLEWARE (Line 37)
// Search for: "urlencoded" to find form data parsing setup
// ============================================================================
//middleware
app.use(express.urlencoded({ extended: true })); // Parse form data

// ============================================================================
// HEALTH CHECK ENDPOINT (Lines 39-42)
// Search for: "/health", "health check" to find monitoring endpoint
// ============================================================================

// Health - intentionally public for monitoring
//Health check endpoints are typically meant to be publicly accessible for monitoring systems, load balancers, and deployment tools to verify the service is running.

app.get("/health", (_req, res) => res.json({ ok: true }));

// ============================================================================
// API ROUTES REGISTRATION (Lines 44-45)
// Search for: "app.use", "/api/", route names to find API endpoint setup
// ============================================================================
//routes
app.use("/api/contact", contactRoutes); // Mount contact routes at /api/contact

// ============================================================================
// ERROR HANDLING MIDDLEWARE (Lines 47-49)
// Search for: "error", "notFound" to find error handling setup
// NOTE: These MUST be last - order matters in Express!
// ============================================================================
// error handling last
app.use(notFoundMiddleWare); // Handle 404 errors
app.use(errorHandlerMiddleware); // Handle all other errors

// ============================================================================
// SERVER STARTUP (Lines 51-54)
// Search for: "listen", "port", "PORT" to find server startup code
// ============================================================================
const port = Number(process.env.PORT) || 5000; // Get port from env or default to 5000
app.listen(port, () => {
  console.log(`server listening to ${port}...`);
});

// ============================================================================
// ERROR SAFETY NET (Lines 56-59)
// Search for: "unhandledRejection", "process.on" to find global error handling
// ============================================================================

// Safety: surface unhandled rejections
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
