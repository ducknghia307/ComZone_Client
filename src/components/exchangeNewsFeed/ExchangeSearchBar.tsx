/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { notification } from "antd";
import { useEffect } from "react";

export default function ExchangeSearchBar({
  isLoggedIn,
  handleOpenCreatePost,
  searchKey,
  setSearchKey,
  handleSearch,
}: {
  isLoggedIn: boolean;
  handleOpenCreatePost: Function;
  searchKey: string;
  setSearchKey: Function;
  handleSearch: Function;
}) {
  useEffect(() => {
    const exchangeSearch = document.getElementById("exchange-search");
    exchangeSearch?.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        document.getElementById("search-button")?.click();
      }
    });
  }, []);

  return (
    <div className="w-full xl:w-2/3 max-w-[100em] flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
      <button
        onClick={() => {
          if (!isLoggedIn)
            notification.info({
              key: "not-logged-in",
              message: "Bạn cần đăng nhập để thực hiện đăng bài",
              description: (
                <button className="w-full py-2 rounded-md text-white font-semibold bg-sky-600 duration-200 hover:bg-sky-700">
                  Đăng nhập
                </button>
              ),
              duration: 5,
            });
          else handleOpenCreatePost();
        }}
        className="min-w-max flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-sky-600 text-white duration-200 hover:bg-sky-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
        </svg>
        <p>Đăng bài trao đổi</p>
      </button>

      <div className="basis-full flex items-center gap-4 relative">
        <input
          id="exchange-search"
          type="search"
          placeholder="Thử tìm kiếm gì đó..."
          autoComplete="off"
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
          className="grow border rounded-lg pl-10 pr-4 py-2 font-light bg-white"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          className="absolute top-1/2 left-4 translate-y-[-50%] fill-gray-600"
        >
          <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
        </svg>
        <button
          id="search-button"
          onClick={() => {
            document.getElementById("exchange-search")?.blur();
            handleSearch();
          }}
          className="min-w-max whitespace-nowrap px-4 py-2 bg-black text-white rounded-md duration-200 hover:bg-gray-800"
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}
