import React from "react";
import { Link } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import Countdown from "react-countdown";
import SellIcon from "@mui/icons-material/Sell";
import { Store } from "@mui/icons-material";

// Regular Comic Component
const RegularComicCard = ({ comic, countTime }) => {
  const formatPrice = (price) => {
    if (price == null) return "N/A";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  return (
    <div className="bg-white rounded-lg w-[14em] overflow-hidden border drop-shadow-md">
      <Link to={`/detail/${comic.id}`}>
        <img
          src={comic.coverImage || "/default-cover.jpg"}
          alt={comic.title}
          className="object-cover w-full h-80"
        />
        <div className="px-3 py-2">
          <div className="flex flex-row justify-between w-full gap-2 pb-2 min-h-[2em]">
            {comic?.condition === "SEALED" && (
              <span className="flex items-center gap-1 basis-1/2 px-2 rounded-2xl bg-sky-800 text-white text-[0.5em] font-light text-nowrap justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="10"
                  height="10"
                  fill="currentColor"
                >
                  <path d="M12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598L12 1ZM12 3.04879L5 4.60434V13.7889C5 15.1263 5.6684 16.3752 6.7812 17.1171L12 20.5963L17.2188 17.1171C18.3316 16.3752 19 15.1263 19 13.7889V4.60434L12 3.04879ZM16.4524 8.22183L17.8666 9.63604L11.5026 16L7.25999 11.7574L8.67421 10.3431L11.5019 13.1709L16.4524 8.22183Z" />
                </svg>
                NGUYÊN SEAL
              </span>
            )}
            {comic?.edition !== "REGULAR" && (
              <span
                className={`flex items-center gap-1 px-2 basis-1/2 py-1 rounded-2xl ${
                  comic?.edition === "SPECIAL" ? "bg-yellow-600" : "bg-red-800"
                } text-white text-[0.5em] font-light text-nowrap justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="10"
                  height="10"
                  fill="currentColor"
                >
                  <path d="M10.6144 17.7956C10.277 18.5682 9.20776 18.5682 8.8704 17.7956L7.99275 15.7854C7.21171 13.9966 5.80589 12.5726 4.0523 11.7942L1.63658 10.7219C.868536 10.381.868537 9.26368 1.63658 8.92276L3.97685 7.88394C5.77553 7.08552 7.20657 5.60881 7.97427 3.75892L8.8633 1.61673C9.19319.821767 10.2916.821765 10.6215 1.61673L11.5105 3.75894C12.2782 5.60881 13.7092 7.08552 15.5079 7.88394L17.8482 8.92276C18.6162 9.26368 18.6162 10.381 17.8482 10.7219L15.4325 11.7942C13.6789 12.5726 12.2731 13.9966 11.492 15.7854L10.6144 17.7956ZM4.53956 9.82234C6.8254 10.837 8.68402 12.5048 9.74238 14.7996 10.8008 12.5048 12.6594 10.837 14.9452 9.82234 12.6321 8.79557 10.7676 7.04647 9.74239 4.71088 8.71719 7.04648 6.85267 8.79557 4.53956 9.82234Z" />
                </svg>
                {comic?.edition === "SPECIAL" ? "BẢN ĐẶC BIỆT" : "BẢN GIỚI HẠN"}
              </span>
            )}
          </div>
          <p className="font-bold text-xl text-red-500">
            {formatPrice(comic.price)}
          </p>
          <p className="font-light text-sm">{comic.author.toUpperCase()}</p>
          <p className="font-semibold line-clamp-3 h-[4.5em]">{comic.title}</p>
          <div className="w-full flex justify-start gap-1 items-center font-light text-xs mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width={12}
              height={12}
            >
              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z" />
            </svg>
            <p className="count-time">Đăng bán từ {countTime}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Auction Comic Component
const AuctionComicCard = ({ auction, onDetailClick }) => {
  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="countdown">
        <div className="time-box">
          <span className="time1">{days.toString().padStart(2, "0")}</span>
          <span className="label">Ngày</span>
        </div>
        <div className="time-box">
          <span className="time1">{hours.toString().padStart(2, "0")}</span>
          <span className="label">Giờ</span>
        </div>
        <div className="time-box">
          <span className="time1">{minutes.toString().padStart(2, "0")}</span>
          <span className="label">Phút</span>
        </div>
        <div className="time-box">
          <span className="time1">{seconds.toString().padStart(2, "0")}</span>
          <span className="label">Giây</span>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={() => onDetailClick(auction.id)}
      className="bg-white rounded-lg w-[14em] overflow-hidden border drop-shadow-md cursor-pointer"
    >
      <img
        src={auction.comics.coverImage}
        alt={auction.comics.title}
        className="object-cover w-full h-80"
      />
      <div className="px-3 py-2">
        <div className="hidden sm:flex items-center justify-between min-h-[1.2em] w-full gap-2 my-2">
          {auction.comics.condition === "SEALED" && (
            <span className="flex items-center gap-1 basis-1/2 px-2 py-1 rounded-2xl bg-sky-800 text-white text-[0.5em] font-light text-nowrap justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="10"
                height="10"
                fill="currentColor"
              >
                <path d="M12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598L12 1ZM12 3.04879L5 4.60434V13.7889C5 15.1263 5.6684 16.3752 6.7812 17.1171L12 20.5963L17.2188 17.1171C18.3316 16.3752 19 15.1263 19 13.7889V4.60434L12 3.04879ZM16.4524 8.22183L17.8666 9.63604L11.5026 16L7.25999 11.7574L8.67421 10.3431L11.5019 13.1709L16.4524 8.22183Z" />
              </svg>
              NGUYÊN SEAL
            </span>
          )}
        </div>
        <p className="font-semibold line-clamp-2 h-[3rem]">
          {auction.comics.title}
        </p>
        <p className="font-semibold mt-2 mb-2 flex items-center justify-center">
          <span className="text-xs bg-green-100 text-green-800 px-4 py-1 rounded-full shadow-sm flex items-center gap-1 flex-nowrap whitespace-nowrap max-w-full">
            <SellIcon className="w-3 h-3" />
            {auction.status === "UPCOMING"
              ? "Giá khởi điểm: "
              : "Giá hiện tại: "}
            <span className="font-bold">
              {auction.status === "UPCOMING"
                ? auction.reservePrice.toLocaleString("vi-VN")
                : auction.currentPrice.toLocaleString("vi-VN")}
              đ
            </span>
          </span>
        </p>
        {auction.status === "ONGOING" ? (
          <>
            <p className="font-normal mt-3">KẾT THÚC TRONG</p>
            <Countdown date={new Date(auction.endTime)} renderer={renderer} />
          </>
        ) : (
          <div>
            <p className="text-center m-2 bg-orange-200 rounded-xl">
              SẮP DIỄN RA
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Seller Comics Component
const SellerComicsSection = ({ seller, comics, onNavigate }) => {
  return (
    <div className="p-6 mx-4 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outlined"
          className="flex items-center gap-2 px-4 py-2 h-auto cursor-pointer hover:bg-gray-100"
          onClick={() => comics.length > 0 && onNavigate(seller.id)}
          disabled={comics.length === 0}
        >
          <img
            src={seller.avatar || "/default-avatar.jpg"}
            alt={`${seller.name}'s avatar`}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-base font-medium">{seller.name}</span>
          <Store className="w-4 h-4 ml-2" />
        </Button>

        {comics.length > 0 && (
          <Button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => onNavigate(seller.id)}
          >
            Xem tất cả
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {comics && comics.length > 0 ? (
          comics.slice(0, 5).map((comic) => (
            <Link
              to={`/detail/${comic.id}`}
              key={comic.id}
              className="rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <div>
                <img
                  src={comic.coverImage || "/default-cover.jpg"}
                  alt={comic.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4 flex flex-col items-center">
                  <div className="h-12">
                    <p className="font-medium text-gray-800 text-center line-clamp-2">
                      {comic.title}
                    </p>
                  </div>
                  <p className="font-bold text-red-500 text-center mt-2">
                    {comic.price.toLocaleString()} đ
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500 col-span-full text-center">
            Người bán này chưa bán truyện nào
          </p>
        )}
      </div>
    </div>
  );
};

export { RegularComicCard, AuctionComicCard, SellerComicsSection };
