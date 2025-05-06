const express = require("express");
const http = require("http");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

// Middleware and routes
app.use(express.json()); // For parsing application/json

// Add your authentication routes
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 3001;
const server = http.createServer(app); // Using HTTP server for Express
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
