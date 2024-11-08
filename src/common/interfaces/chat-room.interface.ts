import { BaseInterface, Comic, UserInfo } from "../base.interface";
import { Exchange } from "./exchange.interface";

export interface ChatRoom extends BaseInterface {
  firstUser: UserInfo;
  secondUser: UserInfo;
  comics?: Comic;
  exchange?: Exchange;
}
