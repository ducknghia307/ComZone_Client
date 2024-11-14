import { UserInfo } from "../../../common/base.interface";
import { SellerFeedback } from "../../../common/interfaces/seller-feedback.interface";
import SingleFeedback from "./feedback/SingleFeedback";

export default function SellerFeedbackSection({
  seller,
  feedbackList,
  totalFeedback,
}: {
  seller: UserInfo | undefined;
  feedbackList: SellerFeedback[];
  totalFeedback: number;
}) {
  return (
    <div className="w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-xl drop-shadow-md">
      <p className="text-sm pb-2">
        Đánh giá của <span className="font-semibold">{seller?.name}</span>
      </p>

      {feedbackList?.length === 0 || !feedbackList ? (
        <p className="w-full text-xs font-light py-8 text-center">
          Chưa có đánh giá
        </p>
      ) : (
        <div className="flex flex-col items-stretch justify-start gap-4">
          {feedbackList.map((feedback) => {
            return <SingleFeedback feedback={feedback} />;
          })}
          <button className="hover:underline pt-4">
            Xem thêm {totalFeedback - feedbackList.length} đánh giá
          </button>
        </div>
      )}
    </div>
  );
}
