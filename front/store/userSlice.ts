import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { user } from "@/types/auth";

interface UserState {
  currentUser: {
    user: user;
  } | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<{ user: user }>) {
      state.currentUser = action.payload;
    },
    clearUser(state) {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
