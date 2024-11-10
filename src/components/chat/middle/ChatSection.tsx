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
}: {
  chatRoom: ChatRoom | null;
  messagesList: MessageGroup[];
  handleSendMessage: Function;
  messageInput: string;
  setMessageInput: Function;
  updateIsRead: Function;
  lastMessageRef: any;
}) {
  return (
    <div className="w-full flex items-stretch">
      <div
        onClick={() => {
          if (chatRoom) updateIsRead(chatRoom.id);
        }}
        className={`basis-2/3 flex flex-col items-stretch justify-between gap-4 pb-4 border-r border-gray-300`}
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
        {chatRoom && chatRoom.exchange && (
          <ExchangeSectionInChat exchange={chatRoom.exchange} />
        )}
      </div>
    </div>
  );
}
