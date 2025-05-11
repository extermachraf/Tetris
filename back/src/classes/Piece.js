class Piece {
  constructor(shape) {
    // Default to a simple piece if none provided
    if (!shape) {
      console.warn("Warning: Received undefined shape, using default");
      shape = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.shape = shape;
    this.position = {
      x: Math.floor(5 - shape[0].length / 2), // Center horizontally
      y: 0, // Start at the top
    };
  }

  rotate() {
    // Rotate the piece 90 degrees clockwise
    const rotatedShape = [];
    for (let col = 0; col < this.shape[0].length; col++) {
      const newRow = [];
      for (let row = this.shape.length - 1; row >= 0; row--) {
        newRow.push(this.shape[row][col]);
      }
      rotatedShape.push(newRow);
    }
    this.shape = rotatedShape;
  }

  // Helper methods for movement
  moveLeft() {
    this.position.x--;
  }

  moveRight() {
    this.position.x++;
  }

  moveDown() {
    this.position.y++;
  }
}

module.exports = { Piece };
