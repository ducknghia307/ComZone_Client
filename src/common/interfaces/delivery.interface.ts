import { BaseInterface, UserInfo } from "../base.interface";
import { Exchange } from "./exchange.interface";

export interface DeliveryInformation extends BaseInterface {
  user: UserInfo;
  name: string;
  phone: string;
  provinceId: number;
  districtId: number;
  wardId: string;
  address: string;
}
export interface Delivery extends BaseInterface {
  exchange: Exchange;
  from: DeliveryInformation;
  to: DeliveryInformation;
  deliveryTrackingCode?: string;
  deliveryFee?: number;
  estimatedDeliveryTime?: Date;
  status?: string;
  note?: string;
}
