"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

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
}

// Create a sample game board with some pieces for display
const createSampleBoard = () => {
  // Create an empty 10x20 board
  const board = Array(20)
    .fill(null)
    .map(() => Array(10).fill(null))

  // Add some sample pieces to make it look like a game in progress

  // Add an I piece at the bottom
  for (let i = 0; i < 4; i++) {
    board[19][i + 3] = "tetris-piece-i"
  }

  // Add an L piece
  board[18][0] = "tetris-piece-l"
  board[18][1] = "tetris-piece-l"
  board[18][2] = "tetris-piece-l"
  board[17][0] = "tetris-piece-l"

  // Add a T piece
  board[18][5] = "tetris-piece-t"
  board[18][6] = "tetris-piece-t"
  board[18][7] = "tetris-piece-t"
  board[17][6] = "tetris-piece-t"

  // Add an O piece
  board[16][8] = "tetris-piece-o"
  board[16][9] = "tetris-piece-o"
  board[17][8] = "tetris-piece-o"
  board[17][9] = "tetris-piece-o"

  // Add an S piece
  board[15][0] = "tetris-piece-s"
  board[15][1] = "tetris-piece-s"
  board[14][1] = "tetris-piece-s"
  board[14][2] = "tetris-piece-s"

  // Add a Z piece
  board[15][4] = "tetris-piece-z"
  board[15][5] = "tetris-piece-z"
  board[14][3] = "tetris-piece-z"
  board[14][4] = "tetris-piece-z"

  // Add a J piece
  board[12][6] = "tetris-piece-j"
  board[12][7] = "tetris-piece-j"
  board[12][8] = "tetris-piece-j"
  board[11][8] = "tetris-piece-j"

  // Add an active piece (T) that's falling
  board[5][4] = "tetris-piece-t"
  board[5][5] = "tetris-piece-t"
  board[5][6] = "tetris-piece-t"
  board[4][5] = "tetris-piece-t"

  return board
}

export default function TetrisGamePreview() {
  const [board, setBoard] = useState(() => createSampleBoard())
  const [nextPiece, setNextPiece] = useState<keyof typeof PIECES>("T")
  const [score, setScore] = useState(12500)
  const [level, setLevel] = useState(8)

  // Randomly change the next piece every few seconds for visual effect
  useEffect(() => {
    const interval = setInterval(() => {
      const pieces = Object.keys(PIECES) as Array<keyof typeof PIECES>
      const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
      setNextPiece(randomPiece)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="tetris-preview">
      <div className="tetris-game">
        <div className="tetris-board">
          <div className="tetris-grid">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className={`tetris-cell ${cell ? `filled ${cell}` : ""}`} />
              )),
            )}
          </div>
        </div>

        <div className="tetris-sidebar">
          <div className="tetris-panel">
            <div className="tetris-panel-title">NEXT</div>
            <div className="tetris-next-container">
              {PIECES[nextPiece].shape.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div key={`next-${rowIndex}-${colIndex}`} className={`${cell ? PIECES[nextPiece].className : ""}`} />
                )),
              )}
            </div>
          </div>

          <div className="tetris-panel">
            <div className="tetris-panel-title">SCORE</div>
            <div className="tetris-panel-content">{score}</div>
          </div>

          <div className="tetris-panel">
            <div className="tetris-panel-title">LEVEL</div>
            <div className="tetris-panel-content">{level}</div>
          </div>

          <Link href="/play" className="tetris-button tetris-button-primary text-center text-xs py-2 px-2 mt-auto">
            PLAY
          </Link>
        </div>
      </div>
    </div>
  )
}
