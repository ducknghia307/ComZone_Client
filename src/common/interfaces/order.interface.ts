import { BaseInterface, Delivery, UserInfo } from "../base.interface";
import { RefundRequest } from "./refund-request.interface";

export enum OrderStatusEnum {
  PENDING = "PENDING",
  PACKAGING = "PACKAGING",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
}

export interface Order extends BaseInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserInfo;
  delivery: Delivery;
  code: string;
  totalPrice: number;
  paymentMethod: "COD" | "WALLET";
  isPaid: boolean;
  type: "AUCTION" | "TRADITIONAL";
  status: OrderStatusEnum;
  cancelReason?: string;
  note?: string;
  isFeedback?: boolean;
  refundRequest?: RefundRequest;
}
