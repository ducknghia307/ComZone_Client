import { Auction, BaseInterface, UserInfo } from "../base.interface";
import { ExchangeRequest } from "./exchange.interface";

export interface Deposit extends BaseInterface {
  user: UserInfo;
  auction?: Auction;
  exchange?: ExchangeRequest;
  amount: number;
  status: "HOLDING" | "REFUNDED" | "SEIZED";
}
