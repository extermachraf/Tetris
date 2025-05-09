const { Player } = require("./Player");
const { Piece } = require("./Piece");
const { getRandomPieceShape } = require("../utils/pieceUtils");

class Game {
  constructor(roomName) {
    this.roomName = roomName;
    this.players = [];
    this.isStarted = false;
    this.intervalId = null;
  }

  addPlayer(name) {
    const player = new Player(name);
    player.currentPiece = new Piece(getRandomPieceShape());
    this.players.push(player);
  }

  start() {
    this.isStarted = true;
  }

  update() {}

  stop() {}
}

module.exports = { Game };
