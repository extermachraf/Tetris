import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Game state interface
export interface GameState {
  board: number[][];
  currentPiece: {
    shape: number[][];
    position: {
      x: number;
      y: number;
    };
  } | null;
  nextPiece: {
    shape: number[][];
  } | null;
  isGameOver: boolean;
  isPaused: boolean;
  score: number;
  level: number;
  linesCleared: number;
}

const initialState: GameState = {
  board: Array(20).fill(Array(10).fill(0)),
  currentPiece: null,
  nextPiece: null,
  isGameOver: false,
  isPaused: false,
  score: 0,
  level: 1,
  linesCleared: 0,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateGameState(state, action: PayloadAction<Partial<GameState>>) {
      return { ...state, ...action.payload };
    },
    setBoard(state, action: PayloadAction<number[][]>) {
      state.board = action.payload;
    },
    setCurrentPiece(state, action: PayloadAction<GameState["currentPiece"]>) {
      state.currentPiece = action.payload;
    },
    setNextPiece(state, action: PayloadAction<GameState["nextPiece"]>) {
      state.nextPiece = action.payload;
    },
    setGameOver(state, action: PayloadAction<boolean>) {
      state.isGameOver = action.payload;
    },
    setPaused(state, action: PayloadAction<boolean>) {
      state.isPaused = action.payload;
    },
    incrementScore(state, action: PayloadAction<number>) {
      state.score += action.payload;
    },
    incrementLevel(state) {
      state.level += 1;
    },
    incrementLinesCleared(state, action: PayloadAction<number>) {
      state.linesCleared += action.payload;
    },
    resetGame(state) {
      return initialState;
    },
  },
});

export const {
  updateGameState,
  setBoard,
  setCurrentPiece,
  setNextPiece,
  setGameOver,
  setPaused,
  incrementScore,
  incrementLevel,
  incrementLinesCleared,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;