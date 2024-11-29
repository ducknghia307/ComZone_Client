import { BaseInterface, UserInfo } from "../base.interface";

export interface SellerSubscriptionPlan extends BaseInterface {
  duration: number;
  sellTime: number;
  auctionTime: number;
  price: number;
}

export interface SellerSubscription extends BaseInterface {
  user: UserInfo;
  plan: SellerSubscriptionPlan;
  activatedTime: Date;
  remainingSellTime: number;
  remainingAuctionTime: number;
  isAutoRenewed: boolean;
  usedTrial: boolean;
  canSell: boolean;
  canAuction: boolean;
  isActive: boolean;
}
