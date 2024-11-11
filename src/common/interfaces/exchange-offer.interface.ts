import { BaseInterface, Comic, UserInfo } from "../base.interface";
import { ExchangeRequest } from "./exchange-request.interface";

export interface ExchangeOffer extends BaseInterface {
  exchangeRequest: ExchangeRequest;
  user: UserInfo;
  offerComics: Comic[];
  compensationAmount: number;
  status: string;
}
