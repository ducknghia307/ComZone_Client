import { BaseInterface, Comic, UserInfo } from "../base.interface";

export interface ExchangeRequest extends BaseInterface {
  user: UserInfo;
  requestComics: Comic[];
  postContent: string;
  status: string;
}