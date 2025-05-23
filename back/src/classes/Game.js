const { Player } = require("./Player");
const { Piece } = require("./Piece");
const { getRandomPieceShape } = require("../utils/pieceUtils");

class Game {
  constructor(roomName) {
    this.roomName = roomName;
    this.players = [];
    this.isStarted = false;
    this.intervalId = null;
    this.isOnline = false;
    this.tickSpeed = 700; // 1s per tick
    this.isPaused = false;
  }

  removePlayer(name) {
    const playerIndex = this.players.findIndex(
      (player) => player.name === name
    );
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
      console.log(`Player ${name} removed from game ${this.roomName}`);
      return true;
    }
    return false;
  }

  addPlayer(name) {
    console.log(`adding player : ${name} to game`);
    const player = new Player(name);
    player.currentPiece = new Piece(getRandomPieceShape());
    this.players.push(player);
    return player;
  }

  start() {
    console.log("starting game...");
    if (!this.isStarted && this.players.length > 0) {
      this.isStarted = true;
      this.intervalId = setInterval(() => this.update(), this.tickSpeed);
    }
  }

  update() {
    console.log("Game update tick");
    // Process each player's game state
    this.players.forEach((player) => {
      if (!player.isAlive || !player.currentPiece) return;

      console.log("Processing player:", player.name);
      // Try to move the current piece down
      if (this.canMovePieceDown(player)) {
        console.log("Moving piece down");
        // Move the piece down
        player.currentPiece.position.y++;
      } else {
        console.log("Locking piece in place");
        // If the piece can't move down, lock it in place
        this.lockPiece(player);

        // Check for completed lines
        this.checkLines(player);

        // Generate a new piece
        player.currentPiece = new Piece(getRandomPieceShape());

        // Check if game is over (new piece can't be placed)
        if (!this.canMovePieceDown(player, true)) {
          console.log("Game over condition detected");
          player.isAlive = false;
          global.io.to(player.name).emit("gameOver");
          this.stop();
        }
      }

      // Emit the updated game state
      console.log("Emitting game state update to player:", player.name);
      this.emitGameState(player);
    });
  }

  // Check for completed lines and clear them
  checkLines(player) {
    let linesCleared = 0;

    // Check each row from bottom to top
    for (let row = 19; row >= 0; row--) {
      // Check if this row is completely filled (all cells non-zero)
      if (player.board[row].every((cell) => cell !== 0)) {
        console.log(`Line cleared at row ${row}`);
        linesCleared++;

        // Remove the completed line
        player.board.splice(row, 1);

        // Add a new empty line at the top
        player.board.unshift(Array(10).fill(0));

        // Since we removed a row, we need to check the same row again
        // (what was row+1 is now at position row)
        row++;
      }
    }

    if (linesCleared > 0) {
      console.log(`Player cleared ${linesCleared} lines`);

      // Track lines cleared (add this to Player class if desired)
      player.linesCleared = (player.linesCleared || 0) + linesCleared;
    }

    return linesCleared;
  }

  canMovePieceDown(player, checkInitialPosition = false) {
    // Add null check for player.currentPiece
    if (!player || !player.currentPiece) {
      return false;
    }

    return this.canMovePiece(player, 0, checkInitialPosition ? 0 : 1);
  }

  // Lock the piece into the board
  lockPiece(player) {
    // Add null check for player.currentPiece
    if (!player || !player.currentPiece) {
      console.warn("Cannot lock piece: player or piece is null");
      return;
    }

    const piece = player.currentPiece;
    const { shape } = piece;
    const { x, y } = piece.position;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const boardY = y + row;
          const boardX = x + col;

          // Only place on the board if it's within bounds
          if (boardY >= 0 && boardY < 20) {
            player.board[boardY][boardX] = shape[row][col];
          }
        }
      }
    }
  }

  emitGameState(player) {
    if (!player) {
      console.warn("Cannot emit game state: player is null");
      return;
    }

    if (global.io) {
      console.log("Sending game state via Socket.IO");
      global.io.to(player.name).emit("gameState", {
        board: player.board,
        currentPiece: player.currentPiece,
        linesCleared: player.linesCleared || 0,
      });
    } else {
      console.error("io is not defined!");
    }
  }

  stop() {
    console.log("Stopping game...");
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isStarted = false;
    this.isPaused = false;

    this.players.forEach((player) => {
      if (player && typeof player.reset === "function") {
        player.reset();
      }
    });
  }

  moveLeft(playerId) {
    const player = this.players.find((p) => p.name === playerId);
    if (!player || !player.isAlive || !player.currentPiece) return;

    // Check if we can move left
    if (this.canMovePiece(player, -1, 0)) {
      player.currentPiece.position.x--;
      this.emitGameState(player);
    }
  }

  moveRight(playerId) {
    const player = this.players.find((p) => p.name === playerId);
    if (!player || !player.isAlive || !player.currentPiece) return;

    // Check if we can move right
    if (this.canMovePiece(player, 1, 0)) {
      player.currentPiece.position.x++;
      this.emitGameState(player);
    }
  }

  moveDown(playerId) {
    const player = this.players.find((p) => p.name === playerId);
    if (!player || !player.isAlive || !player.currentPiece) return;

    // Check if we can move down
    if (this.canMovePieceDown(player)) {
      player.currentPiece.position.y++;
      this.emitGameState(player);
    }
  }

  rotate(playerId) {
    const player = this.players.find((p) => p.name === playerId);
    if (!player || !player.isAlive || !player.currentPiece) return;

    // Store the original shape for rollback if needed
    const originalShape = JSON.parse(JSON.stringify(player.currentPiece.shape));
    const originalPosition = { ...player.currentPiece.position };

    // Perform rotation
    player.currentPiece.rotate();

    // Check if the rotation is valid
    if (!this.isValidPosition(player)) {
      // Try wall kicks (check nearby positions)
      const kicks = [
        { x: -1, y: 0 }, // Try left
        { x: 1, y: 0 }, // Try right
        { x: 0, y: -1 }, // Try up
        { x: -2, y: 0 }, // Try 2 cells left
        { x: 2, y: 0 }, // Try 2 cells right
      ];

      let validKickFound = false;

      for (const kick of kicks) {
        player.currentPiece.position.x = originalPosition.x + kick.x;
        player.currentPiece.position.y = originalPosition.y + kick.y;

        if (this.isValidPosition(player)) {
          validKickFound = true;
          break;
        }
      }

      // If no valid position found, revert the rotation
      if (!validKickFound) {
        player.currentPiece.shape = originalShape;
        player.currentPiece.position = originalPosition;
      }
    }

    this.emitGameState(player);
  }

  hardDrop(playerId) {
    const player = this.players.find((p) => p.name === playerId);
    if (!player || !player.isAlive || !player.currentPiece) {
      console.warn(
        `Cannot hard drop: Player ${playerId} is not valid or has no piece`
      );
      return;
    }

    // Move down until we hit something
    while (this.canMovePieceDown(player)) {
      player.currentPiece.position.y++;
    }

    // Lock the piece
    this.lockPiece(player);

    // Check for completed lines
    this.checkLines(player);

    // Generate a new piece
    player.currentPiece = new Piece(getRandomPieceShape());

    // Check if game is over
    if (!this.canMovePieceDown(player, true)) {
      player.isAlive = false;
      global.io.to(player.name).emit("gameOver");
      this.stop();
    }

    this.emitGameState(player);
  }

  // Add a general method to check if a piece can move in any direction
  canMovePiece(player, deltaX, deltaY) {
    // Add null check for player and player.currentPiece
    if (!player || !player.currentPiece) {
      console.warn(`Cannot check movement: Player or piece is null`);
      return false;
    }

    const piece = player.currentPiece;
    const { shape } = piece;
    const { x, y } = piece.position;

    // Check each cell of the piece
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = x + col + deltaX;
          const newY = y + row + deltaY;

          // Check boundaries
          if (newX < 0 || newX >= 10 || newY >= 20) {
            return false;
          }

          // Check collision with existing blocks
          if (newY >= 0 && player.board[newY][newX] !== 0) {
            return false;
          }
        }
      }
    }

    return true;
  }

  // Add a method to check if a position is valid
  isValidPosition(player) {
    if (!player || !player.currentPiece) {
      return false;
    }
    return this.canMovePiece(player, 0, 0);
  }

  // Add pause/resume functionality
  pause(playerId) {
    console.log(`Pausing game for player: ${playerId}`);

    if (this.isStarted && !this.isPaused) {
      this.isPaused = true;

      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      const player = this.players.find((p) => p.name === playerId);
      if (player) {
        global.io.to(player.name).emit("gamePaused");
      }
    }
  }

  resume(playerId) {
    console.log(`Resuming game for player: ${playerId}`);

    if (this.isStarted && this.isPaused) {
      this.isPaused = false;

      this.intervalId = setInterval(() => this.update(), this.tickSpeed);

      const player = this.players.find((p) => p.name === playerId);
      if (player) {
        global.io.to(player.name).emit("gameResumed");
        this.emitGameState(player);
      }
    }
  }
}

module.exports = { Game };
