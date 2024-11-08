import { BaseInterface, Comic, UserInfo } from "../base.interface";
import { Exchange } from "./exchange.interface";
import { Message } from "./message.interface";

export interface ChatRoom extends BaseInterface {
  firstUser: UserInfo;
  secondUser: UserInfo;
  lastMessage?: Message;
  comics?: Comic;
  exchange?: Exchange;
}
