import { ChatRoom } from "../../../common/interfaces/chat-room.interface";
import { privateAxios } from "../../../middleware/axiosInstance";
import { AppDispatch } from "../../store";
import { chatSlice } from "./chatSlice";

export function getChatRoomList() {
  return async (dispatch: AppDispatch) => {
    try {
      const chatRoomList = await privateAxios
        .get("chat-rooms/user")
        .then((res) => {
          return res.data;
        });
      if (chatRoomList.length > 0) {
        dispatch(chatSlice.actions.updateChatRoomList(chatRoomList));
        return true;
      } else return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
}

export function updateSelectedChatRoom(
  currentRoomList: ChatRoom[] | [],
  chatRoom?: ChatRoom
) {
  return async (dispatch: AppDispatch) => {
    if (!chatRoom) {
      if (currentRoomList.length > 0) {
        dispatch(chatSlice.actions.updateSelectedChatRoom(currentRoomList[0]));
        return true;
      } else return false;
    } else dispatch(chatSlice.actions.updateSelectedChatRoom(chatRoom));
  };
}

export function getMessageList(chatRoomId: string) {
  return async (dispatch: AppDispatch) => {
    await privateAxios
      .get(`/chat-messages/chat-room/${chatRoomId}`)
      .then((res) => {
        dispatch(chatSlice.actions.updateMessageList(res.data));
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };
}

export function updateChatRoomIsRead(chatRoomId: string) {
  return async (dispatch: AppDispatch) => {
    await privateAxios
      .patch(`chat-messages/chat-room/is-read/${chatRoomId}`)
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });

    const chatRoomList = await privateAxios
      .get("chat-rooms/user")
      .then((res) => {
        return res.data;
      });
    if (chatRoomList.length > 0) {
      dispatch(chatSlice.actions.updateChatRoomList(chatRoomList));
      return true;
    } else return false;
  };
}
