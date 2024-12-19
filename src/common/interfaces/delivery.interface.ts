import { BaseInterface, UserInfo } from "../base.interface";
import { Exchange } from "./exchange.interface";

export enum DeliveryOverallStatus {
  PICKING = "PICKING",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  RETURN = "RETURN",
}

export enum DeliveryStatus {
  READY_TO_PICK = "ready_to_pick",
  PICKING = "picking",
  CANCEL = "cancel",
  MONEY_COLLECT_PICKING = "money_collect_picking",
  PICKED = "picked",
  STORING = "storing",
  TRANSPORTING = "transporting",
  SORTING = "sorting",
  DELIVERING = "delivering",
  MONEY_COLLECT_DELIVERING = "money_collect_delivering",
  DELIVERED = "delivered",
  DELIVERY_FAIL = "delivery_fail",
  WAITING_TO_RETURN = "waiting_to_return",
  RETURN = "return",
  RETURN_TRANSPORTING = "return_transporting",
  RETURN_SORTING = "return_sorting",
  RETURNING = "returning",
  RETURN_FAIL = "return_fail",
  RETURNED = "returned",
  EXCEPTION = "exception",
  DAMAGE = "damage",
  LOST = "lost",
}

export const DeliveryStatusGroup = {
  pickingGroup: [
    DeliveryStatus.READY_TO_PICK,
    DeliveryStatus.PICKING,
    DeliveryStatus.MONEY_COLLECT_PICKING,
    DeliveryStatus.PICKED,
  ],
  deliveringGroup: [
    DeliveryStatus.STORING,
    DeliveryStatus.TRANSPORTING,
    DeliveryStatus.SORTING,
    DeliveryStatus.DELIVERING,
    DeliveryStatus.MONEY_COLLECT_DELIVERING,
  ],
  deliveredGroup: [DeliveryStatus.DELIVERED],
  failedGroup: [
    DeliveryStatus.DELIVERY_FAIL,
    DeliveryStatus.EXCEPTION,
    DeliveryStatus.DAMAGE,
    DeliveryStatus.LOST,
  ],
  returnGroup: [
    DeliveryStatus.WAITING_TO_RETURN,
    DeliveryStatus.RETURN,
    DeliveryStatus.RETURN_SORTING,
    DeliveryStatus.RETURN_TRANSPORTING,
    DeliveryStatus.RETURNING,
    DeliveryStatus.RETURN_FAIL,
    DeliveryStatus.RETURNED,
  ],
};

export interface DeliveryInformation extends BaseInterface {
  user: UserInfo;
  name: string;
  phone: string;
  provinceId: number;
  districtId: number;
  wardId: string;
  address: string;
  fullAddress?: string;
}
export interface Delivery extends BaseInterface {
  exchange: Exchange;
  from: DeliveryInformation;
  to: DeliveryInformation;
  deliveryTrackingCode?: string;
  deliveryFee?: number;
  estimatedDeliveryTime?: Date;
  status?: DeliveryStatus;
  overallStatus?: DeliveryOverallStatus;
  packagingImages?: string[];
  expiredAt?: Date;
  note?: string;
}
