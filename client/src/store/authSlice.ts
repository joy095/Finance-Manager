/** @format */

import { createSlice } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: isBrowser ? localStorage.getItem("accessToken") : null,
  refreshToken: isBrowser ? localStorage.getItem("refreshToken") : null,
  isAuthenticated: isBrowser ? !!localStorage.getItem("accessToken") : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.isAuthenticated = true;

      if (isBrowser) {
        localStorage.setItem("accessToken", payload.accessToken);
        localStorage.setItem("refreshToken", payload.refreshToken);
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      if (isBrowser) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
