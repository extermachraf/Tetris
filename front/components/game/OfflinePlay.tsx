"use client";

import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateGameState, setGameOver, resetGame } from "@/store/gameSlice";

// Game controls interface
interface GameControls {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotate: () => void;
  hardDrop: () => void;
}

// Custom hook for game socket communication
function useGameSocket() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");

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
    socket.on("gameState", (state) => {
      dispatch(updateGameState(state));
    });

    // Listen for game over event
    socket.on("gameOver", () => {
      console.log("Game Over!");
      dispatch(setGameOver(true));
    });

    // Cleanup listeners on unmount
    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("gameState");
      socket.off("gameOver");
    };
  }, [socket, dispatch]);

  // Restart game function
  const handleRestart = useCallback(() => {
    dispatch(setGameOver(false));
    dispatch(resetGame());
    socket?.emit("restartGame");
  }, [socket, dispatch]);

  // Game control functions
  const moveLeft = useCallback(() => socket?.emit("moveLeft"), [socket]);
  const moveRight = useCallback(() => socket?.emit("moveRight"), [socket]);
  const moveDown = useCallback(() => socket?.emit("moveDown"), [socket]);
  const rotate = useCallback(() => socket?.emit("rotate"), [socket]);
  const hardDrop = useCallback(() => socket?.emit("hardDrop"), [socket]);

  return {
    socket,
    connectionStatus,
    handleRestart,
    controls: { moveLeft, moveRight, moveDown, rotate, hardDrop },
  };
}

// Props for KeyboardControls component
interface KeyboardControlsProps {
  isGameOver: boolean;
  controls: GameControls;
}

// Component for keyboard controls
function KeyboardControls({ isGameOver, controls }: KeyboardControlsProps) {
  useEffect(() => {
    if (isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent arrow key scrolling
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowLeft":
          controls.moveLeft();
          break;
        case "ArrowRight":
          controls.moveRight();
          break;
        case "ArrowDown":
          controls.moveDown();
          break;
        case "ArrowUp":
          controls.rotate();
          break;
        case " ":
          controls.hardDrop();
          break; // Space bar for hard drop
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver, controls]);

  return null; // This component doesn't render anything
}

// Component for rendering the game board
function GameBoard({ handleRestart }: { handleRestart: () => void }) {
  const { board, currentPiece, isGameOver } = useSelector(
    (state: RootState) => state.game
  );

  // Get CSS color class based on cell value
  const getCellColor = (value: number): string => {
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

  // Render combined board (fixed blocks + current piece)
  const renderBoard = () => {
    if (!board || !currentPiece) {
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
    const displayBoard = board.map((row) => [...row]);

    // Add the current piece to the display
    if (currentPiece) {
      const { shape, position } = currentPiece;

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

  return (
    <div className="relative grid grid-cols-10 grid-rows-20 w-[340px] h-[600px]">
      {renderBoard()}

      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
          <h2 className="text-red-500 text-3xl mb-4 font-bold">GAME OVER</h2>
          <Button
            onClick={handleRestart}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
          >
            Restart
          </Button>
        </div>
      )}
    </div>
  );
}

// Main component
export default function OfflinePlay() {
  const { connectionStatus, controls, handleRestart } = useGameSocket();
  const { isGameOver } = useSelector((state: RootState) => state.game);
  const gameState = useSelector((state: RootState) => state.game);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Debug Info */}
      {/* <div className="bg-black text-white p-4">
        <p>Socket Status: {connectionStatus}</p>
        <p>Game State: {gameState.board ? "Active" : "Initializing..."}</p>
      </div> */}

      {/* Game Container */}
      <main className="flex flex-1 justify-center items-center gap-10">
        {/* Game Grid */}
        <GameBoard handleRestart={handleRestart} />

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

          <div className="mt-4">
            <p className="text-sm text-gray-400">Score:</p>
            <p className="text-xl text-cyan-400">{gameState.score}</p>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-400">Level:</p>
            <p className="text-xl text-cyan-400">{gameState.level}</p>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-400">Lines:</p>
            <p className="text-xl text-cyan-400">{gameState.linesCleared}</p>
          </div>

          <Button
            onClick={handleRestart}
            className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
          >
            Restart Game
          </Button>
        </aside>
      </main>

      {/* Keyboard controls */}
      <KeyboardControls isGameOver={isGameOver} controls={controls} />
    </div>
  );
}
