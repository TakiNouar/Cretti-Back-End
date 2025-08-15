// cors-test.js
const express = require("express");
const cors = require("cors");

const app = express();

// Allow everything from your frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Test endpoint
app.post("/api/contact", (req, res) => {
  res.json({ message: "CORS is working!" });
});

// Start server
app.listen(5000, () => {
  console.log("CORS test server running on port 5000");
});
