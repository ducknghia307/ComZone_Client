import { io } from "socket.io-client";
import { Modal } from "antd";
import ChatRoomList from "../components/chat/left/ChatRoomList";
import { useEffect, useRef, useState } from "react";
import { ChatRoom } from "../common/interfaces/chat-room.interface";
import { useAppSelector } from "../redux/hooks";
import { privateAxios } from "../middleware/axiosInstance";
import ChatSection from "../components/chat/middle/ChatSection";
import { MessageGroup } from "../common/interfaces/message.interface";

export default function ChatModal({
  isChatOpen,
  setIsChatOpen,
}: {
  isChatOpen: boolean;
  setIsChatOpen: Function;
}) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[] | []>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(
    null
  );
  const [messagesList, setMessagesList] = useState<MessageGroup[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");

  const lastMessageRef = useRef<null | HTMLDivElement>(null);

  const socket = io("http://localhost:3001");

  useEffect(() => {
    socket.on("new-message", (newMessage) => {
      fetchUserChatRooms();
      if (newMessage.chatRoom === selectedChatRoom?.id) {
        fetchMessages(newMessage.chatRoom);
      }
    });
  }, []);

  const fetchUserChatRooms = async () => {
    await privateAxios
      .get("/chat-rooms/user")
      .then((res) => {
        setChatRoomList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchMessages = async (chatRoomId: string) => {
    await privateAxios
      .get(`chat-messages/chat-room/${chatRoomId}`)
      .then((res) => {
        setMessagesList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUserChatRooms();
  }, [isChatOpen]);

  useEffect(() => {
    if (!selectedChatRoom && chatRoomList.length > 0) {
      setSelectedChatRoom(chatRoomList[0]);
      fetchMessages(chatRoomList[0].id);
      updateIsRead(chatRoomList[0].id);
    }

    if (sessionStorage.getItem("connectedChat") && chatRoomList.length > 0) {
      const foundChatRoom = chatRoomList.find(
        (room) => room.id === sessionStorage.getItem("connectedChat")
      );

      if (foundChatRoom) {
        setSelectedChatRoom(foundChatRoom);
        fetchMessages(foundChatRoom.id);
        updateIsRead(foundChatRoom.id);
      }

      sessionStorage.removeItem("connectedChat");
    }
  }, [chatRoomList]);

  const handleSendMessage = () => {
    if (!isLoggedIn) {
      alert("Chưa đăng nhập!");
      return;
    } else {
      if (selectedChatRoom && messageInput && messageInput.length > 0) {
        socket.emit("send-new-message", {
          token: accessToken,
          chatRoom: selectedChatRoom.id,
          content: messageInput,
        });

        setMessageInput("");
      }
    }
  };

  const updateIsRead = async (chatRoomId: string) => {
    if (isLoggedIn && selectedChatRoom)
      await privateAxios
        .patch(`chat-messages/chat-room/is-read/${chatRoomId}`)
        .then(() => {
          fetchUserChatRooms();
        })
        .catch((err) => console.log(err));
  };

  const handleSelectChatRoom = async (chatRoom: ChatRoom) => {
    if (chatRoom !== selectedChatRoom) {
      setSelectedChatRoom(chatRoom);
      fetchMessages(chatRoom.id);
      updateIsRead(chatRoom.id);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current)
      lastMessageRef.current!.scrollIntoView({ behavior: "instant" });
  }, [messagesList]);

  const handleModalClose = () => {
    setSelectedChatRoom(null);
    setChatRoomList([]);
    setMessagesList([]);
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
          chatRoomList={chatRoomList}
          selectedChatRoom={selectedChatRoom}
          handleSelectChatRoom={handleSelectChatRoom}
        />
        <ChatSection
          chatRoom={selectedChatRoom}
          messagesList={messagesList}
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
