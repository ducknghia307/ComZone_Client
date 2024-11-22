import { createSlice } from "@reduxjs/toolkit";

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    auctionData: null, // Initialize auctionData as an empty object
    highestBid: null,
  },
  reducers: {
    setAuctionData(state, action) {
      state.auctionData = action.payload;
    },
    setHighestBid(state, action) {
      state.highestBid = action.payload;
    },
  },
});

export const { setAuctionData, setHighestBid } = auctionSlice.actions;

export default auctionSlice.reducer;
