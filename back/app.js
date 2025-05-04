// app.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Middleware and routes

const connectedUsers = [];
let userNumber = 1;

app.get("/", (req, res) => {
  res.send("Hello from Express + Socket.io!");
});

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const username = `user${userNumber++}`;
  connectedUsers.push(username);

  io.emit("zab", connectedUsers);

  socket.on("chat message", (msg) => {
    console.log("Received:", msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
