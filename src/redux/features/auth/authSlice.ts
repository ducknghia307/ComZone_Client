import { createSlice } from "@reduxjs/toolkit";

import { revertAll } from "../../globalActions";
// Action to revert all state

const initialState = {
  isLoggedIn: false,
  refreshToken: "",
  isLoading: false,
  accessToken: "",
};

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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

export const { login, updateIsLoading } = authSlice.actions;

export const logOut = () => (dispatch: any) => {
  dispatch(revertAll());
};

export default authSlice.reducer;
