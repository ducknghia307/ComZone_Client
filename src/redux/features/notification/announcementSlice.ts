import { createSlice } from "@reduxjs/toolkit";

const annoucementSlice = createSlice({
  name: "announcement",
  initialState: {
    auctionAnnounce: null, // Initialize auctionData as an empty object
  },
  reducers: {
    auctionAnnoucement(state, action) {
      state.auctionAnnounce = action.payload;
      console.log(action.payload);
    },
  },
});

export const { auctionAnnoucement } = annoucementSlice.actions;

export default annoucementSlice.reducer;
