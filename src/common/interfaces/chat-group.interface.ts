import { UserInfo } from "../base.interface";
import { ChatRoom } from "./chat-room.interface";
import { MessageGroup } from "./message.interface";

export interface ChatGroup {
  id: string;
  user: UserInfo;
  chatRoom: ChatRoom;
  messages: MessageGroup[];
}
