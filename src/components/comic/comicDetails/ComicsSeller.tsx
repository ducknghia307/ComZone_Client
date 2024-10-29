import React, { useState } from "react";
import { Comic, UserInfo } from "../../../common/base.interface";
import CurrencySplitter from "../../../assistants/Spliter";

export default function ComicsSellerAndButtons({
  seller,
  currentComics,
}: {
  seller: UserInfo | undefined;
  currentComics: Comic | undefined;
}) {
  const [addedToCart, toggleAddedToCart] = useState<boolean>(false);

  return (
    <div className="w-[30%] max-w-[40em] bg-white px-4 py-4 rounded-xl drop-shadow-md top-4 sticky">
      <div className="flex gap-2 items-center border-b pb-4">
        <img
          src={
            seller?.avatar ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxfSUXtB9oG6_7ZgV3gFLrqGdkv61wqYkVVw&s"
          }
          alt=""
          className="w-[3em] h-[3em] rounded-full"
        />
        <div className="flex flex-col justify-start gap-1">
          <p>{seller?.name}</p>
          <p className="font-light text-xs italic">(Chưa có đánh giá nào)</p>
        </div>
        <div className="ml-auto flex items-center justify-center gap-2">
          <button className="flex flex-col items-center justify-center p-2 border rounded-xl duration-200 hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M3 6H21V18H3V6ZM2 4C1.44772 4 1 4.44772 1 5V19C1 19.5523 1.44772 20 2 20H22C22.5523 20 23 19.5523 23 19V5C23 4.44772 22.5523 4 22 4H2ZM13 9H19V11H13V9ZM18 13H13V15H18V13ZM6 13H7V16H9V11H6V13ZM9 8H7V10H9V8Z"></path>
            </svg>
          </button>
          <button className="flex flex-col items-center justify-center p-2 border rounded-xl duration-200 hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 py-4">
        <div className="w-full flex items-center justify-between">
          <p>Số lượng:</p>
          <p className="font-semibold">{currentComics?.quantity}</p>
        </div>
        <div className="w-full flex flex-col items-start justify-between">
          <p>Tạm tính:</p>
          <p className="font-medium text-[3em] flex items-start gap-1">
            {currentComics?.price
              ? CurrencySplitter(currentComics?.price!)
              : ""}
            <span className="font-light text-[0.5em] underline">đ</span>
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <button className="w-full px-4 py-2 bg-red-500 rounded-md text-white text-[1.2em] duration-200 hover:bg-red-600">
          MUA NGAY
        </button>
        <button
          className={`w-full flex items-center justify-center gap-4 px-4 py-2 border ${
            addedToCart
              ? "bg-green-600 text-white hover:bg-green-700 duration-200"
              : "border-gray-400 hover:bg-gray-100 duration-500"
          }  rounded-md text-[1.2em]`}
          onClick={() => toggleAddedToCart(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            {addedToCart ? (
              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z"></path>
            ) : (
              <path d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"></path>
            )}
          </svg>
          {!addedToCart && "THÊM VÀO GIỎ HÀNG"}
        </button>
      </div>
    </div>
  );
}
