import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ChatRoom } from "../../../common/interfaces/chat-room.interface";
import { MessageGroup } from "../../../common/interfaces/message.interface";
import { revertAll } from "../../globalActions";

interface ChatState {
  currentChatRoomList: ChatRoom[] | [];
  currentlySelectedRoom: ChatRoom | null;
  currentMessageList: MessageGroup[] | [];
}

const initialState = {
  currentChatRoomList: [],
  currentlySelectedRoom: null,
  currentMessageList: [],
} satisfies ChatState as ChatState;

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatRoomList: (state, action: PayloadAction<ChatRoom[]>) => {
      state.currentChatRoomList = action.payload;
    },
    setCurrentlySelectedRoom: (state, action: PayloadAction<ChatRoom>) => {
      state.currentlySelectedRoom = action.payload;
    },
    setMessageList: (state, action: PayloadAction<MessageGroup[]>) => {
      state.currentMessageList = action.payload;
    },
    reset: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

export const {
  setChatRoomList,
  setCurrentlySelectedRoom,
  setMessageList,
  reset,
} = chatSlice.actions;

export default chatSlice.reducer;