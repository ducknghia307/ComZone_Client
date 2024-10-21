import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../globalActions";

// Initial state for the auth slice
const initialState = {
  isLoggedIn: false,
  refreshToken: "",
  isLoading: false,
  accessToken: "",
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
      state.isLoggedIn = true; // Set user as logged in
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    saveNewTokens(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      console.log('111111111111111111111111111',action.payload.accessToken);
      
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState); // Revert state on logout
  },
});

// Export the action creators
export const { login, updateIsLoading, saveNewTokens } = authSlice.actions;

export default authSlice.reducer;
