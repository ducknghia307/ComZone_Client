import React from "react";
import { Auction } from "../../common/base.interface";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import CurrencySplitter from "../../assistants/Spliter";

export default function RecentAuctions({
  auctionList,
}: {
  auctionList: { ongoing: Auction[]; upcoming: Auction[] };
}) {
  const navigate = useNavigate();

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
          <button className="relative w-[3em] flex flex-col items-center justify-center aspect-square border border-[#e0e0e0] rounded group-hover:border-gray-700">
            <span className="sm:text-lg font-semibold text-[#333] text-center group-hover:text-white">
              {time.value.toString().padStart(2, "0")}
            </span>
            <span className="text-[8px] sm:text-[10px] text-[#666] absolute top-0 left-1/2 -translate-y-2 -translate-x-1/2 group-hover:text-white">
              {time.name}
            </span>
          </button>
        ))}
      </div>
    );
  };

  if (
    !auctionList ||
    (auctionList.ongoing.length === 0 && auctionList.upcoming.length === 0)
  )
    return;

  return (
    <div className="w-full flex flex-col items-center gap-8 mx-auto px-4 md:px-0">
      <p className="uppercase text-xl sm:text-[1.8em] font-semibold">
        Truyện đấu giá gần đây
      </p>

      <div className="w-full md:w-1/2 flex justify-end items-center">
        <button
          onClick={() => {
            navigate("/auctions");
          }}
          className="flex items-center justify-end gap-2 font-light hover:underline hover:text-gray-600"
        >
          Xem tất cả
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M1.99974 13.0001L1.9996 11.0002L18.1715 11.0002L14.2218 7.05044L15.636 5.63623L22 12.0002L15.636 18.3642L14.2218 16.9499L18.1716 13.0002L1.99974 13.0001Z"></path>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-start gap-2">
        {auctionList.ongoing
          ?.concat(auctionList.upcoming || [])
          .map((auction) => (
            <button
              key={auction.id}
              onClick={() => {
                navigate(`/auctiondetail/${auction.id}`);
              }}
              className="group bg-white rounded-lg w-[10em] sm:w-[14em] overflow-hidden border drop-shadow-md cursor-pointer m-auto duration-200"
            >
              <img
                src={auction.comics.coverImage}
                alt={auction.comics.title}
                className="object-cover w-full aspect-[2/3] duration-200 group-hover:brightness-110"
              />

              <div className="space-y-3 px-1 py-2 duration-300 group-hover:bg-black group-hover:text-white">
                <p className="uppercase font-semibold line-clamp-3 h-[4.5rem]">
                  {auction.comics.title}
                </p>
                <p className="font-semibold mt-2 mb-2 flex items-center justify-center">
                  <span className="px-2 py-1 border-y font-bold border-gray-400 flex items-center gap-1 text-sm text-black group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 group-hover:rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="currentColor"
                    >
                      <path d="M10.9042 2.10025L20.8037 3.51446L22.2179 13.414L13.0255 22.6063C12.635 22.9969 12.0019 22.9969 11.6113 22.6063L1.71184 12.7069C1.32131 12.3163 1.32131 11.6832 1.71184 11.2926L10.9042 2.10025ZM11.6113 4.22157L3.83316 11.9997L12.3184 20.485L20.0966 12.7069L19.036 5.28223L11.6113 4.22157ZM13.7327 10.5855C12.9516 9.80448 12.9516 8.53815 13.7327 7.7571C14.5137 6.97606 15.78 6.97606 16.5611 7.7571C17.3421 8.53815 17.3421 9.80448 16.5611 10.5855C15.78 11.3666 14.5137 11.3666 13.7327 10.5855Z"></path>
                    </svg>
                    <p>
                      {CurrencySplitter(
                        auction.currentPrice > 0
                          ? auction.currentPrice
                          : auction.reservePrice
                      )}{" "}
                      &#8363;
                    </p>
                  </span>
                </p>
                <p className="uppercase text-sm font-semibold">
                  Kết thúc trong
                </p>
                <Countdown
                  date={new Date(auction.endTime)}
                  renderer={renderer}
                />
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
