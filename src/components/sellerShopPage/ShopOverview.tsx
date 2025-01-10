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
    const timeList = [
      { value: days, name: "Ngày" },
      { value: hours, name: "Giờ" },
      { value: minutes, name: "Phút" },
      { value: seconds, name: "Giây" },
    ];
    return (
      <div className="flex items-center justify-center gap-1">
        {timeList.map((time) => (
          <button className="relative w-[2em] sm:w-[3em] flex flex-col items-center justify-center aspect-square border border-[#e0e0e0] rounded group-hover:border-gray-700">
            <span className="sm:text-lg font-semibold text-[#333] text-center group-hover:text-white">
              {time.value.toString().padStart(2, "0")}
            </span>
            <span className="px-1 text-[8px] sm:text-[10px] text-[#666] bg-white absolute top-0 left-1/2 -translate-y-1.5 sm:-translate-y-2 -translate-x-1/2 duration-300 group-hover:text-white group-hover:bg-black">
              {time.name}
            </span>
          </button>
        ))}
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
                id={`comics-item-${item.id}`}
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

          <div className="flex items-center justify-center gap-2">
            {comicsList.map((comics, index) => (
              <span
                key={index}
                onClick={() => {
                  const dest = document.getElementById(
                    `comics-item-${comics.id}`
                  );

                  if (dest)
                    dest.scrollIntoView({
                      block: "nearest",
                      behavior: "smooth",
                    });
                }}
                className="w-2 aspect-square rounded-full bg-gray-300"
              ></span>
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

          <div className="flex items-stretch justify-start gap-4 overflow-x-auto overflow-y-hidden p-4 snap-x snap-mandatory">
            {auctionsList.map((auction) => (
              <Link
                key={auction.id}
                id={`auction-item-${auction.id}`}
                to={`/auctiondetail/${auction.id}`}
                className="min-w-[20em] sm:min-w-[24em] w-[24em] flex items-stretch gap-1 ring-1 ring-gray-700 rounded-md p-1 snap-center snap-always duration-200 hover:bg-gray-50"
              >
                <img
                  src={auction.comics.coverImage}
                  alt={auction.comics.title}
                  className="object-cover w-[7em] sm:w-[8em] aspect-[2/3] h-fit rounded-md"
                />

                <div className="space-y-2 px-1 py-2">
                  <p className="font-semibold uppercase text-sm sm:text-base pr-1 line-clamp-4 h-[5.4em] sm:h-[5.8em]">
                    {auction.comics.title}
                  </p>

                  <div
                    className={`hidden sm:flex items-center justify-between w-full gap-2`}
                  >
                    {auction.comics.edition.isSpecial && (
                      <span
                        className={`flex items-center gap-1 px-2 basis-1/2 py-1 rounded-2xl bg-red-800 text-white text-[0.5em] font-light text-nowrap justify-center`}
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
                        {auction.comics.edition.name}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold flex items-center justify-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full shadow-sm flex items-center gap-1 text-sm flex-nowrap whitespace-nowrap max-w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                        fill="currentColor"
                      >
                        <path d="M10.9042 2.10025L20.8037 3.51446L22.2179 13.414L13.0255 22.6063C12.635 22.9969 12.0019 22.9969 11.6113 22.6063L1.71184 12.7069C1.32131 12.3163 1.32131 11.6832 1.71184 11.2926L10.9042 2.10025ZM11.6113 4.22157L3.83316 11.9997L12.3184 20.485L20.0966 12.7069L19.036 5.28223L11.6113 4.22157ZM13.7327 10.5855C12.9516 9.80448 12.9516 8.53815 13.7327 7.7571C14.5137 6.97606 15.78 6.97606 16.5611 7.7571C17.3421 8.53815 17.3421 9.80448 16.5611 10.5855C15.78 11.3666 14.5137 11.3666 13.7327 10.5855Z"></path>
                      </svg>
                      <span className="font-bold">
                        {CurrencySplitter(
                          auction.currentPrice > 0
                            ? auction.currentPrice
                            : auction.reservePrice
                        )}{" "}
                        &#8363;
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
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            {auctionsList.map((auction, index) => (
              <span
                key={index}
                onClick={() => {
                  const dest = document.getElementById(
                    `auction-item-${auction.id}`
                  );

                  if (dest)
                    dest.scrollIntoView({
                      block: "nearest",
                      behavior: "smooth",
                    });
                }}
                className="w-2 aspect-square rounded-full bg-gray-300"
              ></span>
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
