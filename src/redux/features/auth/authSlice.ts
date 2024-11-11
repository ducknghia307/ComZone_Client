import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../globalActions";

// Initial state for the auth slice
const initialState = {
  isLoggedIn: false,
  refreshToken: "",
  isLoading: false,
  accessToken: "",
  userId: "",
};

// Auth slice to manage authentication state
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.isLoading = action.payload.isLoading;
    },
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
    },
    saveNewTokens(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// Export the action creators
export const { login, updateIsLoading, saveNewTokens } = authSlice.actions;

export default authSlice.reducer;
