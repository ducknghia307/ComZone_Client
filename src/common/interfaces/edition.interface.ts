import { BaseInterface } from "../base.interface";

export interface Edition extends BaseInterface {
  name: string;
  description: string;
  isSpecial?: boolean;
  auctionDisabled: boolean;
}
