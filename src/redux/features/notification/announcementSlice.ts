import { createSlice } from "@reduxjs/toolkit";

const announcementSlice = createSlice({
  name: "announcement",
  initialState: {
    auctionAnnounce: null,
    unReadAnnounce: 0,
  },
  reducers: {
    auctionAnnouncement(state, action) {
      state.auctionAnnounce = action.payload;
      console.log(action.payload);
    },
    setUnreadAnnounce(state, action) {
      state.unReadAnnounce = action.payload;
      console.log("unread", action.payload);
    },
    plusUnreadAnnounce(state) {
      state.unReadAnnounce += 1; // Increment unread count
      console.log("Updated unread count:", state.unReadAnnounce);
    },
  },
});

export const { auctionAnnouncement, setUnreadAnnounce, plusUnreadAnnounce } =
  announcementSlice.actions;

export default announcementSlice.reducer;
