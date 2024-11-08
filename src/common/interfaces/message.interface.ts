import { BaseInterface, UserInfo } from "../base.interface";

export interface Message extends BaseInterface {
  user: UserInfo;
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
