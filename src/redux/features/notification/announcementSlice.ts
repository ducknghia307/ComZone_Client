import { createSlice } from "@reduxjs/toolkit";

const announcementSlice = createSlice({
  name: "announcement",
  initialState: {
    auctionAnnounce: null, // Initialize auctionData as an empty object
  },
  reducers: {
    auctionAnnouncement(state, action) {
      state.auctionAnnounce = action.payload;
      console.log(action.payload);
      
    },
  },
});

export const { auctionAnnouncement } = announcementSlice.actions;

export default announcementSlice.reducer;
