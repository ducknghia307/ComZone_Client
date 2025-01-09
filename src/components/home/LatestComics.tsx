import React, { useEffect, useRef, useState } from "react";
import { Comic } from "../../common/base.interface";
import CurrencySplitter from "../../assistants/Spliter";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";

export default function LatestComics({ comicsList }: { comicsList: Comic[] }) {
  const [currentComics, setCurrentComics] = useState<Comic>(comicsList[0]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentComics(comicsList[currentIndex]);
  }, [comicsList, currentIndex]);

  if (!comicsList || comicsList.length === 0 || !currentComics) return;

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center gap-8 mx-auto px-8 md:px-0">
      <p className="uppercase text-xl sm:text-[1.8em] font-semibold">
        Truyện mới đăng bán
      </p>

      <div className="w-full flex justify-end items-center">
        <button
          onClick={() => {
            navigate("/genres");
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

      <div
        className={`w-full self-stretch flex flex-col-reverse sm:flex-row items-center justify-center gap-4`}
      >
        {currentComics && (
          <div className="grow self-stretch flex flex-col items-center justify-center gap-2 text-center p-2 sm:border-2 sm:border-gray-600 rounded-lg relative sm:text-white">
            <div
              className="hidden sm:inline absolute inset-0 -z-10 bg-cover bg-center blur-[2px] brightness-[0.25]"
              style={{ backgroundImage: `url(${currentComics.coverImage})` }}
            ></div>

            <span className="sm:max-w-[30em] sm:self-center flex flex-col items-start justify-start gap-4">
              <button
                onClick={() =>
                  navigate(`/seller/shop/all/${currentComics.sellerId.id}`)
                }
                className="hidden sm:flex items-center gap-2 group/seller hover:opacity-80"
              >
                <Avatar
                  src={currentComics.sellerId.avatar}
                  size={40}
                  className="ring-2 ring-white"
                />
                <p className="font-semibold group-hover/seller:underline">
                  {currentComics.sellerId.name}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M21 13V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V13H2V11L3 6H21L22 11V13H21ZM5 13V19H19V13H5ZM4.03961 11H19.9604L19.3604 8H4.63961L4.03961 11ZM6 14H14V17H6V14ZM3 3H21V5H3V3Z"></path>
                </svg>
              </button>

              <p
                onClick={() => navigate(`/detail/${currentComics.id}`)}
                className="self-center text-center font-semibold text-lg sm:text-[1.5em] uppercase line-clamp-2 h-[2.8em] sm:h-[2.2em] cursor-pointer hover:underline"
              >
                {currentComics.title}
              </p>
            </span>

            <p className="font-light text-sm sm:text-base uppercase">
              {currentComics.author}
            </p>

            <p className="font-semibold sm:text-lg bg-red-600 text-white px-4 py-1 rounded">
              {CurrencySplitter(currentComics.price)} &#8363;
            </p>

            <span className="hidden sm:inline">
              <p className="px-4 text-start text-sm font-light line-clamp-6 h-[10em]">
                {currentComics.description}
              </p>
            </span>

            <button
              onClick={() => navigate(`/detail/${currentComics.id}`)}
              className="self-stretch px-4 py-2 sm:mt-8 rounded flex items-center justify-center gap-2 font-semibold bg-transparent border border-black sm:border-white duration-200 hover:bg-white hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M15.5 5C13.567 5 12 6.567 12 8.5C12 10.433 13.567 12 15.5 12C17.433 12 19 10.433 19 8.5C19 6.567 17.433 5 15.5 5ZM10 8.5C10 5.46243 12.4624 3 15.5 3C18.5376 3 21 5.46243 21 8.5C21 9.6575 20.6424 10.7315 20.0317 11.6175L22.7071 14.2929L21.2929 15.7071L18.6175 13.0317C17.7315 13.6424 16.6575 14 15.5 14C12.4624 14 10 11.5376 10 8.5ZM3 4H8V6H3V4ZM3 11H8V13H3V11ZM21 18V20H3V18H21Z"></path>
              </svg>
              Xem truyện
            </button>
          </div>
        )}

        <div className="w-[15em] sm:min-w-[20em] sm:max-w-[20em] mx-auto">
          {currentComics && (
            <div
              onClick={() => navigate(`/detail/${currentComics.id}`)}
              className="w-full sm:max-w-full aspect-[2/3] self-center bg-cover bg-no-repeat bg-center rounded-lg duration-300 transition-all overflow-hidden cursor-pointer hover:brightness-90"
              style={{ backgroundImage: `url(${currentComics.coverImage})` }}
            />
          )}
        </div>
      </div>

      <div className="self-stretch flex items-center justify-between gap-4">
        <button
          onClick={() => {
            let prevIndex: number;
            if (currentIndex === 0) prevIndex = comicsList.length - 1;
            else prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
          }}
          className={`flex items-center gap-2 rounded p-2 duration-200 hover:underline hover:opacity-70`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
          </svg>
          Trước
        </button>

        <button
          onClick={() => {
            let prevIndex: number;
            if (currentIndex === comicsList.length - 1) prevIndex = 0;
            else prevIndex = currentIndex + 1;
            setCurrentIndex(prevIndex);
          }}
          className={`flex items-center gap-2 rounded p-2 duration-200 hover:underline hover:opacity-70`}
        >
          Tiếp
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
          </svg>
        </button>
      </div>

      <div
        className={`self-center max-w-[50em] flex items-center justify-center gap-1 sm:gap-3 overflow-hidden`}
      >
        {comicsList.map((comics, index) => (
          <img
            key={comics.id}
            src={comics.coverImage}
            alt=""
            onClick={() => {
              setCurrentComics(comics);
              setCurrentIndex(index);
            }}
            className={`w-1/12 aspect-[2/3] object-cover rounded transition-all duration-300 ${
              currentComics.id === comics.id
                ? "scale-110 sm:scale-125"
                : "opacity-30 cursor-pointer hover:scale-110 hover:opacity-70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
