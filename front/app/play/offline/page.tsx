"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pause, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define Tetris piece shapes and their colors
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
const BLOCK_SIZE = 30;

export default function OfflinePlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [nextPiece, setNextPiece] = useState<keyof typeof PIECES>("T");
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLines(0);
    // In a real implementation, we would initialize the game board and start the game loop
  };

  // Pause/resume game
  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setGamePaused(false);
    setScore(0);
    setLevel(1);
    setLines(0);
  };

  // Simple animation to show a static Tetris board
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

      // Draw game paused overlay
      if (gamePaused) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "20px 'Press Start 2P', monospace";
        ctx.fillStyle = "#2dd4bf";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
      }

      // Draw game over overlay
      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "20px 'Press Start 2P', monospace";
        ctx.fillStyle = "#ef4444";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
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
      <main className="relative z-10 flex-1 flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          {!gameStarted ? (
            <div className="max-w-md mx-auto text-center bg-black/70 border border-gray-800 p-8">
              <h1 className="text-3xl font-bold text-cyan-400 pixel-text mb-6">
                CLASSIC TETRIS
              </h1>
              <p className="text-gray-300 mb-8">
                Stack blocks, clear lines, and aim for the highest score in this
                classic Tetris game.
              </p>
              <Button
                onClick={startGame}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text py-6 px-8"
              >
                START GAME
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              {/* Game Board */}
              <div className="lg:col-span-3 relative">
                <canvas
                  ref={canvasRef}
                  width={COLS * BLOCK_SIZE}
                  height={ROWS * BLOCK_SIZE}
                  className="border-2 border-gray-800 bg-black/80 mx-auto"
                ></canvas>

                {/* Game Controls */}
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    onClick={togglePause}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold pixel-text py-2"
                  >
                    <Pause size={16} className="mr-1" />
                    {gamePaused ? "RESUME" : "PAUSE"}
                  </Button>

                  <Button
                    onClick={resetGame}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold pixel-text py-2"
                  >
                    <RotateCw size={16} className="mr-1" />
                    RESTART
                  </Button>
                </div>
              </div>

              {/* Game Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Next Piece */}
                <div className="bg-black/70 border border-gray-800 p-4">
                  <h2 className="text-cyan-400 font-pixel text-sm mb-3">
                    NEXT PIECE
                  </h2>
                  <div className="bg-black/50 p-3 flex justify-center">
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
                            className={`w-6 h-6`}
                            style={{
                              backgroundColor: cell ? color : "transparent",
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="bg-black/70 border border-gray-800 p-4">
                  <h2 className="text-cyan-400 font-pixel text-sm mb-2">
                    SCORE
                  </h2>
                  <div className="text-2xl font-mono text-white">
                    {score.toLocaleString()}
                  </div>
                </div>

                {/* Level */}
                <div className="bg-black/70 border border-gray-800 p-4">
                  <h2 className="text-cyan-400 font-pixel text-sm mb-2">
                    LEVEL
                  </h2>
                  <div className="text-2xl font-mono text-white">{level}</div>
                </div>

                {/* Lines */}
                <div className="bg-black/70 border border-gray-800 p-4">
                  <h2 className="text-cyan-400 font-pixel text-sm mb-2">
                    LINES
                  </h2>
                  <div className="text-2xl font-mono text-white">{lines}</div>
                </div>

                {/* Controls */}
                <div className="bg-black/70 border border-gray-800 p-4">
                  <h2 className="text-cyan-400 font-pixel text-sm mb-3">
                    CONTROLS
                  </h2>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-300">←→ Keys</div>
                    <div className="text-gray-400">Move left/right</div>

                    <div className="text-gray-300">↑ Key</div>
                    <div className="text-gray-400">Rotate piece</div>

                    <div className="text-gray-300">↓ Key</div>
                    <div className="text-gray-400">Soft drop</div>

                    <div className="text-gray-300">Space</div>
                    <div className="text-gray-400">Hard drop</div>

                    <div className="text-gray-300">C Key</div>
                    <div className="text-gray-400">Hold piece</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-cyan-400 glow-text mb-4 md:mb-0 pixel-text text-sm">
              TETRIS © {new Date().getFullYear()}
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
