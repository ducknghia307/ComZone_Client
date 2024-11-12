import { BaseInterface, Comic, UserInfo } from "../base.interface";
import { ChatRoom } from "./chat-room.interface";

export interface Message extends BaseInterface {
  user: UserInfo;
  chatRoom: ChatRoom;
  content: string;
  type: "TEXT" | "IMAGE" | "COMICS" | "LINK" | "REPLY" | "SYSTEM";
  mine: boolean | null;
  isRead: boolean;
  repliedToMessage?: Message | null;
  comics?: Comic[];
}

export interface MessageGroup {
  date: Date;
  messages: Message[];
}
