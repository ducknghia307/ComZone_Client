import { ChatRoom } from "../../../common/interfaces/chat-room.interface";
import { MessageGroup } from "../../../common/interfaces/message.interface";
import ChatMessageHistory from "./ChatMessageHistory";
import ChatMessageInput from "./ChatMessageInput";
import ChatSectionHeader from "./ChatSectionHeader";
import ComicsSectionInChat from "../right/ComicsSectionInChat";
import ExchangeSectionInChat from "../right/ExchangeSectionInChat";

export default function ChatSection({
  chatRoom,
  messagesList,
  handleSendMessage,
  messageInput,
  setMessageInput,
  updateIsRead,
  lastMessageRef,
  isLoading,
  fetchChatRoomList,
}: {
  chatRoom: ChatRoom | null;
  messagesList: MessageGroup[];
  handleSendMessage: Function;
  messageInput: string;
  setMessageInput: Function;
  updateIsRead: Function;
  lastMessageRef: any;
  isLoading: boolean;
  fetchChatRoomList: Function;
}) {
  return (
    <div className="w-full flex items-stretch">
      <div
        onClick={() => {
          if (chatRoom) updateIsRead(chatRoom.id);
        }}
        className={`basis-2/3 flex flex-col items-stretch justify-between gap-2 pb-4 border-r border-gray-300`}
      >
        <ChatSectionHeader chatRoom={chatRoom} />
        <ChatMessageHistory
          messagesList={messagesList}
          lastMessageRef={lastMessageRef}
        />
        <ChatMessageInput
          handleSendMessage={handleSendMessage}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
        />
      </div>

      <div className="basis-1/3 flex items-stretch px-2">
        {chatRoom && chatRoom.comics && (
          <ComicsSectionInChat comics={chatRoom.comics} />
        )}
        {chatRoom && chatRoom.exchangeRequest && (
          <ExchangeSectionInChat
            isLoading={isLoading}
            chatRoom={chatRoom}
            fetchChatRoomList={fetchChatRoomList}
          />
        )}
      </div>
    </div>
  );
}
