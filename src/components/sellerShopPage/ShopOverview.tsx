import React, { useMemo } from "react";
import {
  SellerRecentOrderItem,
  SellerShopTabs,
} from "../../pages/SellerShopPage";
import CurrencySplitter from "../../assistants/Spliter";
import { Auction, Comic, UserInfo } from "../../common/base.interface";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { SellerFeedback } from "../../common/interfaces/seller-feedback.interface";
import { Rating } from "@mui/material";
import displayPastTimeFromNow from "../../utils/displayPastTimeFromNow";
import Countdown from "react-countdown";

export default function ShopOverview({
  seller,
  setCurrentTab,
  recentOrderItems,
  comicsList,
  auctionsList,
  feedbackList,
}: {
  seller: UserInfo;
  setCurrentTab: React.Dispatch<React.SetStateAction<SellerShopTabs>>;
  recentOrderItems: SellerRecentOrderItem[];
  comicsList: Comic[];
  auctionsList: Auction[];
  feedbackList: SellerFeedback[];
}) {
  const renderer = ({ days, hours, minutes, seconds }: any) => {
    return (
      <div className="flex items-center justify-center gap-1">
        <div className="time-box relative basis-1/4">
          <span className="time1">{days.toString().padStart(2, "0")}</span>
          <span className="label absolute top-0 left-1/2 -translate-y-2.5 -translate-x-1/2">
            Ngày
          </span>
        </div>
        <div className="time-box relative basis-1/4">
          <span className="time1">{hours.toString().padStart(2, "0")}</span>
          <span className="label absolute top-0 left-1/2 -translate-y-2.5 -translate-x-1/2">
            Giờ
          </span>
        </div>
        <div className="time-box relative basis-1/4">
          <span className="time1">{minutes.toString().padStart(2, "0")}</span>
          <span className="label absolute top-0 left-1/2 -translate-y-2.5 -translate-x-1/2">
            Phút
          </span>
        </div>
        <div className="time-box relative basis-1/4">
          <span className="time1">{seconds.toString().padStart(2, "0")}</span>
          <span className="label absolute top-0 left-1/2 -translate-y-2.5 -translate-x-1/2">
            Giây
          </span>
        </div>
      </div>
    );
  };

  const shuffleArray = (array: any[]) => {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  const shuffledList: Comic[] = useMemo(() => {
    return shuffleArray(comicsList.slice(0, 10));
  }, [comicsList]);

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

                  <span className="flex items-center gap-1 text-green-600">
                    <p className="text-sm font-semibold text-red-300 mr-2">
                      {CurrencySplitter(item.price)} đ
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                    >
                      <path d="M9 6H15C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6ZM7 6C7 3.23858 9.23858 1 12 1C14.7614 1 17 3.23858 17 6H20C20.5523 6 21 6.44772 21 7V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V7C3 6.44772 3.44772 6 4 6H7ZM5 8V20H19V8H5ZM9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10H17C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10H9Z"></path>
                    </svg>
                    <p className="text-sm font-semibold">Đã bán</p>
                  </span>
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
            {shuffledList.map((item) => (
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
                    {CurrencySplitter(item.price)}{" "}
                    <span className="underline">đ</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {auctionsList.length > 0 && (
        <div className="w-full flex flex-col gap-4 bg-white drop-shadow-lg p-4 rounded-md">
          <div className="flex items-center justify-between pr-4">
            <p className="text-xl font-semibold">
              TRUYỆN ĐANG ĐẤU GIÁ CỦA&ensp;
              <span className="font-semibold">
                <Avatar src={seller.avatar} alt="" />
                &ensp;{seller.name}
              </span>
            </p>

            <button
              onClick={() => setCurrentTab(SellerShopTabs.AUCTIONS)}
              className="font-semibold text-sky-800 underline duration-200 hover:brightness-50"
            >
              Xem tất cả
            </button>
          </div>

          <div className="flex items-stretch gap-4 overflow-x-auto overflow-y-hidden p-4 snap-x snap-mandatory">
            {auctionsList.map((auction) => (
              <Link
                to={`/auctiondetail/${auction.id}`}
                className="min-w-[22em] w-[22em] flex items-stretch gap-1 ring-1 ring-gray-700 rounded-md p-1 snap-center snap-always duration-200 hover:bg-gray-50"
                key={auction.id}
              >
                <img
                  src={auction.comics.coverImage}
                  alt={auction.comics.title}
                  className="object-cover w-[8em] aspect-[2/3] rounded-md"
                />

                <div className="px-1 py-2">
                  <div
                    className={`hidden sm:flex items-center justify-between w-full gap-2 mb-2`}
                  >
                    {auction.comics.condition === "SEALED" && (
                      <span className="flex items-center gap-1 basis-1/2 px-2 py-1 rounded-2xl bg-sky-800 text-white text-[0.5em] font-light text-nowrap justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="10"
                          height="10"
                          fill="currentColor"
                        >
                          <path d="M12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598L12 1ZM12 3.04879L5 4.60434V13.7889C5 15.1263 5.6684 16.3752 6.7812 17.1171L12 20.5963L17.2188 17.1171C18.3316 16.3752 19 15.1263 19 13.7889V4.60434L12 3.04879ZM16.4524 8.22183L17.8666 9.63604L11.5026 16L7.25999 11.7574L8.67421 10.3431L11.5019 13.1709L16.4524 8.22183Z"></path>
                        </svg>
                        NGUYÊN SEAL
                      </span>
                    )}
                    {auction.comics.edition !== "REGULAR" && (
                      <span
                        className={`flex items-center gap-1 px-2 basis-1/2 py-1 rounded-2xl ${
                          auction.comics?.edition === "SPECIAL"
                            ? "bg-yellow-600"
                            : "bg-red-800"
                        } text-white text-[0.5em] font-light text-nowrap justify-center`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="10"
                          height="10"
                          fill="currentColor"
                        >
                          <path d="M10.6144 17.7956C10.277 18.5682 9.20776 18.5682 8.8704 17.7956L7.99275 15.7854C7.21171 13.9966 5.80589 12.5726 4.0523 11.7942L1.63658 10.7219C.868536 10.381.868537 9.26368 1.63658 8.92276L3.97685 7.88394C5.77553 7.08552 7.20657 5.60881 7.97427 3.75892L8.8633 1.61673C9.19319.821767 10.2916.821765 10.6215 1.61673L11.5105 3.75894C12.2782 5.60881 13.7092 7.08552 15.5079 7.88394L17.8482 8.92276C18.6162 9.26368 18.6162 10.381 17.8482 10.7219L15.4325 11.7942C13.6789 12.5726 12.2731 13.9966 11.492 15.7854L10.6144 17.7956ZM4.53956 9.82234C6.8254 10.837 8.68402 12.5048 9.74238 14.7996 10.8008 12.5048 12.6594 10.837 14.9452 9.82234 12.6321 8.79557 10.7676 7.04647 9.74239 4.71088 8.71719 7.04648 6.85267 8.79557 4.53956 9.82234ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899ZM18.3745 19.0469 18.937 18.4883 19.4878 19.0469 18.937 19.5898 18.3745 19.0469Z"></path>
                        </svg>
                        {auction.comics.edition === "SPECIAL"
                          ? "BẢN ĐẶC BIỆT"
                          : "BẢN GIỚI HẠN"}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold flex items-center justify-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full shadow-sm flex items-center gap-1 text-sm flex-nowrap whitespace-nowrap max-w-full">
                      Giá hiện tại:{" "}
                      <span className="font-bold">
                        {auction.currentPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </span>
                  </p>

                  {auction.status === "ONGOING" ? (
                    <div className="flex flex-col gap-1 p-2">
                      <p className="text-xs py-1">KẾT THÚC TRONG</p>
                      <Countdown
                        date={new Date(auction.endTime)}
                        renderer={renderer}
                      />
                    </div>
                  ) : (
                    <p className="text-center m-2 REM bg-orange-200 py-1 rounded-xl">
                      SẮP DIỄN RA
                    </p>
                  )}

                  <p className="font-semibold uppercase text-sm sm:text-base pr-1 line-clamp-4 h-[5.4em] sm:h-[5.8em]">
                    {auction.comics.title}
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
