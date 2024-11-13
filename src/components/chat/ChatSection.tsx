import { MessageGroup } from "../../common/interfaces/message.interface";
import ChatMessageHistory from "./ChatMessageHistory";
import ChatMessageInput from "./ChatMessageInput";
import ChatSectionHeader from "./ChatSectionHeader";
import ComicsSectionInChat from "./ComicsSectionInChat";
import ExchangeSectionInChat from "./ExchangeSectionInChat";
import { ChatRoom } from "../../common/interfaces/chat-room.interface";
import { Comic } from "../../common/base.interface";

export default function ChatSection({
  currentRoom,
  currentMessList,
  handleSendMessage,
  messageInput,
  setMessageInput,
  updateIsRead,
  lastMessageRef,
  isLoading,
  setIsChatOpen,
  sentComicsList,
  setSentComicsList,
  handleSendMessageAsComics,
  sentImage,
  setSentImage,
  handleSendMessageAsImage,
}: {
  currentRoom: ChatRoom | undefined;
  currentMessList: MessageGroup[];
  handleSendMessage: Function;
  messageInput: string;
  setMessageInput: Function;
  updateIsRead: Function;
  lastMessageRef: any;
  isLoading: boolean;
  setIsChatOpen: Function;
  sentComicsList: Comic[];
  setSentComicsList: Function;
  handleSendMessageAsComics: Function;
  sentImage: File | undefined;
  setSentImage: Function;
  handleSendMessageAsImage: Function;
}) {
  return (
    <div
      onClick={() => {
        if (currentRoom) updateIsRead(currentRoom);
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
            {currentRoom?.exchangeRequest && (
              <ExchangeSectionInChat
                chatRoom={currentRoom}
                isLoading={isLoading}
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
