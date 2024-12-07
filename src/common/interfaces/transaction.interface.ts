import {
  Auction,
  BaseInterface,
  OrderDetailData,
  UserInfo,
} from "../base.interface";
import { Exchange } from "./exchange.interface";
import { ExchangeRefundRequest } from "./refund-request.interface";
import { SellerSubscription } from "./seller-subscription.interface";

export interface Transaction extends BaseInterface {
  code: string;
  amount: number;
  type: string;
  status: string;
  user: UserInfo;
  note?: string;
  auction?: Auction;
  exchange?: Exchange;
  walletDeposit?: WalletDeposit;
  order?: BaseInterface;
  deposit?: DepositDetails;
  sellerSubscription: SellerSubscription;
  refundRequest: ExchangeRefundRequest;
  withdrawal: BaseInterface;
}
export interface DepositDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  amount: number;
  status: string;
  seizedReason?: string | null;
  user: UserInfo;
  auction?: Auction; // Auction details associated with the deposit
  exchange?: Exchange; // Exchange details if applicable
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
