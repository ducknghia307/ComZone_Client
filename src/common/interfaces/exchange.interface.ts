import { BaseInterface, Comic, UserInfo } from "../base.interface";

export interface Exchange extends BaseInterface {
  post: ExchangePostInterface;
  requestUser: UserInfo;
  status:
    | "PENDING"
    | "DEALING"
    | "DELIVERING"
    | "DELIVERED"
    | "SUCCESSFUL"
    | "FAILED"
    | "CANCELED"
    | "REJECTED";
  depositAmount?: number;
  compensationAmount?: number;
}

export interface ExchangePostInterface extends BaseInterface {
  user: UserInfo;
  postContent: string;
  images?: string[];
  status: "AVAILABLE" | "UNAVAILABLE";
}

export interface ExchangeComics extends BaseInterface {
  exchange: Exchange;
  user: UserInfo;
  comics: Comic;
}

export interface ExchangeResponse {
  exchange: Exchange;
  isRequestUser: boolean;
  requestUserList: ExchangeComics[];
  postUserList: ExchangeComics[];
}
