import { Comic } from "../../common/base.interface";
import { Link } from "react-router-dom";
import CurrencySplitter from "../../assistants/Spliter";
import displayPastTimeFromNow from "../../utils/displayPastTimeFromNow";

export default function ShopComicsList({
  comicsList,
  fullComicsList,
  searchParams,
}: {
  comicsList: Comic[];
  fullComicsList: Comic[];
  searchParams: URLSearchParams;
}) {
  return (
    <div className="w-full flex flex-col gap-4 bg-white drop-shadow-lg p-4 rounded-md">
      <p className="text-[1.5em] font-bold">
        TẤT CẢ TRUYỆN ĐANG BÁN{" "}
        <span className="font-light text-[0.8em]">
          (Tổng {fullComicsList.length} truyện)
        </span>
      </p>

      {fullComicsList.length > 0 && comicsList.length === 0 && (
        <p className="font-light">
          Không tìm thấy kết quả phù hợp
          {searchParams.get("search") && ` cho "${searchParams.get("search")}"`}
          !
        </p>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-[repeat(auto-fill,14em)] justify-center gap-1 sm:gap-4">
        {fullComicsList.length > 0 ? (
          comicsList.map((comic) => (
            <div
              className="bg-white rounded-lg w-full sm:w-[14em] overflow-hidden border drop-shadow-md"
              key={comic.id}
            >
              <Link to={`/detail/${comic.id}`}>
                <img
                  src={comic.coverImage || "/default-cover.jpg"}
                  alt={comic.title}
                  className="object-cover w-full aspect-[2/3]"
                />
                <div className="px-1 phone:px-3 py-2">
                  <div
                    className={`hidden sm:flex items-center justify-between w-full gap-2 min-h-[2em]`}
                  >
                    {comic.condition === 10 && (
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
                        NGUYÊN VẸN
                      </span>
                    )}
                    {comic.edition.isSpecial && (
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
                        {comic.edition.name}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm sm:text-lg text-red-500">
                    {CurrencySplitter(comic.price)}đ
                  </p>
                  <p className="font-light text-[0.5rem] sm:text-base uppercase">
                    {comic.author}
                  </p>
                  <p className="font-semibold text-sm sm:text-xl line-clamp-3 h-[4.4em]">
                    {comic.title}
                  </p>

                  <div className="w-full flex justify-start gap-1 items-center font-light text-xs mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width={12}
                      height={12}
                    >
                      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
                    </svg>
                    <p className="count-time">
                      Đăng bán từ{" "}
                      {displayPastTimeFromNow(
                        comic.onSaleSince || new Date(),
                        null,
                        true
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>Không có truyện nào</p>
        )}
      </div>
    </div>
  );
}
