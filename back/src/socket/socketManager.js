const { Socket } = require("socket.io");
const { Game } = require("../classes/Game");

/**
 *
 * @param {Socket} io
 */
const socketManager = (io) => {
  const activeGames = new Map();

  io.on("connection", (socket) => {
    console.log("client connected: ", socket.id);

    //handle room creation
    socket.on("creatRoom", (data) => {
      console.log("creating room...");
      const { roomName, playerName } = data;

      //errore handling
      if (!roomName || !playerName) {
        socket.emit("error", {
          message: "Room name and player name are required",
        });
        return;
      }
      if (activeGames.has(roomName)) {
        socket.emit("error", { message: "Room already exists" });
        return;
      }

      // Join the socket to the room
      socket.join(roomName);

      // Store player data in socket for easy access
      socket.data.roomName = roomName;
      socket.data.playerName = playerName;
      socket.data.isLeader = true;

      const game = new Game(roomName);
      game.isOnline = true;

      //add player to the game
      game.addPlayer(playerName);

      //store the game in active game map
      activeGames.set(roomName, game);

      socket.emit("roomCreated", {
        roomName,
        playerName,
        isLeader: true,
        players: [{ name: playerName, isLeader: true, isReady: false }],
      });

      console.log(`room created ${roomName} by ${playerName}`);
    });
    socket.on("disconnect", () => {
      handlePlayerLeave(socket);
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  /**
   *
   * @param {Socket} socket
   * @returns
   */
  const handlePlayerLeave = (socket) => {
    console.log("start clearing...");
    const { roomName, playerName, isLeader } = socket.data;
    if (!roomName || !playerName) return;

    socket.leave(roomName);
    if (activeGames.has(roomName)) {
      const game = activeGames.get(roomName);

      //remouve player from the game
      game.removePlayer(playerName);
      //if no player left deleat the game
      if (game.players.length === 0) {
        activeGames.delete(roomName);
        console.log(`Room deleated ${roomName} (no players left)`);
        return;
      }

      if (isLeader && game.players.length > 0) {
        const newLeader = game.players[0];

        const newLeaderSocket = Array.from(io.sockets.sockets.values()).find(
          (s) =>
            s.data.playerName === newLeader.name && s.data.roomName === roomName
        );

        if (newLeaderSocket) {
          newLeaderSocket.data.isLeader = true;
        }

        newLeaderSocket.emit("leaderUpdate", { isLeader: true });
      }

      io.to(roomName).emit("playerLeft", {
        playerName,
        newLeaderName: isLeader ? game.players[0]?.name : null,
      });
    }

    delete socket.data.roomName;
    delete socket.data.playerName;
    delete socket.data.isLeader;
  };
};

module.exports = socketManager;
