import {
  Auction,
  BaseInterface,
  OrderDetailData,
  UserInfo,
} from "../base.interface";
import { Exchange } from "./exchange.interface";

export interface Transaction extends BaseInterface {
  code: string;
  amount: number;
  type: string;
  status: string;
  user: UserInfo;
  note?: string;
  date: string;
  auction?: Auction;
  exchange?: Exchange;
  walletDeposit?: WalletDeposit;
  order?: BaseInterface;
  deposit?: BaseInterface;
}
export interface Deposit extends BaseInterface {
  status: string;
  seizedReason: string;
  user: UserInfo;
}
export interface WalletDeposit extends BaseInterface {
  amount: number;
  paymentGateway: string;
  status: string;
}
