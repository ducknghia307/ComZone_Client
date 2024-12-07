/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Socket } from "socket.io-client";
import { Modal, notification } from "antd";
import ChatRoomList from "../components/chat/ChatRoomList";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import ChatSection from "../components/chat/ChatSection";
import { privateAxios, publicAxios } from "../middleware/axiosInstance";
import Loading from "../components/loading/Loading";
import { Message, MessageGroup } from "../common/interfaces/message.interface";
import { ChatRoom } from "../common/interfaces/chat-room.interface";
import { Comic } from "../common/base.interface";
import socket from "../services/socket";

export default function ChatModal({
  isChatOpen,
  setIsChatOpen,
  getMessageUnreadList,
}: {
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<SetStateAction<boolean>>;
  getMessageUnreadList?: Function;
}) {
  const { isLoggedIn, userId, accessToken } = useAppSelector(
    (state) => state.auth
  );

  const [isLoading, setIsLoading] = useState(false);

  const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string>("");
  const [currentMessList, setCurrentMessList] = useState<MessageGroup[]>([]);

  const [messageInput, setMessageInput] = useState<string>("");
  const [sentComicsList, setSentComicsList] = useState<Comic[]>([]);
  const [sentImage, setSentImage] = useState<File>();

  const lastMessageRef = useRef<null | HTMLDivElement>(null);

  const currentRoomIdRef = useRef(currentRoomId);

  const socketRef = useRef<Socket>(socket);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("new-message", (newMessage: Message) => {
        socketRef.current?.emit("update-room-list", {
          userId,
          chatRoomId: newMessage.chatRoom.id,
        });

        socketRef.current?.emit("get-unread-list", { userId });

        if (currentRoomIdRef.current.length === 0) return;

        if (newMessage.chatRoom.id == currentRoomIdRef.current) {
          socketRef.current?.emit("update-message-list", {
            userId,
            chatRoomId: currentRoomIdRef.current,
          });
        }
      });
    }

    socketRef.current.on("new-room-list", (newRoomList: ChatRoom[]) => {
      setChatRoomList(newRoomList);
    });

    socketRef.current.on(
      "new-message-list",
      (newMessageList: MessageGroup[]) => {
        setCurrentMessList(newMessageList);
      }
    );

    socketRef.current.on("new-unread-list", (unreadList: ChatRoom[]) => {
      if (getMessageUnreadList) getMessageUnreadList(unreadList.length);
    });
  }, [currentRoomId]);

  const fetchChatRoomList = async () => {
    if (isLoggedIn)
      await privateAxios
        .get("chat-rooms/user")
        .then((res) => {
          const list: ChatRoom[] = res.data;
          setChatRoomList(list);

          if (socketRef.current)
            socketRef.current.emit("join-room", { userId });

          if (currentRoomId.length > 0) return;
          if (list.length > 0) {
            setCurrentRoomId(list[0].id);
          }
        })
        .catch((err) => console.log(err));
  };

  const connectSessionChatRoom = async () => {
    const sessionChat = sessionStorage.getItem("connectedChat");
    if (!sessionChat) return;
    await fetchChatRoomList();
    if (chatRoomList.length > 0) {
      setCurrentRoomId(sessionChat);
      currentRoomIdRef.current = sessionChat;
      sessionStorage.removeItem("connectedChat");
    }
  };

  useEffect(() => {
    fetchChatRoomList();
    connectSessionChatRoom();
    scrollDown();
  }, [isChatOpen, accessToken]);

  const fetchMessageList = async () => {
    if (!currentRoomIdRef || !currentRoomIdRef.current) return;

    if (currentRoomIdRef.current.length === 0) setCurrentMessList([]);

    await privateAxios
      .get(`/chat-messages/chat-room/${currentRoomIdRef.current}`)
      .then((res) => {
        setCurrentMessList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSendMessage = async () => {
    if (!isLoggedIn || !userId) {
      notification.info({
        key: "auth",
        message: "Chưa đăng nhập!",
        description: "Bạn cần đăng nhập để thực hiện hành động này.",
        duration: 5,
      });
    } else {
      if (!socketRef.current) return;

      if (currentRoomId.length > 0 && messageInput && messageInput.length > 0) {
        socketRef.current.emit("send-new-message", {
          userId,
          chatRoom: currentRoomIdRef.current,
          content: messageInput,
          type: "TEXT",
        });

        setMessageInput("");
      }
    }
  };

  const handleSendMessageAsComics = async () => {
    if (!isLoggedIn || !userId) {
      notification.info({
        key: "auth",
        message: "Chưa đăng nhập!",
        description: "Bạn cần đăng nhập để thực hiện hành động này.",
        duration: 5,
      });
    } else {
      if (socketRef && socketRef.current) {
        socketRef.current.emit("send-new-message", {
          userId,
          chatRoom: currentRoomIdRef.current,
          content: "",
          comics: sentComicsList.map((comics) => {
            return comics.id;
          }),
          type: "COMICS",
        });
      }
      setSentComicsList([]);
      scrollDown();
    }
  };

  const handleSendMessageAsImage = async () => {
    if (!isLoggedIn || !userId) {
      notification.info({
        key: "auth",
        message: "Chưa đăng nhập!",
        description: "Bạn cần đăng nhập để thực hiện hành động này.",
        duration: 5,
      });
    } else {
      if (!sentImage) return;
      setIsLoading(true);

      const formData = new FormData();
      formData.append("image", sentImage);
      await publicAxios
        .post("file/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("Uploaded: ", res.data);
          socketRef?.current?.emit("send-new-message", {
            userId,
            chatRoom: currentRoomIdRef.current,
            content: res.data.imageUrl,
            type: "IMAGE",
          });

          setSentImage(undefined);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsLoading(false);
          scrollDown();
        });
    }
  };

  const handleSelectChatRoom = (chatRoom: ChatRoom) => {
    setCurrentRoomId(chatRoom.id);
    currentRoomIdRef.current = chatRoom.id;

    if (chatRoom.lastMessage?.isRead) return;
    updateIsRead();
  };

  useEffect(() => {
    currentRoomIdRef.current = currentRoomId;
    fetchMessageList();
  }, [currentRoomId]);

  const updateIsRead = async () => {
    const currentRoom = chatRoomList.find(
      (chatRoom) => chatRoom.id === currentRoomIdRef.current
    );
    if (
      !currentRoom ||
      !currentRoom.lastMessage ||
      currentRoom.lastMessage?.isRead ||
      currentRoom.lastMessage?.mine
    ) {
      return;
    }

    await privateAxios
      .patch(`chat-messages/chat-room/is-read/${currentRoom.id}`)
      .then(() => {
        socketRef.current!.emit("update-room-list", {
          userId,
          chatRoomId: currentRoom.id,
        });

        socketRef.current?.emit("get-unread-list", { userId });
      })
      .catch((err) => console.log(err));
  };

  const scrollDown = () => {
    if (lastMessageRef.current)
      lastMessageRef.current!.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    scrollDown();
  }, [currentMessList, lastMessageRef]);

  const handleModalClose = () => {
    setIsChatOpen(false);
  };

  return (
    <Modal
      open={isChatOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setCurrentRoomId("");
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
          chatRoomList={chatRoomList}
          currentRoom={chatRoomList.find(
            (chatRoom) => chatRoom.id === currentRoomId
          )}
          handleSelectChatRoom={handleSelectChatRoom}
        />
        <ChatSection
          currentRoom={chatRoomList.find(
            (chatRoom) => chatRoom.id === currentRoomId
          )}
          currentRoomIdRef={currentRoomIdRef}
          currentMessList={currentMessList}
          fetchChatRoomList={fetchChatRoomList}
          handleSendMessage={handleSendMessage}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          updateIsRead={updateIsRead}
          lastMessageRef={lastMessageRef}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsChatOpen={setIsChatOpen}
          sentComicsList={sentComicsList}
          setSentComicsList={setSentComicsList}
          handleSendMessageAsComics={handleSendMessageAsComics}
          sentImage={sentImage}
          setSentImage={setSentImage}
          handleSendMessageAsImage={handleSendMessageAsImage}
        />
      </div>
    </Modal>
  );
}
