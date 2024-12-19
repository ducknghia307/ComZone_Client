import { BaseInterface, Comic, Delivery, UserInfo } from "../base.interface";

export interface Exchange extends BaseInterface {
  id: string;
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
  compensateUser?: UserInfo;
  compensationAmount?: number;
  delivery?: Delivery;
}

export interface ExchangePostInterface extends BaseInterface {
  user: UserInfo;
  postContent: string;
  images?: string[];
  status: "AVAILABLE" | "UNAVAILABLE";
  mine: boolean;
  already: boolean;
  alreadyExchange?: Exchange;
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

export interface UserExchangeList extends Exchange {
  myComics: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    comics: Comic;
  }[];
  othersComics: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    comics: Comic;
  }[];
}

export interface ExchangeDetails {
  exchange: Exchange;
  isRequestUser: boolean;
  requestUserList: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    comics: Comic;
  }[];
  postUserList: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    comics: Comic;
  }[];
}

export interface ExchangeConfirmation extends BaseInterface {
  exchange: Exchange;
  user: UserInfo;
  dealingConfirm: boolean;
  deliveryConfirm: boolean;
}
