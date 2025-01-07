import { BaseInterface, Comic, UserInfo } from "../base.interface";
import { Condition } from "./condition.interface";

export enum AuctionStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
}

export interface Auction extends BaseInterface {
  comics: Comic;
  winner?: UserInfo;
  reservePrice: number;
  currentPrice?: number;
  maxPrice: number;
  priceStep: number;
  startTime: Date;
  endTime: Date;
  status: AuctionStatus;
  depositAmount: number;
}

export interface AuctionCriteria {
  id: number;
  isFullInfoFilled: boolean;
  conditionLevel: Condition;
  editionRestricted: boolean;
  updatedAt: Date;
}
