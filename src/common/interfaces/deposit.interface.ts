import { Auction, BaseInterface, UserInfo } from "../base.interface";

export interface Deposit extends BaseInterface {
  user: UserInfo;
  auction?: Auction;
  amount: number;
  status: "HOLDING" | "REFUNDED" | "SEIZED";
}
