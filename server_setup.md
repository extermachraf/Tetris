# Custom Server Setup for Socket.io Integration - Step by Step Guide

This guide will walk you through the process of integrating Socket.io into your Next.js and Express application for the Red Tetris project. Each step is explained in detail to help you understand the overall approach.

## Table of Contents

1. [Understanding the Architecture](#understanding-the-architecture)
2. [Setting Up the Express Backend](#setting-up-the-express-backend)
3. [Implementing Socket.io on the Server](#implementing-socketio-on-the-server)
4. [Creating the Next.js Client Interface](#creating-the-nextjs-client-interface)
5. [Testing the Socket.io Connection](#testing-the-socketio-connection)
6. [Best Practices and Common Pitfalls](#best-practices-and-common-pitfalls)

## Understanding the Architecture

Before we start implementing, it's important to understand the architecture of our application:

```
┌─────────────────┐           ┌─────────────────┐
│                 │           │                 │
│  Next.js Client │◀─────────▶│  Express Server │
│  (front/)       │   HTTP &  │  (back/)        │
│                 │  WebSocket│                 │
└─────────────────┘           └─────────────────┘
```

- **Client (front/)**: A Next.js application that handles the UI and game rendering
- **Server (back/)**: An Express application that manages game logic and player connections
- **Communication**: Uses both HTTP (for initial requests) and WebSocket (via Socket.io) for real-time bidirectional communication

## Setting Up the Express Backend

### Step 1: Install Socket.io on the Server

First, we need to add Socket.io to our Express backend:

```bash
cd back/
npm install socket.io
```

### Step 2: Create a Socket.io Server Instance

We need to modify the Express server to include Socket.io. In your Express application, locate the server initialization (typically in `bin/www`):

```javascript
// back/bin/www (simplified example)
const app = require("../app");
const http = require("http");

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Listen on port
const port = process.env.PORT || "3001";
server.listen(port);
console.log(`Server listening on port ${port}`);

// Export io for use in other files
module.exports = { io };
```

### Step 3: Create a Socket.io Manager Module

Create a dedicated module to manage Socket.io connections and event handlers. This separation of concerns keeps your code organized:

```javascript
// back/socket/socketManager.js
const socketManager = (io) => {
  // Store active games and players
  const games = new Map();

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle joining a game room
    socket.on("joinRoom", (data) => {
      const { roomName, playerName } = data;

      if (!roomName || !playerName) {
        socket.emit("error", {
          message: "Room name and player name are required",
        });
        return;
      }

      // Join the room
      socket.join(roomName);

      // Store player data
      socket.data.roomName = roomName;
      socket.data.playerName = playerName;

      // Create game room if it doesn't exist
      if (!games.has(roomName)) {
        games.set(roomName, {
          players: new Map(),
          leader: playerName,
        });
      }

      const game = games.get(roomName);
      const isLeader = game.leader === playerName;

      // Add player to the game
      game.players.set(playerName, {
        socketId: socket.id,
        isLeader,
      });

      // Notify room of new player
      io.to(roomName).emit("playerJoined", {
        playerName,
        isLeader,
        players: Array.from(game.players.keys()),
      });

      console.log(`Player ${playerName} joined room ${roomName}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      handlePlayerLeave(socket);
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Handle manual leave
    socket.on("leaveRoom", () => {
      handlePlayerLeave(socket);
    });

    // More game-specific event handlers will go here
  });

  // Helper function to handle player leaving
  const handlePlayerLeave = (socket) => {
    const { roomName, playerName } = socket.data;

    if (!roomName || !playerName) {
      return;
    }

    // Leave the room
    socket.leave(roomName);

    // Clean up player data if game exists
    if (games.has(roomName)) {
      const game = games.get(roomName);

      // Remove player from the game
      game.players.delete(playerName);

      // If no players left, remove the game
      if (game.players.size === 0) {
        games.delete(roomName);
        return;
      }

      // If leader left, assign a new leader
      let newLeader = null;
      if (game.leader === playerName) {
        // Get the first player as new leader
        newLeader = Array.from(game.players.keys())[0];
        game.leader = newLeader;

        // Update player data
        const playerData = game.players.get(newLeader);
        playerData.isLeader = true;
      }

      // Notify room that player left
      socket.to(roomName).emit("playerLeft", {
        playerName,
        newLeader,
        players: Array.from(game.players.keys()),
      });

      // If there's a new leader, notify them
      if (newLeader) {
        const newLeaderSocketId = game.players.get(newLeader).socketId;
        io.to(newLeaderSocketId).emit("roomLeader", { isLeader: true });
      }
    }

    // Clean up socket data
    delete socket.data.roomName;
    delete socket.data.playerName;
  };
};

module.exports = socketManager;
```

### Step 4: Integrate the Socket Manager with Your Server

Now, import and use your socket manager in the server file:

```javascript
// back/bin/www (updated)
// ...existing server setup code...

const socketManager = require("../socket/socketManager");
socketManager(io);

// ...existing code continues...
```

## Implementing Socket.io on the Server

### Step 5: Create Game Logic Module

Create a module to handle the Tetris game logic:

```javascript
// back/game/tetrisGame.js
class TetrisGame {
  constructor(roomName) {
    this.roomName = roomName;
    this.players = new Map();
    this.inProgress = false;
    this.pieceSequence = [];

    // More game initialization...
  }

  // Game methods will go here
  addPlayer(playerName, socketId) {
    // Implementation
  }

  startGame() {
    // Implementation
  }

  // More game methods...
}

module.exports = TetrisGame;
```

### Step 6: Implement Game Events in Socket Manager

Expand your socket manager to include game-specific events:

```javascript
// back/socket/socketManager.js (expanded)
const TetrisGame = require("../game/tetrisGame");

const socketManager = (io) => {
  // ...existing connection code...

  io.on("connection", (socket) => {
    // ...existing event handlers...

    // Start game event
    socket.on("startGame", () => {
      const { roomName, playerName } = socket.data;

      if (!roomName || !playerName) {
        socket.emit("error", { message: "Not in a room" });
        return;
      }

      const game = games.get(roomName);

      // Only leader can start the game
      if (game.leader !== playerName) {
        socket.emit("error", {
          message: "Only room leader can start the game",
        });
        return;
      }

      // Create game instance if it doesn't exist
      if (!game.instance) {
        game.instance = new TetrisGame(roomName);

        // Add all players to the game
        for (const [name, data] of game.players.entries()) {
          game.instance.addPlayer(name, data.socketId);
        }
      }

      // Start the game
      const gameState = game.instance.startGame();

      // Notify all players that game started
      io.to(roomName).emit("gameStarted", gameState);
    });

    // Game move events
    socket.on("movePiece", (data) => {
      // Implementation
    });

    socket.on("rotatePiece", () => {
      // Implementation
    });

    socket.on("hardDrop", () => {
      // Implementation
    });
  });

  // ...existing helper functions...
};
```

## Creating the Next.js Client Interface

### Step 7: Install Socket.io Client in Next.js

First, install the Socket.io client package in your Next.js application:

```bash
cd front/
npm install socket.io-client
```

### Step 8: Create Socket.io Client Utility

Create a utility file for Socket.io client connection:

```typescript
// front/app/utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (url: string): Socket => {
  if (!socket) {
    socket = io(url, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const closeSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

### Step 9: Create a React Hook for Socket.io

Create a custom React hook to use Socket.io in your components:

```typescript
// front/app/utils/useSocket.ts
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { initializeSocket, getSocket, closeSocket } from "./socket";

export const useSocket = (
  url: string
): {
  socket: Socket | null;
  isConnected: boolean;
} => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize or get existing socket
    const socket = initializeSocket(url);

    // Set up event listeners
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Set initial connected state
    setIsConnected(socket.connected);

    // Clean up on unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [url]);

  return {
    socket: getSocket(),
    isConnected,
  };
};
```

### Step 10: Create Basic Game Component

Create a basic component to test the Socket.io connection:

```tsx
// front/app/components/GameRoom.tsx
"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../utils/useSocket";

interface GameRoomProps {
  roomName: string;
  playerName: string;
}

export default function GameRoom({ roomName, playerName }: GameRoomProps) {
  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
  const { socket, isConnected } = useSocket(socketUrl);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join the room
    socket.emit("joinRoom", { roomName, playerName });

    // Set up event listeners
    const onPlayerJoined = (data: { players: string[] }) => {
      setPlayers(data.players);
    };

    const onPlayerLeft = (data: { players: string[] }) => {
      setPlayers(data.players);
    };

    socket.on("playerJoined", onPlayerJoined);
    socket.on("playerLeft", onPlayerLeft);

    // Clean up on unmount
    return () => {
      socket.off("playerJoined", onPlayerJoined);
      socket.off("playerLeft", onPlayerLeft);
      socket.emit("leaveRoom");
    };
  }, [socket, isConnected, roomName, playerName]);

  return (
    <div>
      <h2>Game Room: {roomName}</h2>
      <p>Connection status: {isConnected ? "Connected" : "Disconnected"}</p>
      <h3>Players:</h3>
      <ul>
        {players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Testing the Socket.io Connection

### Step 11: Create a Test Page

Create a test page to use your game room component:

```tsx
// front/app/test/page.tsx
"use client";

import { useState } from "react";
import GameRoom from "../components/GameRoom";

export default function TestPage() {
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = () => {
    if (roomName && playerName) {
      setIsJoined(true);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Socket.io Test</h1>

      {!isJoined ? (
        <div className="space-y-4">
          <div>
            <label className="block">Room Name:</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div>
            <label className="block">Player Name:</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Join Room
          </button>
        </div>
      ) : (
        <GameRoom roomName={roomName} playerName={playerName} />
      )}
    </div>
  );
}
```

### Step 12: Start Both Servers and Test

1. Start the Express server:

```bash
cd back/
npm start
```

2. Start the Next.js development server:

```bash
cd front/
npm run dev
```

3. Open your browser to http://localhost:3000/test to test the Socket.io connection.

## Best Practices and Common Pitfalls

### Best Practices

1. **Error Handling**: Always handle socket errors and disconnections gracefully
2. **Clean Up Event Listeners**: Remove event listeners when components unmount to prevent memory leaks
3. **Use Room Feature**: Leverage Socket.io rooms for efficient broadcasting
4. **Separate Game Logic**: Keep game logic separate from socket handling
5. **Type Safety**: Use TypeScript interfaces for event payload types

### Common Pitfalls

1. **CORS Issues**: Ensure your CORS settings are correct on the server
2. **Event Listener Duplication**: Be careful not to register the same event listener multiple times
3. **Missing Error Handling**: Always handle potential errors in socket communication
4. **Large Payloads**: Keep transmitted data minimal for performance
5. **Not Handling Reconnections**: Implement proper reconnection logic for better user experience

## Conclusion

This guide walked you through setting up Socket.io for real-time communication between a Next.js client and Express server. You can now expand this foundation to implement the complete Tetris game logic with multiplayer capabilities.

Remember that this setup is modular and can be enhanced incrementally. Start with basic functionality and add more advanced features as you go.

---

This approach allows you to:

1. Understand each piece of the architecture
2. Test connections early
3. Build game logic incrementally
4. Maintain separation of concerns
5. Scale your application as needed
