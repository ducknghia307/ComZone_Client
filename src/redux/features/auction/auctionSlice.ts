import { createSlice } from "@reduxjs/toolkit";

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    auctionData: null, // Initialize auctionData as an empty object
  },
  reducers: {
    setAuctionData(state, action) {
      state.auctionData = action.payload;
      console.log(action.payload);
    },
  },
});

export const { setAuctionData } = auctionSlice.actions;

export default auctionSlice.reducer;
