import { BaseInterface, UserInfo } from "../base.interface";
import { Exchange } from "./exchange.interface";

export interface ExchangeRefundRequest extends BaseInterface {
  user: UserInfo;
  reason: string;
  description: string;
  attachedImages?: string[];
  exchange: Exchange;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectedReason?: string;
  mine: boolean;
}
