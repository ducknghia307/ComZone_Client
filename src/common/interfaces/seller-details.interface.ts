import { BaseInterface, UserInfo } from "../base.interface";

export interface SellerDetails extends BaseInterface {
  user: UserInfo;
  verifiedPhone: string;
  soldCount: number;
  followerCount: number;
  status: "ACTIVE" | "DISABLED";
  province: { id: number; name: string };
  debt: number;
  detailedAddress: string;
  district: { id: number; name: string };
  fullAddress: string;
  ward: { id: string; name: string };
}
