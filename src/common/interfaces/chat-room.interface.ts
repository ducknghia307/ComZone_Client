import { BaseInterface, Comic, UserInfo } from "../base.interface";
import { ExchangeOffer } from "./exchange-offer.interface";
import { ExchangeRequest } from "./exchange-request.interface";
import { Message } from "./message.interface";

export interface ChatRoom extends BaseInterface {
  firstUser: UserInfo;
  secondUser: UserInfo;
  lastMessage?: Message;
  comics?: Comic;
  exchangeRequest?: ExchangeRequest;
}
