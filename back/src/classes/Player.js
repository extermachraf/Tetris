class Player {
  constructor(name, socket = null) {
    this.name = name;
    this.socket = socket;
    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.isAlive = true;
  }

  createEmptyBoard() {
    return Array.from({ length: 20 }, () => Array(10).fill(0));
  }

  reset() {
    this.board = this.createEmptyBoard();
    this.isAlive = true;
    this.currentPiece = null;
  }
}

module.exports = { Player };
