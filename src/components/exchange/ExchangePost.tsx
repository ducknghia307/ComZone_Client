import { useState } from "react";
import SingleOfferedComics from "./SingleOfferedComics";
import RequestedComicsSection from "./RequestedComicsSection";
import styles from "./style.module.css";
import { Exchange } from "../../common/interfaces/exchange.interface";
import moment from "moment/min/moment-with-locales";
import dateFormat from "../../assistants/date.format";

moment.locale("vi");

export default function ExchangePost({
  exchange,
  refs,
  index,
  handleOpenChat,
}: {
  exchange: Exchange;
  refs: any[];
  index: number;
  handleOpenChat: Function;
}) {
  const [currentlySelected, setCurrentlySelected] = useState<number>(-1);

  const handleSelect = (value: number) => {
    if (currentlySelected === value) setCurrentlySelected(-1);
    else setCurrentlySelected(value);
  };

  const checkTimeDisplay =
    exchange.createdAt &&
    moment(new Date()).unix() - moment(exchange.createdAt).unix() > 172800;

  return (
    <div className="w-full flex rounded-lg px-4 max-w-[100em] bg-white drop-shadow-md">
      <div className="grow flex flex-col min-w-[30em] px-2 py-4">
        <div className="w-full flex items-center gap-4">
          <img
            src={
              exchange.requestUser.avatar ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/911/740/small/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
            }
            className="w-[4em] h-[4em] rounded-full"
          />
          <div className="flex flex-col items-start gap-1">
            <p className="font-semibold text-lg tracking-wide">
              {exchange.requestUser.name}
            </p>
            <p className="font-light text-[0.7em] tracking-wider">
              {checkTimeDisplay ? (
                <span>
                  {dateFormat(exchange.createdAt, "dd/mm/yy")} &#8226;{" "}
                  {dateFormat(exchange.createdAt, "HH:MM")}
                </span>
              ) : (
                moment(exchange.createdAt).calendar()
              )}
            </p>
          </div>
          <span
            className={`${
              exchange.requestUser.role !== "SELLER" && "hidden"
            } flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500 text-white`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="currentColor"
            >
              <path d="M14 4.4375C15.3462 4.4375 16.4375 3.34619 16.4375 2H17.5625C17.5625 3.34619 18.6538 4.4375 20 4.4375V5.5625C18.6538 5.5625 17.5625 6.65381 17.5625 8H16.4375C16.4375 6.65381 15.3462 5.5625 14 5.5625V4.4375ZM1 11C4.31371 11 7 8.31371 7 5H9C9 8.31371 11.6863 11 15 11V13C11.6863 13 9 15.6863 9 19H7C7 15.6863 4.31371 13 1 13V11ZM4.87601 12C6.18717 12.7276 7.27243 13.8128 8 15.124 8.72757 13.8128 9.81283 12.7276 11.124 12 9.81283 11.2724 8.72757 10.1872 8 8.87601 7.27243 10.1872 6.18717 11.2724 4.87601 12ZM17.25 14C17.25 15.7949 15.7949 17.25 14 17.25V18.75C15.7949 18.75 17.25 20.2051 17.25 22H18.75C18.75 20.2051 20.2051 18.75 22 18.75V17.25C20.2051 17.25 18.75 15.7949 18.75 14H17.25Z"></path>
            </svg>
            <p className="text-xs">Người bán trên ComZone</p>
          </span>
        </div>

        <p className="pl-2 py-4">{exchange.postContent}</p>

        <div
          ref={index === 0 ? refs[0] : null}
          className={`${
            exchange.userOfferedComics?.length === 0 && "hidden"
          } w-full border border-gray-300 rounded-lg relative overflow-hidden mt-4`}
        >
          <div className="w-full bg-[rgba(0,0,0,0.03)] border-b border-gray-300 py-2 top-0 sticky">
            <p className="px-4 font-light">
              Danh sách truyện{" "}
              <span className="font-semibold">{exchange.requestUser.name}</span>{" "}
              đang sẵn có để trao đổi:
            </p>
          </div>

          <div
            className={`w-full flex flex-wrap gap-x-[2%] gap-y-2 p-2 max-h-[25em] relative overflow-y-auto ${styles.exchange}`}
          >
            {exchange.userOfferedComics &&
              exchange.userOfferedComics.map((comics, index) => {
                return (
                  <SingleOfferedComics
                    key={index}
                    comics={comics}
                    index={index}
                    currentlySelected={currentlySelected}
                    handleSelect={handleSelect}
                    length={exchange.userOfferedComics?.length || 0}
                  />
                );
              })}
            <button
              className={`${
                exchange.userOfferedComics &&
                exchange.userOfferedComics.length < 21 &&
                "hidden"
              } mx-auto my-2 py-2 hover:underline`}
            >
              Xem thêm trong trang cá nhân
            </button>
          </div>
        </div>
      </div>

      <div className="basis-1/3 min-w-[20em] max-w-[25em] flex flex-col justify-start gap-8 px-2 py-4 pl-8 border-l ml-8">
        <RequestedComicsSection
          list={exchange.requestComics}
          ref2={refs[1]}
          index={index}
        />
        <button
          ref={index === 0 ? refs[2] : null}
          onClick={() => handleOpenChat(exchange)}
          className="flex items-center justify-center gap-2 border border-gray-400 py-2 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"></path>
          </svg>
          <p>
            Chat với{" "}
            <span className="font-semibold">{exchange.requestUser.name}</span>
          </p>
        </button>
      </div>
    </div>
  );
}
