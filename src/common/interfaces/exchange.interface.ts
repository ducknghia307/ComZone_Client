import { BaseInterface, Comic, UserInfo } from "../base.interface";

export interface Exchange extends BaseInterface {
  requestUser?: UserInfo;
  postUser: UserInfo;
  postContent: string;
  images?: string[];
  status:
    | "PENDING"
    | "DEALING"
    | "DELIVERING"
    | "DELIVERED"
    | "SUCCESSFUL"
    | "REMOVED";
  depositAmount?: number;
  compensationAmount?: number;
}
