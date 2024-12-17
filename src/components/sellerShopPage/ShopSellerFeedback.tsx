import { SellerFeedback } from "../../common/interfaces/seller-feedback.interface";
import { UserInfo } from "../../common/base.interface";
import { Avatar } from "antd";
import { Rating } from "@mui/material";
import displayPastTimeFromNow from "../../utils/displayPastTimeFromNow";

export default function ShopSellerFeedback({
  seller,
  feedbackList,
  totalFeedback,
}: {
  seller: UserInfo;
  feedbackList: SellerFeedback[];
  totalFeedback: number;
}) {
  return (
    <div className="w-full flex flex-col gap-4 bg-white drop-shadow-lg p-4 rounded-md">
      <p className="text-[1.5em] font-bold uppercase">
        Tất cả đánh giá{" "}
        {feedbackList.length > 0 && (
          <span className="font-light text-[0.8em] normal-case">
            (Tổng {feedbackList.length} đánh giá)
          </span>
        )}
      </p>

      {feedbackList?.length === 0 || !feedbackList ? (
        <p className="w-full italic font-light py-8 text-center">
          Chưa có đánh giá
        </p>
      ) : (
        <div className="flex flex-col items-stretch justify-start gap-4">
          {feedbackList.map((feedback) => (
            <div key={feedback.id} className="flex flex-col px-4 py-2">
              <div className="flex items-center gap-2">
                <Avatar src={feedback.user.avatar} size={48} />

                <div className="flex flex-col items-start justify-center">
                  <p className="text-x">{feedback.user.name}</p>
                  <p className="font-light text-[0.65em]">
                    {displayPastTimeFromNow(feedback.createdAt)}
                  </p>
                  <Rating
                    value={feedback.rating}
                    size="small"
                    readOnly
                    className="mt-1"
                  />
                </div>
              </div>

              <p className="px-4 py-2 font-light text-sm">{feedback.comment}</p>

              <div className="grid grid-cols-[repeat(auto-fill,10em)] gap-1 px-4 mt-4">
                {feedback.attachedImages?.map((img, index) => {
                  return <img key={index} src={img} className="rounded-md" />;
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
