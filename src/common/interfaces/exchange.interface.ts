import { BaseInterface, Comic, UserInfo } from "../base.interface";

export interface Exchange extends BaseInterface {
  requestUser: UserInfo;
  requestComics: Comic[];
  offerUser?: UserInfo;
  offerComics?: Comic[];
  postContent: string;
  userOfferedComics?: Comic[] | [];
  status: string;
}
