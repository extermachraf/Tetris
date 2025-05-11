// Define the tetromino shapes
const PIECES = [
  // I piece
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // J piece
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  // L piece
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  // O piece
  [
    [4, 4],
    [4, 4],
  ],
  // S piece
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  // T piece
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  // Z piece
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];

// Function to generate a random piece shape
function getRandomPieceShape() {
  return PIECES[Math.floor(Math.random() * PIECES.length)];
}

// Helper function to generate a test board
function testHelper(rows, cols) {
  // Create an empty board
  const board = Array(rows)
    .fill()
    .map(() => Array(cols).fill(0));

  // Add some test blocks at the bottom
  for (let i = 0; i < 3; i++) {
    const row = rows - 1 - i;
    for (let j = 0; j < 4; j++) {
      board[row][j] = ((i + j) % 7) + 1; // Different colors
    }
  }

  return board;
}

module.exports = {
  getRandomPieceShape,
  testHelper,
  PIECES,
};
