import { UserInfo } from "../../../common/base.interface";

export default function SellerFeedbackSection({
  seller,
  feedbackList,
}: {
  seller: UserInfo | undefined;
  feedbackList: [] | undefined;
}) {
  return (
    <div className="w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-xl drop-shadow-md">
      <p className="text-sm pb-2">
        Đánh giá của <span className="font-semibold">{seller?.name}</span>
      </p>

      {(feedbackList?.length === 0 || !feedbackList) && (
        <p className="w-full text-xs font-light py-8 text-center">Chưa có đánh giá</p>
      )}
    </div>
  );
}
