import { useEffect, useState } from "react";
import { Auction } from "../../common/base.interface";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";

export default function ShopAuctionsList({
  auctionsList,
}: {
  auctionsList: Auction[];
}) {
  const [currentList, setCurrentList] = useState<Auction[]>(auctionsList || []);
  const [auctionSearch, setAuctionSearch] = useState("");

  useEffect(() => {
    setCurrentList(auctionsList);
  }, [auctionsList]);

  const handleSearchAuctions = () => {
    setCurrentList(
      auctionsList.filter(
        (auction) =>
          auction.comics.title
            .toLowerCase()
            .includes(auctionSearch.toLowerCase()) ||
          auction.comics.author
            .toLowerCase()
            .includes(auctionSearch.toLowerCase())
      )
    );
  };

  const navigate = useNavigate();

  const renderer = ({ days, hours, minutes, seconds }: any) => {
    return (
      <div className="flex items-center gap-1">
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
          <span className="time1 w-full">
            {seconds.toString().padStart(2, "0")}
          </span>
          <span className="label absolute top-0 left-1/2 -translate-y-2.5 -translate-x-1/2 bg-white">
            Giây
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-white drop-shadow-lg p-4 rounded-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[1.5em] font-bold">
          TẤT CẢ CUỘC ĐẤU GIÁ{" "}
          {auctionsList.length > 0 && (
            <span className="font-light text-[0.8em]">
              (Tổng {auctionsList.length} cuộc đấu giá)
            </span>
          )}
        </p>

        <div className="basis-1 sm:basis-1/3 relative text-black">
          <input
            type="text"
            placeholder="Tìm kiếm truyện đấu giá..."
            className="w-full border border-gray-300 rounded-md px-2 py-1 pl-8 font-light"
            value={auctionSearch}
            onChange={(e) => {
              setAuctionSearch(e.target.value);
              if (e.target.value.length === 0) setCurrentList(auctionsList);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && auctionSearch.length > 0) {
                handleSearchAuctions();
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

      {currentList.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,14em)] justify-center gap-1 sm:gap-4">
          {currentList.map((auction) => {
            return (
              <div
                className="bg-white rounded-lg w-full sm:w-[14em] overflow-hidden border drop-shadow-md cursor-pointer space-y-2"
                key={auction.id}
                onClick={() => {
                  navigate(`/auctiondetail/${auction.id}`);
                }}
              >
                <img
                  src={auction.comics.coverImage}
                  alt={auction.comics.title}
                  className="object-cover w-full aspect-[2/3]"
                />
                <div className="px-1 phone:px-3 py-2">
                  <div
                    className={`hidden sm:flex items-center justify-between w-full gap-2`}
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
                    <>
                      <p className="font-medium py-1">KẾT THÚC TRONG</p>
                      <Countdown
                        date={new Date(auction.endTime)}
                        renderer={renderer}
                      />
                    </>
                  ) : (
                    <p className="text-center m-2 REM bg-orange-200 py-1 rounded-xl">
                      SẮP DIỄN RA
                    </p>
                  )}

                  <p className="font-semibold text-sm sm:text-xl line-clamp-3 h-[4.4em]">
                    {auction.comics.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full py-[10vh] flex flex-col items-center justify-center gap-2">
          <p className="uppercase text-lg opacity-40">
            Không có cuộc đấu giá nào
          </p>
        </div>
      )}
    </div>
  );
}
