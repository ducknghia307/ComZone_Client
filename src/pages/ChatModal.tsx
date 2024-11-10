import { io } from "socket.io-client";
import { Modal } from "antd";
import ChatRoomList from "../components/chat/left/ChatRoomList";
import { useEffect, useRef, useState } from "react";
import { ChatRoom } from "../common/interfaces/chat-room.interface";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import ChatSection from "../components/chat/middle/ChatSection";
import {
  getChatRoomList,
  getMessageList,
  updateChatRoomIsRead,
  updateSelectedChatRoom,
} from "../redux/features/chat/chatActionCreators";
import { chatSlice } from "../redux/features/chat/chatSlice";

const socket = io("http://localhost:3001");

export default function ChatModal({
  isChatOpen,
  setIsChatOpen,
}: {
  isChatOpen: boolean;
  setIsChatOpen: Function;
}) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();

  const { currentChatRoomList, currentlySelectedRoom, currentMessageList } =
    useAppSelector((state) => state.chat);

  const [messageInput, setMessageInput] = useState<string>("");

  const lastMessageRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    socket.on("new-message", async (newMessage) => {
      await dispatch(getChatRoomList());
      console.log("NEWMESS CHATROOM: ", newMessage.chatRoom);
      console.log("CURRENT ID: ", currentlySelectedRoom?.id);
      if (
        currentlySelectedRoom &&
        newMessage.chatRoom === currentlySelectedRoom.id
      ) {
        await dispatch(getMessageList(newMessage.chatRoom));
      }
    });
  }, []);

  const fetchChat = async () => {
    await dispatch(getChatRoomList());
    await dispatch(updateSelectedChatRoom(currentChatRoomList));
    if (currentlySelectedRoom)
      await dispatch(getMessageList(currentlySelectedRoom.id));

    if (
      sessionStorage.getItem("connectedChat") &&
      currentChatRoomList.length > 0
    ) {
      const foundChatRoom = currentChatRoomList.find(
        (room) => room.id === sessionStorage.getItem("connectedChat")
      );

      if (foundChatRoom) {
        await dispatch(
          updateSelectedChatRoom(currentChatRoomList, foundChatRoom)
        );
      }

      sessionStorage.removeItem("connectedChat");
    }
  };

  useEffect(() => {
    fetchChat();
  }, []);

  const handleSendMessage = async () => {
    if (!isLoggedIn) {
      alert("Chưa đăng nhập!");
      return;
    } else {
      if (currentlySelectedRoom && messageInput && messageInput.length > 0) {
        socket.emit("send-new-message", {
          token: accessToken,
          chatRoom: currentlySelectedRoom.id,
          content: messageInput,
        });

        setMessageInput("");
      }
    }
  };

  const updateIsRead = async (chatRoomId: string) => {
    if (isLoggedIn && currentlySelectedRoom)
      await dispatch(updateChatRoomIsRead(chatRoomId));
  };

  const handleSelectChatRoom = async (chatRoom: ChatRoom) => {
    await dispatch(updateSelectedChatRoom(currentChatRoomList, chatRoom));
    await dispatch(getMessageList(chatRoom.id));
    await dispatch(updateChatRoomIsRead(chatRoom.id));
  };

  useEffect(() => {
    if (lastMessageRef.current)
      lastMessageRef.current!.scrollIntoView({ behavior: "instant" });
  }, [currentMessageList]);

  const handleModalClose = () => {
    dispatch(chatSlice.actions.reset);
    setIsChatOpen(false);
  };

  return (
    <Modal
      open={isChatOpen}
      onCancel={(e) => {
        e.stopPropagation();
        handleModalClose();
      }}
      footer={null}
      centered
      width={window.innerWidth * 0.9}
      className="p-0"
    >
      <div className="h-[90vh] xl:max-h-[1000px] flex items-stretch">
        <ChatRoomList
          chatRoomList={currentChatRoomList}
          currentSelectedRoom={currentlySelectedRoom}
          handleSelectChatRoom={handleSelectChatRoom}
        />
        <ChatSection
          chatRoom={currentlySelectedRoom}
          messagesList={currentMessageList}
          handleSendMessage={handleSendMessage}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          updateIsRead={updateIsRead}
          lastMessageRef={lastMessageRef}
        />
      </div>
    </Modal>
  );
}
