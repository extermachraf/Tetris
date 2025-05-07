"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define Tetris piece shapes and their colors (same as offline mode)
const PIECES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    className: "tetris-piece-i",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    className: "tetris-piece-j",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    className: "tetris-piece-l",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    className: "tetris-piece-o",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    className: "tetris-piece-s",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    className: "tetris-piece-t",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    className: "tetris-piece-z",
  },
};

// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 25;

export default function OnlineRoom() {
  const params = useParams();
  const roomId = params.id as string;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [nextPiece, setNextPiece] = useState<keyof typeof PIECES>("T");
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { user: string; message: string }[]
  >([
    { user: "System", message: "Welcome to room " + roomId },
    { user: "System", message: "Waiting for players to join..." },
    { user: "Player2", message: "Hi, I'm ready to play!" },
  ]);

  // Mock players
  const [players, setPlayers] = useState([
    { id: 1, name: "You", score: 0, isReady: true },
    { id: 2, name: "Player2", score: 0, isReady: true },
    { id: 3, name: "Player3", score: 0, isReady: false },
  ]);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLines(0);

    // Add system message
    setChatMessages((prev) => [
      ...prev,
      { user: "System", message: "Game started!" },
    ]);
  };

  // Send chat message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      setChatMessages((prev) => [
        ...prev,
        { user: "You", message: chatMessage },
      ]);
      setChatMessage("");
    }
  };

  // Simple animation to show a static Tetris board (similar to offline mode)
  useEffect(() => {
    if (!canvasRef.current || !gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create a sample board
    const board = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null));

    // Add some sample pieces to make it look like a game in progress
    for (let i = 0; i < 4; i++) {
      board[19][i + 3] = "tetris-piece-i";
    }

    board[18][0] = "tetris-piece-l";
    board[18][1] = "tetris-piece-l";
    board[18][2] = "tetris-piece-l";
    board[17][0] = "tetris-piece-l";

    board[18][5] = "tetris-piece-t";
    board[18][6] = "tetris-piece-t";
    board[18][7] = "tetris-piece-t";
    board[17][6] = "tetris-piece-t";

    board[16][8] = "tetris-piece-o";
    board[16][9] = "tetris-piece-o";
    board[17][8] = "tetris-piece-o";
    board[17][9] = "tetris-piece-o";

    board[15][0] = "tetris-piece-s";
    board[15][1] = "tetris-piece-s";
    board[14][1] = "tetris-piece-s";
    board[14][2] = "tetris-piece-s";

    board[15][4] = "tetris-piece-z";
    board[15][5] = "tetris-piece-z";
    board[14][3] = "tetris-piece-z";
    board[14][4] = "tetris-piece-z";

    board[12][6] = "tetris-piece-j";
    board[12][7] = "tetris-piece-j";
    board[12][8] = "tetris-piece-j";
    board[11][8] = "tetris-piece-j";

    // Active piece
    board[5][4] = "tetris-piece-t";
    board[5][5] = "tetris-piece-t";
    board[5][6] = "tetris-piece-t";
    board[4][5] = "tetris-piece-t";

    // Draw the board
    const drawBoard = () => {
      // Clear canvas
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1;

      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * BLOCK_SIZE, 0);
        ctx.lineTo(i * BLOCK_SIZE, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * BLOCK_SIZE);
        ctx.lineTo(canvas.width, i * BLOCK_SIZE);
        ctx.stroke();
      }

      // Draw blocks
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (board[row][col]) {
            const colorClass = board[row][col];
            let color = "#333";

            // Map class names to colors
            if (colorClass === "tetris-piece-i") color = "#06b6d4";
            if (colorClass === "tetris-piece-j") color = "#3b82f6";
            if (colorClass === "tetris-piece-l") color = "#f97316";
            if (colorClass === "tetris-piece-o") color = "#facc15";
            if (colorClass === "tetris-piece-s") color = "#4ade80";
            if (colorClass === "tetris-piece-t") color = "#c084fc";
            if (colorClass === "tetris-piece-z") color = "#ef4444";

            ctx.fillStyle = color;
            ctx.fillRect(
              col * BLOCK_SIZE,
              row * BLOCK_SIZE,
              BLOCK_SIZE,
              BLOCK_SIZE
            );

            // Add shadow/highlight for 3D effect
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fillRect(
              col * BLOCK_SIZE,
              row * BLOCK_SIZE,
              BLOCK_SIZE,
              BLOCK_SIZE / 5
            );

            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(
              col * BLOCK_SIZE,
              row * BLOCK_SIZE + BLOCK_SIZE / 5,
              BLOCK_SIZE,
              BLOCK_SIZE - BLOCK_SIZE / 5
            );
          }
        }
      }
    };

    // Draw the board initially
    drawBoard();

    // Randomly change the next piece every few seconds for visual effect
    const interval = setInterval(() => {
      const pieces = Object.keys(PIECES) as Array<keyof typeof PIECES>;
      const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
      setNextPiece(randomPiece);

      // Increment score for demo purposes
      if (!gamePaused && !gameOver) {
        setScore((prev) => prev + 100);

        // Update player scores
        setPlayers((prev) => {
          const newPlayers = [...prev];
          newPlayers[0].score += 100;
          if (Math.random() > 0.7) {
            newPlayers[1].score += Math.floor(Math.random() * 200);
          }
          return newPlayers;
        });

        // Increase level every 1000 points
        if (Math.floor((score + 100) / 1000) > Math.floor(score / 1000)) {
          setLevel((prev) => prev + 1);
        }

        // Increase lines cleared
        if (Math.random() > 0.7) {
          setLines((prev) => prev + 1);
        }
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [gameStarted, gamePaused, gameOver, score]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 grid-bg"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/play"
              className="text-cyan-400 hover:text-cyan-300 flex items-center mr-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span className="text-sm">Back</span>
            </Link>
            <h1 className="text-xl font-bold text-cyan-400 tracking-wider glow-text pixel-text">
              ROOM: {roomId}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowChat(!showChat)}
              variant="outline"
              className="border-cyan-800 text-cyan-400 hover:bg-cyan-950"
            >
              <MessageSquare size={18} className="mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 py-6">
        <div className="container mx-auto px-4">
          {!gameStarted ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-black/70 border border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-bold text-cyan-400 pixel-text mb-4">
                  WAITING FOR PLAYERS
                </h2>
                <p className="text-gray-300 mb-6">
                  Share this room code with your friends:{" "}
                  <span className="text-cyan-400 font-mono">{roomId}</span>
                </p>

                <div className="space-y-4">
                  <h3 className="text-cyan-400 font-pixel text-sm">PLAYERS</h3>
                  <div className="space-y-2">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between bg-black/50 p-3 border border-gray-800"
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span>{player.name}</span>
                        </div>
                        <div
                          className={`text-xs ${
                            player.isReady
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {player.isReady ? "Ready" : "Not Ready"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={startGame}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text py-6 px-8"
                    disabled={players.some((p) => !p.isReady)}
                  >
                    START GAME
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Main Game Area */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Your Game */}
                <div className="md:col-span-2">
                  <div className="bg-black/70 border border-gray-800 p-3 mb-2">
                    <h3 className="text-cyan-400 font-pixel text-xs">YOU</h3>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={COLS * BLOCK_SIZE}
                    height={ROWS * BLOCK_SIZE}
                    className="border-2 border-gray-800 bg-black/80 mx-auto"
                  ></canvas>
                </div>

                {/* Opponent Games */}
                <div className="md:col-span-1 space-y-4">
                  {players.slice(1).map((player) => (
                    <div key={player.id} className="space-y-2">
                      <div className="bg-black/70 border border-gray-800 p-2">
                        <h3 className="text-cyan-400 font-pixel text-xs">
                          {player.name}
                        </h3>
                      </div>
                      <div className="border-2 border-gray-800 bg-black/80 aspect-[1/2] relative">
                        {/* Mini opponent board - simplified version */}
                        <div className="absolute inset-0 grid grid-cols-5 grid-rows-10 gap-px">
                          {Array(50)
                            .fill(0)
                            .map((_, i) => (
                              <div
                                key={i}
                                className={`${
                                  Math.random() > 0.8
                                    ? [
                                        "bg-cyan-500",
                                        "bg-purple-500",
                                        "bg-yellow-500",
                                        "bg-red-500",
                                      ][Math.floor(Math.random() * 4)]
                                    : "bg-gray-900"
                                }`}
                              ></div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Info and Chat */}
              <div className="lg:col-span-4 space-y-4">
                {/* Game Info */}
                <div className="bg-black/70 border border-gray-800 p-4">
                  <h2 className="text-cyan-400 font-pixel text-sm mb-4">
                    GAME INFO
                  </h2>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-gray-400 text-xs">SCORE</div>
                      <div className="text-xl font-mono text-white">
                        {score}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">LEVEL</div>
                      <div className="text-xl font-mono text-white">
                        {level}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">LINES</div>
                      <div className="text-xl font-mono text-white">
                        {lines}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-gray-400 text-xs mb-2">NEXT PIECE</div>
                    <div className="bg-black/50 p-2 flex justify-center">
                      <div
                        className="grid gap-1"
                        style={{
                          gridTemplateRows: `repeat(${PIECES[nextPiece].shape.length}, 1fr)`,
                          gridTemplateColumns: `repeat(${PIECES[nextPiece].shape[0].length}, 1fr)`,
                        }}
                      >
                        {PIECES[nextPiece].shape.flat().map((cell, i) => {
                          let color = "#333";
                          if (cell) {
                            if (nextPiece === "I") color = "#06b6d4";
                            if (nextPiece === "J") color = "#3b82f6";
                            if (nextPiece === "L") color = "#f97316";
                            if (nextPiece === "O") color = "#facc15";
                            if (nextPiece === "S") color = "#4ade80";
                            if (nextPiece === "T") color = "#c084fc";
                            if (nextPiece === "Z") color = "#ef4444";
                          }
                          return (
                            <div
                              key={i}
                              className={`w-5 h-5`}
                              style={{
                                backgroundColor: cell ? color : "transparent",
                              }}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-xs mb-2">
                      LEADERBOARD
                    </div>
                    <div className="space-y-2">
                      {players
                        .sort((a, b) => b.score - a.score)
                        .map((player, index) => (
                          <div
                            key={player.id}
                            className="flex justify-between items-center bg-black/50 p-2 border border-gray-800"
                          >
                            <div className="flex items-center">
                              <div className="w-5 text-center text-xs text-gray-400 mr-2">
                                {index + 1}
                              </div>
                              <div
                                className={
                                  player.name === "You"
                                    ? "text-cyan-400"
                                    : "text-white"
                                }
                              >
                                {player.name}
                              </div>
                            </div>
                            <div className="font-mono">{player.score}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Chat Panel */}
                <div
                  className={`fixed inset-y-0 right-0 w-80 bg-black/90 border-l border-gray-800 transform transition-transform duration-300 ease-in-out z-20 ${
                    showChat ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <div className="flex items-center">
                      <MessageSquare size={18} className="text-cyan-400 mr-2" />
                      <h3 className="text-cyan-400 font-pixel text-sm">CHAT</h3>
                    </div>
                    <button
                      onClick={() => setShowChat(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col h-[calc(100%-8rem)]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`${
                            msg.user === "You" ? "text-right" : ""
                          }`}
                        >
                          <div
                            className={`inline-block max-w-[80%] px-3 py-2 rounded ${
                              msg.user === "System"
                                ? "bg-gray-800 text-gray-300"
                                : msg.user === "You"
                                ? "bg-cyan-900 text-white"
                                : "bg-gray-700 text-white"
                            }`}
                          >
                            {msg.user !== "You" && (
                              <div className="text-xs text-gray-400 mb-1">
                                {msg.user}
                              </div>
                            )}
                            <div>{msg.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-gray-800">
                      <form onSubmit={sendMessage} className="flex">
                        <Input
                          type="text"
                          placeholder="Type a message..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          className="bg-gray-900 border-gray-700 focus-visible:ring-cyan-500"
                        />
                        <Button
                          type="submit"
                          className="ml-2 bg-cyan-500 hover:bg-cyan-400 text-black"
                        >
                          Send
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-cyan-400 glow-text mb-4 md:mb-0 pixel-text text-xs">
              TETRIS © {new Date().getFullYear()}
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
