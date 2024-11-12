import { useNavigate } from "react-router-dom";
import CurrencySplitter from "../../assistants/Spliter";
import { Comic } from "../../common/base.interface";
import { useState } from "react";

export default function ComicsSectionInChat({
  comics,
  setIsChatOpen,
}: {
  comics: Comic;
  setIsChatOpen: Function;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 w-full flex justify-between items-center mt-4 py-2 border-t rounded-b-lg drop-shadow-md bg-white transition-all duration-200">
      <div className="flex items-center gap-4 px-4">
        <img
          src={comics.coverImage}
          alt=""
          className={`${!isExpanded && "hidden"} w-[5em] rounded-lg`}
        />
        <div className="flex flex-col text-start">
          <p className="text-lg font-bold line-clamp-2">{comics.title}</p>
          <p className={`${!isExpanded && "hidden"} font-light text-sm`}>
            {comics.author}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 px-4">
        <div className="flex flex-col items-stretch gap-2">
          <button className="px-2 py-2 bg-sky-800 font-bold text-white rounded-lg duration-200 hover:bg-sky-950">
            MUA NGAY VỚI GIÁ {CurrencySplitter(comics.price)}đ
          </button>
          <button
            onClick={() => {
              setIsChatOpen(false);
              navigate(`/detail/${comics.id}`);
            }}
            className={`${
              !isExpanded && "hidden"
            } px-2 py-1 font-semibold border border-black rounded-lg duration-200 hover:bg-gray-100`}
          >
            Xem thông tin đầy đủ
          </button>
        </div>

        <button onClick={() => setIsExpanded(!isExpanded)} className="">
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M11.9999 10.8284L7.0502 15.7782L5.63599 14.364L11.9999 8L18.3639 14.364L16.9497 15.7782L11.9999 10.8284Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
