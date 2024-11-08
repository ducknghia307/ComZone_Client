import { Modal } from "antd";
import ChatRoomList from "../components/chat/ChatRoomList";
import { useEffect, useState } from "react";
import { ChatRoom } from "../common/interfaces/chat-room.interface";
import { useAppSelector } from "../redux/hooks";
import { privateAxios } from "../middleware/axiosInstance";
import ChatSection from "../components/chat/ChatSection";

export default function ExchangeChat({
  isChatOpen,
  setIsChatOpen,
}: {
  isChatOpen: boolean;
  setIsChatOpen: Function;
}) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[] | []>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(
    null
  );

  const fetchUserChatRooms = async () => {
    await privateAxios
      .get("/chat-rooms/user")
      .then((res) => {
        setChatRoomList(res.data);
        if (res.data.length > 0) setSelectedChatRoom(res.data[0]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUserChatRooms();
  }, []);

  return (
    <Modal
      open={isChatOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setIsChatOpen(false);
      }}
      footer={null}
      centered
      width={window.innerWidth * 0.9}
    >
      <div className="min-h-[90vh] flex items-stretch">
        <ChatRoomList
          chatRoomList={chatRoomList}
          selectedChatRoom={selectedChatRoom}
          setSelectedChatRoom={setSelectedChatRoom}
        />
        <ChatSection chatRoom={selectedChatRoom} />
      </div>
    </Modal>
  );
}
