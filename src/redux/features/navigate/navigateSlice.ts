import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../globalActions";

// Initial state for the auth slice
const initialState = {
  navigateUrl: "/",
};

// Auth slice to manage authentication state
export const navigateSlice = createSlice({
  name: "navigate",
  initialState,
  reducers: {
    callbackUrl: (state, action) => {
      state.navigateUrl = action.payload.navigateUrl;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// Export the action creators
export const { callbackUrl } = navigateSlice.actions;

export default navigateSlice.reducer;
