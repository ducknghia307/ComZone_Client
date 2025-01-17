import { BaseInterface, UserInfo } from "../base.interface";

export interface SellerFeedback extends BaseInterface {
  user: UserInfo;
  seller: UserInfo;
  rating: number;
  comment: string;
  attachedImages?: string[];
}
export interface SellerFeedbackResponse {
  averageRating: number;
  feedback: SellerFeedback[];
  totalFeedback: number;
}
