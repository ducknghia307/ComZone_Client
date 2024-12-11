/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { useNavigate } from "react-router-dom";
import { Comic, UserInfo } from "../../../common/base.interface";

export default function ComicsSeller({
  seller,
  comics,
  handleOpenChat,
  currentId,
  totalFeedback,
  averageRating,
}: {
  seller: UserInfo | undefined;
  comics: Comic | undefined;
  handleOpenChat: Function;
  currentId?: string;
  totalFeedback: number;
  averageRating?: number;
}) {
  const navigate = useNavigate();

  const isNotSeller = currentId !== seller?.id;

  return (
    <div className="w-full">
      <div className={`flex gap-2 items-center ${isNotSeller && ""}`}>
        <img
          src={
            seller?.avatar ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxfSUXtB9oG6_7ZgV3gFLrqGdkv61wqYkVVw&s"
          }
          alt=""
          onClick={() => {
            if (isNotSeller) navigate(`/seller/shop/all/${seller.id}`);
          }}
          className="w-[3em] h-[3em] rounded-full cursor-pointer duration-200 hover:scale-110"
        />
        <div className="flex flex-col justify-start gap-1">
          <p
            onClick={() => {
              if (isNotSeller) navigate(`/seller/shop/all/${seller.id}`);
            }}
            className="hover:underline cursor-pointer"
          >
            {seller?.name}
          </p>
          <div className="flex gap-2 items-center">
            {totalFeedback > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="rgba(255,242,1,1)"
                >
                  <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
                </svg>
                <p>{averageRating}</p>
              </div>
            )}
            <p className="font-light text-xs italic">
              {totalFeedback > 0
                ? `(${totalFeedback} lượt đánh giá)`
                : "(Chưa có đánh giá nào)"}
            </p>
          </div>
        </div>
        {currentId !== seller?.id && (
          <div className="ml-auto flex items-center justify-center gap-2">
            <button
              onClick={() => {
                handleOpenChat(comics);
              }}
              className="flex items-center justify-center gap-2 p-2 border rounded-xl duration-200 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"></path>
              </svg>
              Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
