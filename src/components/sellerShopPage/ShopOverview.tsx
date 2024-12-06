import React from "react";
import {
  SellerRecentOrderItem,
  SellerShopTabs,
} from "../../pages/SellerShopPage";
import CurrencySplitter from "../../assistants/Spliter";
import { Comic, UserInfo } from "../../common/base.interface";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { SellerFeedback } from "../../common/interfaces/seller-feedback.interface";
import { Rating } from "@mui/material";
import displayPastTimeFromNow from "../../utils/displayPastTimeFromNow";

export default function ShopOverview({
  seller,
  setCurrentTab,
  recentOrderItems,
  comicsList,
  feedbackList,
}: {
  seller: UserInfo;
  setCurrentTab: React.Dispatch<React.SetStateAction<SellerShopTabs>>;
  recentOrderItems: SellerRecentOrderItem[];
  comicsList: Comic[];
  feedbackList: SellerFeedback[];
}) {
  return (
    <div className="w-full flex flex-col gap-4">
      {recentOrderItems.length > 0 && (
        <div className="w-full flex flex-col gap-4 bg-white drop-shadow-lg p-4 rounded-md">
          <p className="text-xl font-semibold">TRUYỆN ĐƯỢC MUA GẦN ĐÂY</p>

          <div className="flex items-stretch gap-4 overflow-x-auto overflow-y-hidden p-4 snap-x snap-mandatory">
            {recentOrderItems.map((item) => (
              <div className="min-w-[20em] w-[20em] flex items-stretch gap-4 ring-1 ring-gray-700 rounded-md p-1 snap-center snap-always">
                <img
                  src={item.comics.coverImage}
                  alt=""
                  className="w-1/4 rounded-md"
                />

                <div className="flex flex-col justify-center">
                  <p className="font-semibold uppercase line-clamp-3">
                    {item.comics.title}
                  </p>
                  <p className="text-sm font-light uppercase">
                    {item.comics.author}
                  </p>
                  <p className="text-sm font-semibold text-red-600">
                    {CurrencySplitter(item.price)} đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {comicsList.length > 0 && (
        <div className="w-full flex flex-col gap-4 bg-white drop-shadow-lg p-4 rounded-md">
          <div className="flex items-center justify-between pr-4">
            <p className="text-xl font-semibold">
              TRUYỆN ĐANG BÁN CỦA&ensp;
              <span className="font-semibold">
                <Avatar src={seller.avatar} alt="" />
                &ensp;{seller.name}
              </span>
            </p>

            <button
              onClick={() => setCurrentTab(SellerShopTabs.COMICS)}
              className="font-semibold text-sky-800 underline duration-200 hover:brightness-50"
            >
              Xem tất cả
            </button>
          </div>

          <div className="flex items-stretch gap-4 overflow-x-auto overflow-y-hidden p-4 snap-x snap-mandatory">
            {comicsList.map((item) => (
              <Link
                to={`/detail/${item.id}`}
                className="min-w-[20em] w-[20em] flex items-stretch gap-4 ring-1 ring-gray-700 rounded-md p-1 snap-center snap-always duration-200 hover:bg-gray-200"
              >
                <img
                  src={item.coverImage}
                  alt=""
                  className="w-1/4 rounded-md"
                />

                <div className="flex flex-col justify-center">
                  <p className="font-semibold uppercase line-clamp-3">
                    {item.title}
                  </p>
                  <p className="text-sm font-light uppercase">{item.author}</p>
                  <p className="text-sm font-semibold text-red-600">
                    {CurrencySplitter(item.price)} đ
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {feedbackList.length > 0 && (
        <div className="w-full flex flex-col gap-4 bg-white drop-shadow-lg p-4 rounded-md">
          <div className="flex items-center justify-between pr-4">
            <p className="text-xl font-semibold">ĐÁNH GIÁ CỦA NGƯỜI DÙNG</p>

            <button
              onClick={() => setCurrentTab(SellerShopTabs.FEEDBACK)}
              className="font-semibold text-sky-800 underline duration-200 hover:brightness-50"
            >
              Xem tất cả
            </button>
          </div>

          <div className="flex items-start gap-4 overflow-x-auto overflow-y-hidden p-4 snap-x snap-mandatory">
            {feedbackList.map((feedback) => (
              <div className="min-w-[20em] w-[50em] flex items-stretch gap-4 ring-1 ring-gray-700 rounded-md p-1 snap-center snap-always">
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

                  <p className="pl-4 my-2 font-light text-sm line-clamp-5">
                    {feedback.comment}
                  </p>

                  <Avatar.Group className="pl-4 grid grid-cols-[repeat(auto-fill,7em)] items-stretch">
                    {feedback.attachedImages?.slice(0, 4).map((img, index) => {
                      return (
                        <img
                          key={index}
                          src={img}
                          className="w-full h-[10em] object-cover rounded-md border"
                        />
                      );
                    })}
                  </Avatar.Group>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
