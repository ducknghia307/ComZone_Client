import { MessageGroup } from "../../../common/interfaces/message.interface";
import ChatMessageHistory from "./ChatMessageHistory";
import ChatMessageInput from "./ChatMessageInput";
import ChatSectionHeader from "./ChatSectionHeader";
import ComicsSectionInChat from "../right/ComicsSectionInChat";
import ExchangeSectionInChat from "../right/ExchangeSectionInChat";
import { ChatGroup } from "../../../common/interfaces/chat-group.interface";

export default function ChatSection({
  chat,
  handleSendMessage,
  messageInput,
  setMessageInput,
  updateIsRead,
  lastMessageRef,
  isLoading,
  fetchChatGroup,
}: {
  chat: ChatGroup | undefined;
  handleSendMessage: Function;
  messageInput: string;
  setMessageInput: Function;
  updateIsRead: Function;
  lastMessageRef: any;
  isLoading: boolean;
  fetchChatGroup: Function;
}) {
  return (
    <div className="w-full flex items-stretch">
      <div
        // onClick={() => {
        //   if (chat) updateIsRead(chatRoom.id);
        // }}
        className={`basis-full flex flex-col items-stretch justify-between gap-2 pb-4`}
      >
        <ChatSectionHeader chatRoom={chat?.chatRoom} />
        <ChatMessageHistory
          messagesList={chat?.messages || []}
          lastMessageRef={lastMessageRef}
        />
        <ChatMessageInput
          handleSendMessage={handleSendMessage}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
        />
      </div>
    </div>
  );
}
