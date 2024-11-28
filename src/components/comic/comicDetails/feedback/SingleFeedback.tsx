import { Avatar, Image } from "antd";
import { SellerFeedback } from "../../../../common/interfaces/seller-feedback.interface";
import moment from "moment/min/moment-with-locales";
import { Rating } from "@mui/material";

moment.locale("vi");

export default function SingleFeedback({
  feedback,
}: {
  feedback: SellerFeedback;
}) {
  return (
    <div key={feedback.id} className="flex flex-col px-4 py-2">
      <div className="flex items-center gap-2">
        <Avatar src={feedback.user.avatar} size={48} />

        <div className="flex flex-col items-start justify-center">
          <p className="text-x">{feedback.user.name}</p>
          <p className="font-light text-[0.65em]">
            {moment(feedback.createdAt).fromNow()}
          </p>
        </div>

        <Rating value={feedback.rating} size="small" readOnly />
      </div>

      <p className="px-4 py-2 font-light text-sm">{feedback.comment}</p>

      <div className="flex items-stretch gap-1">
        <Avatar.Group shape="square" max={{ count: 4 }}>
          {feedback.attachedImages?.map((img, index) => {
            return <Image key={index} src={img} width={100} />;
          })}
        </Avatar.Group>
      </div>
    </div>
  );
}
