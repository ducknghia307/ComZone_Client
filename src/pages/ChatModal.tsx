import { io } from "socket.io-client";
import { Modal } from "antd";
import ChatRoomList from "../components/chat/left/ChatRoomList";
import { useEffect, useRef, useState } from "react";
import { ChatRoom } from "../common/interfaces/chat-room.interface";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import ChatSection from "../components/chat/middle/ChatSection";
import { chatSlice } from "../redux/features/chat/chatSlice";
import { privateAxios } from "../middleware/axiosInstance";
import { authSlice } from "../redux/features/auth/authSlice";
import Loading from "../components/loading/Loading";
import { Message } from "../common/interfaces/message.interface";

const socket = io("http://localhost:3001");

export default function ChatModal({
  isChatOpen,
  setIsChatOpen,
}: {
  isChatOpen: boolean;
  setIsChatOpen: Function;
}) {
  const { isLoggedIn, accessToken, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  const { currentChatRoomList, currentlySelectedRoom, currentMessageList } =
    useAppSelector((state) => state.chat);

  const [messageInput, setMessageInput] = useState<string>("");

  const lastMessageRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    dispatch(authSlice.actions.updateIsLoading({ isLoading: true }));
    socket.on("connection", () => {
      dispatch(authSlice.actions.updateIsLoading({ isLoading: false }));

      socket.on("new-message", async (newMessage: Message) => {
        await fetchChatRoomList();
        if (
          currentlySelectedRoom &&
          newMessage.chatRoom.id === currentlySelectedRoom.id
        ) {
          await fetchMessageList(currentlySelectedRoom);
        }
      });
    });
  }, []);

  const fetchChatRoomList = async () => {
    await privateAxios
      .get("chat-rooms/user")
      .then((res) => {
        const list = res.data;
        console.log("CHATROOMS: ", list);
        dispatch(chatSlice.actions.setChatRoomList(list));

        if (!currentlySelectedRoom && list.length > 0) {
          dispatch(chatSlice.actions.setCurrentlySelectedRoom(res.data[0]));
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchMessageList = async (chatRoom: ChatRoom) => {
    dispatch(authSlice.actions.updateIsLoading({ isLoading: true }));
    await privateAxios
      .get(`/chat-messages/chat-room/${chatRoom.id}`)
      .then((res) => {
        dispatch(chatSlice.actions.setMessageList(res.data));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(authSlice.actions.updateIsLoading({ isLoading: false }));
      });
  };

  const handleSelectChatRoom = async (chatRoom: ChatRoom) => {
    dispatch(chatSlice.actions.setCurrentlySelectedRoom(chatRoom));
  };

  const selectConnectedChat = async () => {
    if (
      sessionStorage.getItem("connectedChat") &&
      currentChatRoomList.length > 0
    ) {
      const foundChatRoom = currentChatRoomList.find(
        (room) => room.id === sessionStorage.getItem("connectedChat")
      );

      if (foundChatRoom) {
        dispatch(chatSlice.actions.setCurrentlySelectedRoom(foundChatRoom));
      }

      sessionStorage.removeItem("connectedChat");
    }
  };

  useEffect(() => {
    fetchChatRoomList();
    selectConnectedChat();
    currentlySelectedRoom && fetchMessageList(currentlySelectedRoom);
    scrollDown();
  }, []);

  useEffect(() => {
    currentlySelectedRoom && fetchMessageList(currentlySelectedRoom);
  }, [currentlySelectedRoom]);

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
          type: "TEXT",
        });
        setMessageInput("");
      }
    }
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
      {isLoading && <Loading />}
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
          isLoading={isLoading}
          fetchChatRoomList={fetchChatRoomList}
        />
      </div>
    </Modal>
  );
}
