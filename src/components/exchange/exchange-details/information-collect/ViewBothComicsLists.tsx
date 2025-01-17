import { Avatar, Image, Modal } from "antd";
import { Comic } from "../../../../common/base.interface";
import { useState } from "react";
import SingleComicsDetails from "./SingleComicsDetails";

export default function ViewBothComicsLists({
  requestComicsList,
  postComicsList,
  isRequestUser,
}: {
  requestComicsList: Comic[];
  postComicsList: Comic[];
  isRequestUser: boolean;
}) {
  const [currentComics, setCurrentComics] = useState<Comic>();

  return (
    <div className="flex items-stretch justify-between gap-4">
      <div className="basis-1/2 relative flex flex-col rounded-lg border border-gray-300 pb-1 max-h-[50vh] overflow-y-auto">
        <span className="sticky top-0 flex items-center justify-between text-xs font-semibold rounded-md border border-gray-500 bg-white z-10 px-2 py-2">
          Tổng cộng {requestComicsList.length} truyện
          <span
            className={`${
              !isRequestUser && "invisible"
            } bg-sky-800 text-white p-1 rounded-md`}
          >
            Truyện của bạn
          </span>
        </span>

        {requestComicsList.map((comics) => {
          return (
            <button
              onClick={() => setCurrentComics(comics)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1"
            >
              <img
                src={comics.coverImage}
                className="min-w-[5em] max-w-[5em] min-h-[5em] max-h-[5em] object-cover"
              />
              <span className="flex flex-col text-start">
                <p className="font-semibold">{comics.title}</p>
                <p className="font-light text-xs">{comics.author}</p>
              </span>
            </button>
          );
        })}
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
        className="self-center"
      >
        <path d="M16.0503 12.0498L21 16.9996L16.0503 21.9493L14.636 20.5351L17.172 17.9988L4 17.9996V15.9996L17.172 15.9988L14.636 13.464L16.0503 12.0498ZM7.94975 2.0498L9.36396 3.46402L6.828 5.9988L20 5.99955V7.99955L6.828 7.9988L9.36396 10.5351L7.94975 11.9493L3 6.99955L7.94975 2.0498Z"></path>
      </svg>

      <div className="basis-1/2 relative flex flex-col rounded-lg border border-gray-300 pb-1 max-h-[50vh] overflow-y-auto">
        <span className="sticky top-0 flex items-center justify-between text-xs font-semibold rounded-md border border-gray-500 bg-white z-10 px-2 py-2">
          Tổng cộng {postComicsList.length} truyện
          <span
            className={`${
              isRequestUser && "invisible"
            } bg-sky-800 text-white p-1 rounded-md`}
          >
            Truyện của bạn
          </span>
        </span>

        {postComicsList.map((comics) => {
          return (
            <button
              onClick={() => setCurrentComics(comics)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1"
            >
              <img
                src={comics.coverImage}
                className="min-w-[5em] max-w-[5em] min-h-[5em] max-h-[5em] object-cover"
              />
              <span className="flex flex-col text-start">
                <p className="font-semibold">{comics.title}</p>
                <p className="font-light text-xs">{comics.author}</p>
              </span>
            </button>
          );
        })}
      </div>

      {currentComics && (
        <SingleComicsDetails
          currentComics={currentComics}
          setCurrentComics={setCurrentComics}
        />
      )}
    </div>
  );
}
