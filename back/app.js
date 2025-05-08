const express = require("express");
const cors = require("cors");
const http = require("http");
const authRoutes = require("./src/routes/authRoutes");
const { Server } = require("socket.io");
const { Socket } = require("dgram");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json()); // For parsing application/json
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

io.on("connection", (socket) => {
  console.log("User connected ", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

// Add your authentication routes
app.use("/api/auth", authRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
