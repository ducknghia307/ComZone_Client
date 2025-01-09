import React from "react";
import { ExchangePostInterface } from "../../common/interfaces/exchange.interface";
import { useNavigate } from "react-router-dom";
import moment from "moment/min/moment-with-locales";
import dateFormat from "../../assistants/date.format";

moment.locale("vi");

export default function SomeExchangePosts({
  exchangePostList,
}: {
  exchangePostList: ExchangePostInterface[];
}) {
  const navigate = useNavigate();

  if (exchangePostList.length === 0) return;

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center gap-8 mx-auto px-4 md:px-0">
      <p className="uppercase text-xl sm:text-[1.8em] font-semibold">
        Trao đổi truyện tranh
      </p>

      <div className="w-full flex justify-end items-center">
        <button
          onClick={() => {
            navigate("/exchange-news-feed");
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

      <div className="w-full flex items-stretch justify-start gap-4 overflow-x-auto overflow-y-hidden p-4 snap-x snap-mandatory">
        {exchangePostList.map((post, index) => {
          const checkTimeDisplay =
            post.createdAt &&
            moment(new Date()).unix() - moment(post.createdAt).unix() > 172800;
          return (
            <div
              key={index}
              className="grow flex flex-col min-w-full p-4 rounded-md border-2 border-gray-300 snap-center snap-always"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="w-full flex items-center gap-4">
                  <img
                    src={post.user.avatar}
                    className="w-[3em] h-[3em] sm:w-[4em] sm:h-[4em] rounded-full"
                  />
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-lg tracking-wide">
                        {post.user.name}
                      </p>
                      <span
                        className={`${
                          post.user.role !== "SELLER" && "hidden"
                        } hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500 text-white`}
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

                    <p className="font-light text-[0.7em] tracking-wider">
                      {checkTimeDisplay ? (
                        <span>
                          {moment(post.createdAt).format("DD MMMM")} &#8226;{" "}
                          {dateFormat(post.createdAt, "HH:MM")}
                        </span>
                      ) : (
                        moment(post.createdAt).calendar()
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <p className="pl-2 my-4 text-start line-clamp-4 sm:line-clamp-none">
                {post.postContent}
              </p>

              {post.images && (
                <div className={`w-full grid grid-cols-4 gap-2`}>
                  {post.images.map((image) => (
                    <img
                      key={image}
                      src={image}
                      className="rounded-lg w-full aspect-[2/3] object-cover border border-gray-300"
                    />
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  navigate(`/exchange-news-feed?id=${post.id}`);
                }}
                className="w-full capitalize font-semibold bg-sky-800 px-4 py-2 rounded-md text-white mt-auto duration-200 hover:bg-sky-900"
              >
                Bắt đầu trao đổi
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
