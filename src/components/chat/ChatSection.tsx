import { MessageGroup } from "../../common/interfaces/message.interface";
import ChatMessageHistory from "./ChatMessageHistory";
import ChatMessageInput from "./ChatMessageInput";
import ChatSectionHeader from "./ChatSectionHeader";
import ComicsSectionInChat from "./ComicsSectionInChat";
import ExchangeSectionInChat from "./ExchangeSectionInChat";
import { ChatRoom } from "../../common/interfaces/chat-room.interface";
import { Comic } from "../../common/base.interface";
import { MutableRefObject } from "react";

export default function ChatSection({
  currentRoom,
  currentRoomIdRef,
  currentMessList,
  fetchChatRoomList,
  handleSendMessage,
  messageInput,
  setMessageInput,
  updateIsRead,
  lastMessageRef,
  setIsLoading,
  setIsChatOpen,
  sentComicsList,
  setSentComicsList,
  handleSendMessageAsComics,
  sentImage,
  setSentImage,
  handleSendMessageAsImage,
}: {
  currentRoom: ChatRoom | undefined;
  currentRoomIdRef: MutableRefObject<string>;
  currentMessList: MessageGroup[];
  fetchChatRoomList: () => void;
  handleSendMessage: () => void;
  messageInput: string;
  setMessageInput: () => void;
  updateIsRead: () => void;
  lastMessageRef: any;
  isLoading: boolean;
  setIsLoading: () => void;
  setIsChatOpen: () => void;
  sentComicsList: Comic[];
  setSentComicsList: () => void;
  handleSendMessageAsComics: () => void;
  sentImage: File | undefined;
  setSentImage: () => void;
  handleSendMessageAsImage: () => void;
}) {
  return (
    <div
      onClick={() => {
        if (currentRoom) updateIsRead();
      }}
      className={`w-full flex flex-col items-stretch justify-between gap-2`}
    >
      {!currentRoom ? null : (
        <>
          <div className="w-full flex flex-col items-stretch justify-start relative">
            <ChatSectionHeader chatRoom={currentRoom} />
            {currentRoom?.comics && (
              <ComicsSectionInChat
                comics={currentRoom.comics}
                setIsChatOpen={setIsChatOpen}
              />
            )}
            {currentRoom?.exchange && (
              <ExchangeSectionInChat
                chatRoom={currentRoom}
                setIsChatOpen={setIsChatOpen}
              />
            )}
          </div>

          <ChatMessageHistory
            messagesList={currentMessList}
            lastMessageRef={lastMessageRef}
          />
          <ChatMessageInput
            handleSendMessage={handleSendMessage}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            sentComicsList={sentComicsList}
            setSentComicsList={setSentComicsList}
            handleSendMessageAsComics={handleSendMessageAsComics}
            sentImage={sentImage}
            setSentImage={setSentImage}
            handleSendMessageAsImage={handleSendMessageAsImage}
          />
        </>
      )}
    </div>
  );
}
