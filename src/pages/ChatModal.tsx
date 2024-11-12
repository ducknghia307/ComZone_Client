import { io } from "socket.io-client";
import { Modal } from "antd";
import ChatRoomList from "../components/chat/left/ChatRoomList";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import ChatSection from "../components/chat/middle/ChatSection";
import { privateAxios } from "../middleware/axiosInstance";
import Loading from "../components/loading/Loading";
import { Message, MessageGroup } from "../common/interfaces/message.interface";
import { ChatGroup } from "../common/interfaces/chat-group.interface";
import { authSlice } from "../redux/features/auth/authSlice";

export default function ChatModal({
  isChatOpen,
  setIsChatOpen,
}: {
  isChatOpen: boolean;
  setIsChatOpen: Function;
}) {
  const { isLoggedIn, isLoading, userId } = useAppSelector(
    (state) => state.auth
  );

  const [chatList, setChatList] = useState<ChatGroup[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatGroup | undefined>();
  const [messageInput, setMessageInput] = useState<string>("");
  const lastMessageRef = useRef<null | HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const socket = io("http://localhost:3001");

  useEffect(() => {
    socket.on("new-message", (newMessage: Message) => {
      console.log(newMessage);
      fetchChatGroup();
      if (currentChat)
        setCurrentChat(chatList.find((chat) => chat.id === currentChat.id));
    });
  }, [socket]);

  const fetchChatGroup = async () => {
    dispatch(authSlice.actions.updateIsLoading({ isLoading: true }));
    await privateAxios
      .get("chat-messages/user/chat-room-group")
      .then((res) => {
        setChatList(res.data);
        if (!currentChat && res.data.length > 0) setCurrentChat(res.data[0]);
      })
      .catch((err) => console.log(err))
      .finally(() =>
        dispatch(authSlice.actions.updateIsLoading({ isLoading: false }))
      );
  };

  const connectSessionChatRoom = () => {
    const sessionChat = sessionStorage.getItem("connectedChat");
    if (!sessionChat) return;
    if (chatList.length > 0) {
      setCurrentChat(chatList.find((chat) => chat.id === sessionChat));
    }
  };

  useEffect(() => {
    fetchChatGroup();
    connectSessionChatRoom();
  }, []);

  const handleSendMessage = async () => {
    if (!isLoggedIn || !userId) {
      alert("Chưa đăng nhập!");
      return;
    } else {
      if (currentChat && messageInput && messageInput.length > 0) {
        socket.emit("send-new-message", {
          userId,
          chatRoom: currentChat.id,
          content: messageInput,
          type: "TEXT",
        });
        setMessageInput("");
      }
    }
  };

  const handleSelectChat = (chat: ChatGroup) => {
    setCurrentChat(chat);
  };

  const updateIsRead = async (chatRoomId: string) => {
    // if (isLoggedIn && currentlySelectedRoom)
    //   await dispatch(updateChatRoomIsRead(chatRoomId));
  };

  const scrollDown = () => {
    if (lastMessageRef.current)
      lastMessageRef.current!.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    scrollDown();
  }, [currentChat]);

  const handleModalClose = () => {
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
      width={window.innerWidth * 0.8}
    >
      {isLoading && <Loading />}
      <div className="h-[90vh] xl:max-h-[1000px] flex items-stretch">
        {isLoading && <Loading />}
        <ChatRoomList
          chatList={chatList}
          currentSelectedRoom={currentChat}
          handleSelectChat={handleSelectChat}
        />
        <ChatSection
          chat={currentChat}
          handleSendMessage={handleSendMessage}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          updateIsRead={updateIsRead}
          lastMessageRef={lastMessageRef}
          isLoading={isLoading}
          fetchChatGroup={fetchChatGroup}
        />
      </div>
    </Modal>
  );
}
