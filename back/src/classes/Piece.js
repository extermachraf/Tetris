class Piece {
  constructor(shape) {
    this.shape = shape;
    this.position = { x: 3, y: 0 };
  }

  rotate() {
    this.shape = this.shape[0].map((_, i) =>
      this.shape.map((row) => row[i]).reverse()
    );
  }
}

module.exports = { Piece };
