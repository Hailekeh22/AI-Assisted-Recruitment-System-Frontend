import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "admin" | "employer" | "jobseeker";
  photo?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },

    hydrateUser(state) {
      const stored = localStorage.getItem("user");
      if (stored) {
        state.user = JSON.parse(stored);
      }
    },
  },
});

export const { setUser, clearUser, hydrateUser } = authSlice.actions;
