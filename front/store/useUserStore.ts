import { create } from "zustand";
import type { user } from "@/types/auth";

interface UserState {
  currentUser: user | null;
  setcurrentUser: (User: user) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setcurrentUser: (user) => set({ currentUser: user }),
  clearUser: () => set({ currentUser: null }),
}));

export default useUserStore;
