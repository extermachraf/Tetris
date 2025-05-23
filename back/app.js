const express = require("express");
const cors = require("cors");
const http = require("http");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const { Server } = require("socket.io");

const cookieParser = require("cookie-parser");
const socketManager = require("./src/socket/socketManager");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json()); // For parsing application/json
app.use(cookieParser());
const PORT = process.env.PORT || 3001;
const server = http.createServer(app); // Using HTTP server for Express
// Middleware and routes

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
    credentials: true,
  },
});

global.io = io;

socketManager(io);
// Remove the activeGames map and all game logic
// We'll rebuild this with better structure

// Add your authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
