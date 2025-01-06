import { Comic } from "../../../common/base.interface";
import CurrencySplitter from "../../../assistants/Spliter";
import displayPastTimeFromNow from "../../../utils/displayPastTimeFromNow";

export default function ComicsMainInfo({
  currentComics,
}: {
  currentComics: Comic | undefined;
}) {
  if (!currentComics) return;

  return (
    <div className="w-full flex flex-col bg-white px-4 py-4 rounded-xl drop-shadow-md">
      <div
        className={`flex flex-wrap items-center gap-4 pb-2 ${
          (currentComics.edition.auctionDisabled ||
            currentComics.condition < 10) &&
          "hidden"
        }`}
      >
        {currentComics.condition === 10 && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-sky-800 text-white text-xs font-light">
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
        {currentComics.edition.isSpecial && (
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded-2xl ${
              currentComics.edition.isSpecial ? "bg-yellow-600" : "bg-red-800"
            } text-white text-xs font-light capitalize`}
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
            {currentComics.edition.name}
          </span>
        )}
      </div>
      <p className="font-semibold text-[1.5em]">{currentComics.title}</p>

      <p className="font-light text-[0.9em] py-2">{currentComics.author}</p>

      {currentComics.onSaleSince && (
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="currentColor"
          >
            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
          </svg>
          <p className="font-light text-xs italic">
            Đăng bán: {displayPastTimeFromNow(currentComics.onSaleSince)}
          </p>
        </div>
      )}

      <p className="font-semibold text-[2em] pt-4 flex items-start gap-1">
        {currentComics.price ? CurrencySplitter(currentComics.price) : ""}
        &#8363;
      </p>
    </div>
  );
}
