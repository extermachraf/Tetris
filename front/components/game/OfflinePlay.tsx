"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketContext";

// Game state interface
interface GameState {
  board: number[][];
  currentPiece: {
    shape: number[][];
    position: {
      x: number;
      y: number;
    };
  };
}

export default function OfflinePlay() {
  const socket = useSocket();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");

  // Initialize socket connection and start the game
  useEffect(() => {
    if (!socket) {
      setConnectionStatus("No socket connection");
      return;
    }

    setConnectionStatus(`Connected: ${socket.id}`);

    // Start a new game
    console.log("Starting new game");
    socket.emit("startGame");

    // Listen for game state updates
    socket.on("gameState", (state: GameState) => {
      console.log("Received game state update");
      setGameState(state);
    });

    // Listen for game over event
    socket.on("gameOver", () => {
      console.log("Game Over!");
      setIsGameOver(true);
    });

    // Cleanup listeners on unmount
    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("gameState");
      socket.off("gameOver");
    };
  }, [socket]);

  // Handle keyboard controls
  useEffect(() => {
    if (!socket || isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent arrow key scrolling
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowLeft":
          console.log("Move left");
          socket.emit("moveLeft");
          break;
        case "ArrowRight":
          console.log("Move right");
          socket.emit("moveRight");
          break;
        case "ArrowDown":
          console.log("Move down");
          socket.emit("moveDown");
          break;
        case "ArrowUp":
          console.log("Rotate");
          socket.emit("rotate");
          break;
        case " ": // Space bar for hard drop
          console.log("Hard drop");
          socket.emit("hardDrop");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [socket, isGameOver]);

  // Restart game function
  const handleRestart = () => {
    setIsGameOver(false);
    socket?.emit("startGame");
  };

  // Render combined board (fixed blocks + current piece)
  const renderBoard = () => {
    if (!gameState) {
      return Array(200)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="border border-gray-800 w-full h-full bg-transparent"
          />
        ));
    }

    // Create a deep copy of the board
    const displayBoard = gameState.board.map((row) => [...row]);

    // Add the current piece to the display
    if (gameState.currentPiece) {
      const { shape, position } = gameState.currentPiece;

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col] !== 0) {
            const boardY = position.y + row;
            const boardX = position.x + col;

            // Only draw if within bounds
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              displayBoard[boardY][boardX] = shape[row][col];
            }
          }
        }
      }
    }

    // Flatten board for rendering
    return displayBoard
      .flat()
      .map((cell, i) => (
        <div
          key={i}
          className={`border border-gray-800 w-full h-full ${getCellColor(
            cell
          )}`}
        />
      ));
  };

  // Get CSS color class based on cell value
  const getCellColor = (value: number) => {
    if (value === 0) return "bg-transparent";

    const colors = [
      "bg-transparent",
      "bg-cyan-500", // I piece
      "bg-blue-500", // J piece
      "bg-orange-500", // L piece
      "bg-yellow-500", // O piece
      "bg-green-500", // S piece
      "bg-purple-500", // T piece
      "bg-red-500", // Z piece
    ];

    return colors[value] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Debug Info */}
      <div className="bg-black text-white p-4">
        <p>Socket Status: {connectionStatus}</p>
        <p>Game State: {gameState ? "Active" : "Initializing..."}</p>
      </div>

      {/* Game Container */}
      <main className="flex flex-1 justify-center items-center gap-10">
        {/* Game Grid */}
        <div className="relative grid grid-cols-10 grid-rows-20 w-[340px] h-[600px]">
          {renderBoard()}

          {/* Game Over Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
              <h2 className="text-red-500 text-3xl mb-4 font-bold">
                GAME OVER
              </h2>
              <Button
                onClick={handleRestart}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
              >
                Restart
              </Button>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <aside className="flex flex-col items-start gap-4 text-left">
          <div>
            <p className="text-sm text-gray-400">Controls:</p>
            <ul className="text-sm text-gray-200">
              <li>↑ Rotate</li>
              <li>← Move Left</li>
              <li>→ Move Right</li>
              <li>↓ Move Down</li>
              <li>Space Hard Drop</li>
            </ul>
          </div>

          <Button
            onClick={handleRestart}
            className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
          >
            Restart Game
          </Button>
        </aside>
      </main>
    </div>
  );
}
