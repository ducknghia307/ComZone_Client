import React, { useEffect, useState } from "react";
import { Comic } from "../../../common/base.interface";

export default function ComicsSelection({
  fullComicsList,
  selectedComics,
  setSelectedComics,
}: {
  fullComicsList: Comic[];
  selectedComics: string[];
  setSelectedComics: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [currentComicsList, setCurrentComicsList] =
    useState<Comic[]>(fullComicsList);

  const [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    setCurrentComicsList(fullComicsList);
  }, [fullComicsList]);

  return (
    <div className="flex flex-col items-stretch gap-4">
      <div className="flex items-stretch justify-between gap-2">
        <div className="grow relative">
          <input
            type="text"
            disabled={fullComicsList.length === 0}
            placeholder="Tìm kiếm theo tên truyện, tác giả..."
            className="w-full border border-gray-300 rounded-md p-2 pl-12 font-light"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);

              if (e.target.value.length === 0) {
                setCurrentComicsList(fullComicsList);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchInput.length > 0) {
                setCurrentComicsList(
                  fullComicsList.filter(
                    (comics) =>
                      comics.title
                        .toLowerCase()
                        .includes(searchInput.toLowerCase()) ||
                      comics.author
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                  )
                );
              }
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            className="absolute top-1/2 -translate-y-1/2 left-4"
          >
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
          </svg>
        </div>

        <p
          className={`self-center text-end shrink-0 phone:basis-1/4 phone:min-w-fit pr-4 phone:text-lg`}
        >
          Đã chọn:{" "}
          <span className="font-semibold">{selectedComics.length}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 items-stretch gap-2 max-h-[30em] overflow-y-auto">
        {currentComicsList.length === 0 && searchInput.length > 0}
        {currentComicsList.length > 0 &&
          currentComicsList.map((comics: Comic) => {
            const isSelected = selectedComics.some((c) => c === comics.id);
            return (
              <button
                onClick={() => {
                  if (isSelected)
                    setSelectedComics(
                      selectedComics.filter((c) => c !== comics.id)
                    );
                  else setSelectedComics((prev) => [...prev, comics.id]);
                }}
                key={comics.id}
                className={`flex flex-col items-stretch gap-2 rounded-md border border-gray-300 p-1 overflow-hidden ${
                  isSelected && "border-2 border-gray-800"
                }`}
              >
                <div className="relative">
                  <img
                    src={comics.coverImage}
                    alt=""
                    className={`${
                      isSelected && "brightness-50"
                    } rounded-md aspect-[2/3] object-cover`}
                  />
                  {isSelected && (
                    <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-1 rounded-md bg-white text-black">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d="M16 16V12L21 17L16 22V18H4V16H16ZM8 2V5.999L20 6V8H8V12L3 7L8 2Z"></path>
                      </svg>
                    </span>
                  )}
                </div>

                <p className="font-semibold leading-tight uppercase">
                  {comics.title}
                </p>
                <p className="text-sm font-light">{comics.author}</p>
              </button>
            );
          })}
      </div>
    </div>
  );
}
