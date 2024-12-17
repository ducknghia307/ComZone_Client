import { Avatar } from "antd";
import React, { useState } from "react";
import { SellerDetails } from "../../common/base.interface";
import moment from "moment/min/moment-with-locales";
import { SellerShopTabs } from "../../pages/SellerShopPage";
import ChatModal from "../../pages/ChatModal";
import { privateAxios } from "../../middleware/axiosInstance";

moment.locale("vi");

export default function SellerShopHeader({
  currentSeller,
  totalFeedback,
  averageRating,
  currentTab,
  setCurrentTab,
  searchInput,
  handleSearchSellerComics,
  searchSellerAvailableComics,
  setIsLoading,
}: {
  currentSeller: SellerDetails;
  totalFeedback: number;
  averageRating: number;
  currentTab: SellerShopTabs;
  setCurrentTab: React.Dispatch<React.SetStateAction<SellerShopTabs>>;
  searchInput: string;
  handleSearchSellerComics: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchSellerAvailableComics: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleChatWithSeller = async () => {
    setIsLoading(true);
    await privateAxios
      .post("chat-rooms/seller", {
        sellerId: currentSeller.user.id,
      })
      .then((res) => {
        console.log(res.data);
        setIsChatOpen(true);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col gap-4 bg-white ring-2 ring-black p-4 rounded-md">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar
          src={currentSeller.user.avatar}
          alt=""
          size={96}
          className="ring-2 ring-white"
        />

        <div className="flex flex-col gap-1 items-center sm:items-start">
          <p className="text-xl font-semibold">{currentSeller.user.name}</p>

          <div className="flex gap-2 items-center justify-between divide-x">
            <p className="text-sm font-light italic">
              {currentSeller.user.isActive ? (
                <span className="flex items-center gap-1">
                  <span className="p-[0.2em] bg-green-500 rounded-full" />
                  <p>Đang hoạt động</p>
                </span>
              ) : (
                `Hoạt động ${moment(currentSeller.user.last_active).fromNow()}`
              )}
            </p>

            {totalFeedback > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm px-2">
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

            <p className="font-light text-sm text-center italic px-2">
              {totalFeedback > 0
                ? `${totalFeedback} lượt đánh giá`
                : "(Chưa có đánh giá nào)"}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              className="-translate-y-0.5"
            >
              <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"></path>
            </svg>
            <p className="text-sm font-light">{currentSeller.province.name}</p>
          </div>
        </div>

        <button
          onClick={handleChatWithSeller}
          className="flex items-center gap-1 text-lg border border-gray-400 px-8 sm:px-2 py-1 rounded-md duration-200 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242ZM7.58075 18.711L8.23428 19.0605C9.38248 19.6745 10.6655 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 13.3345 4.32549 14.6175 4.93949 15.7657L5.28896 16.4192L4.63416 19.3658L7.58075 18.711Z"></path>
          </svg>
          Chat với người bán
        </button>
      </div>

      <div className="w-full flex flex-col md:flex-row items-stretch justify-between gap-4">
        <div className="basis-2/3 relative min-w-fit flex items-stretch justify-between gap-1 text-lg">
          <button
            onClick={() => setCurrentTab(SellerShopTabs.ALL)}
            className={`grow px-2 ${
              currentTab === SellerShopTabs.ALL
                ? "font-semibold bg-black text-white"
                : "border border-gray-200 duration-200 hover:bg-gray-100"
            } rounded-md text-sm sm:text-base`}
          >
            Tổng Quan
          </button>

          <button
            onClick={() => setCurrentTab(SellerShopTabs.COMICS)}
            className={`grow px-2 ${
              currentTab === SellerShopTabs.COMICS
                ? "font-semibold bg-black text-white"
                : "border border-gray-200 duration-200 hover:bg-gray-100"
            } rounded-md text-sm sm:text-base`}
          >
            Truyện Đang Bán
          </button>

          <button
            onClick={() => setCurrentTab(SellerShopTabs.AUCTIONS)}
            className={`grow px-2 ${
              currentTab === SellerShopTabs.AUCTIONS
                ? "font-semibold bg-black text-white"
                : "border border-gray-200 duration-200 hover:bg-gray-100"
            } rounded-md text-sm sm:text-base`}
          >
            Các Cuộc Đấu Giá
          </button>

          <button
            onClick={() => setCurrentTab(SellerShopTabs.FEEDBACK)}
            className={`grow px-2 ${
              currentTab === SellerShopTabs.FEEDBACK
                ? "font-semibold bg-black text-white"
                : "border border-gray-200 duration-200 hover:bg-gray-100"
            } rounded-md text-sm sm:text-base`}
          >
            Đánh Giá
          </button>
        </div>

        <div className="grow relative text-black">
          <input
            type="text"
            placeholder="Tìm kiếm truyện..."
            className="w-full border border-gray-300 rounded-md px-2 py-1 pl-8 font-light"
            value={searchInput}
            onChange={handleSearchSellerComics}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchInput.length > 0) {
                searchSellerAvailableComics();
              }
            }}
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            className="absolute top-1/2 -translate-y-1/2 left-2"
          >
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
          </svg>
        </div>
      </div>

      <ChatModal isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </div>
  );
}
