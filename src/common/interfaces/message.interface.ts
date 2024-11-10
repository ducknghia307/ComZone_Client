import { BaseInterface, UserInfo } from "../base.interface";
import { ChatRoom } from "./chat-room.interface";

export interface Message extends BaseInterface {
  user: UserInfo;
  chatRoom: ChatRoom;
  content: string;
  type: "TEXT" | "IMAGE" | "LINK" | "REPLY" | "SYSTEM";
  mine: boolean | null;
  isRead: boolean;
  repliedToMessage?: Message | null;
}

export interface MessageGroup {
  date: Date;
  messages: Message[];
}
