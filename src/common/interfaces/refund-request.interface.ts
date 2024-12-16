import { BaseInterface, UserInfo } from "../base.interface";
import { Exchange } from "./exchange.interface";
import { Order } from "./order.interface";

export interface RefundRequest extends BaseInterface {
  user: UserInfo;
  reason: string;
  description: string;
  attachedImages?: string[];
  exchange?: Exchange;
  order?: Order;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectedReason?: string;
  mine?: boolean;
}
