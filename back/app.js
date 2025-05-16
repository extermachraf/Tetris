const express = require("express");
const cors = require("cors");
const http = require("http");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const { Server } = require("socket.io");
const { Game } = require("./src/classes/Game");
// const { testHelper } = require("./src/utils/pieceUtils");
const cookieParser = require("cookie-parser");

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

const activeGames = new Map();

io.on("connection", (socket) => {
  // socket.on("generate array", () => {
  //   console.log("generate array recived from:", socket.id);
  //   const testBoard = testHelper(20, 10);
  //   socket.emit("generate array", testBoard);
  // });
  socket.on("startGame", () => {
    console.log("starting new game");
    const game = new Game("offline");
    game.addPlayer(socket.id);
    game.start();

    //store the game in active games map
    activeGames.set(socket.id, game);

    // Handle player movement
    socket.on("moveLeft", () => {
      console.log("Move left received from:", socket.id);
      const game = activeGames.get(socket.id);
      if (game) {
        game.moveLeft(socket.id);
      }
    });

    socket.on("moveRight", () => {
      console.log("Move right received from:", socket.id);
      const game = activeGames.get(socket.id);
      if (game) {
        game.moveRight(socket.id);
      }
    });

    socket.on("moveDown", () => {
      console.log("Move down received from:", socket.id);
      const game = activeGames.get(socket.id);
      if (game) {
        game.moveDown(socket.id);
      }
    });

    socket.on("rotate", () => {
      console.log("Rotate received from:", socket.id);
      const game = activeGames.get(socket.id);
      if (game) {
        game.rotate(socket.id);
      }
    });

    socket.on("hardDrop", () => {
      console.log("Hard drop received from:", socket.id);
      const game = activeGames.get(socket.id);
      if (game) {
        game.hardDrop(socket.id);
      }
    });

    socket.on("restartGame", () => {
      console.log("Restarting game for:", socket.id);

      // Get existing game and stop it if it exists
      const existingGame = activeGames.get(socket.id);
      if (existingGame) {
        existingGame.stop();
        activeGames.delete(socket.id);
      }

      // Create a new game instance
      const game = new Game("offline");
      game.addPlayer(socket.id);
      game.start();

      // Store in active games map
      activeGames.set(socket.id, game);
    });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    const game = activeGames.get(socket.id);
    if (game) {
      //game.stop //stoping game
      activeGames.delete(socket.id); //deleat game from active games map
    }
  });
});

// Add your authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
