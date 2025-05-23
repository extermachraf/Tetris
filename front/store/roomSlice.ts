import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Player {
  name: string;
  isleader: boolean;
  isReady: boolean;
}

interface RoomState {
  roomId: string | null;
  players: Player[];
  isLeader: boolean;
  gameStarted: boolean;
}

const initialState: RoomState = {
  roomId: null,
  players: [],
  isLeader: false,
  gameStarted: false,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<{ roomId: string }>) => {
      state.roomId = action.payload.roomId;
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      //check if player already exist
      const existingPlayerIndex = state.players.findIndex(
        (p) => p.name === action.payload.name
      );

      //entring player
      if (existingPlayerIndex !== -1) {
        state.players[existingPlayerIndex] = action.payload;
      } else {
        state.players.push(action.payload);
      }
    },
    removePlayer: (state, action: PayloadAction<string>) => {
      state.players = state.players.filter((p) => p.name !== action.payload);
    },
    setIsLeader: (state, action: PayloadAction<boolean>) => {
      state.isLeader = action.payload;
    },
    setPlayerReady: (
      state,
      action: PayloadAction<{ playerName: string; isReady: boolean }>
    ) => {
      const playerIndex = state.players.findIndex(
        (p) => p.name === action.payload.playerName
      );

      if (playerIndex !== -1) {
        state.players[playerIndex].isReady = action.payload.isReady;
      }
    },
    setGameStarted: (state, action: PayloadAction<boolean>) => {
      state.gameStarted = action.payload;
    },
    resetRoom: (state) => {
      return initialState;
    },
  },
});

export const {
  setRoom,
  addPlayer,
  removePlayer,
  setIsLeader,
  setPlayerReady,
  setGameStarted,
  resetRoom,
} = roomSlice.actions;

export default roomSlice.reducer;
