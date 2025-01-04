import React, { useEffect, useRef, useState } from "react";
import { Comic } from "../../common/base.interface";

export default function SellingComics({ comicsList }: { comicsList: Comic[] }) {
  const [currentComics, setCurrentComics] = useState<Comic>(comicsList[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    setCurrentComics(comicsList[0]);
  }, [comicsList]);

  const comicsListRef = useRef<HTMLDivElement>();
  const singleComicsRef = useRef<HTMLImageElement>();

  const imageListGap = 8;

  const scrollHandler = (type: "PREV" | "NEXT") => {
    if (
      comicsListRef &&
      comicsListRef.current &&
      singleComicsRef &&
      singleComicsRef.current
    ) {
      const distance = (singleComicsRef.current.width + imageListGap) * 5;

      comicsListRef.current.scrollBy({
        left: type === "PREV" ? -distance : distance,
        behavior: "smooth",
      });
    }
  };

  if (!comicsList || comicsList.length === 0) return;

  return (
    <div className="w-full lg:w-3/4 flex flex-col items-center mx-auto">
      <p className="uppercase text-[1.8em] font-semibold mb-8">
        Truyện đang bán
      </p>

      <div className="w-full self-stretch flex items-stretch justify-center gap-4">
        <div className="flex flex-col items-stretch justify-between gap-4 border-4">
          {currentComics && (
            <div className="flex flex-col">
              <p className="font-semibold text-xl">{currentComics.title}</p>
            </div>
          )}

          <div
            ref={comicsListRef}
            className={`relative flex items-center justify-start gap-[${imageListGap}px] max-w-[50em] overflow-hidden`}
          >
            <button
              onClick={() => scrollHandler("PREV")}
              className={`z-50 h-fit sticky top-1/2 -translate-y-1/2 left-4 bg-black text-white rounded-full duration-200 hover:bg-gray-700 p-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M8.3685 12L13.1162 3.03212L14.8838 3.9679L10.6315 12L14.8838 20.0321L13.1162 20.9679L8.3685 12Z"></path>
              </svg>
            </button>

            {comicsList.map((comics, index) => (
              <img
                key={comics.id}
                ref={index === 0 ? singleComicsRef : null}
                src={comics.coverImage}
                alt=""
                onClick={() => {
                  setCurrentComics(comics);
                  setCurrentIndex(index);
                }}
                className="min-w-[8em] max-w-[8em] aspect-[2/3] object-cover"
              />
            ))}

            <button
              onClick={() => scrollHandler("NEXT")}
              className={`z-50 h-fit sticky top-1/2 -translate-y-1/2 right-4 bg-black text-white rounded-full duration-200 hover:bg-gray-700 p-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M15.6315 12L10.8838 3.03212L9.11622 3.9679L13.3685 12L9.11622 20.0321L10.8838 20.9679L15.6315 12Z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="w-1/4 border-4">
          {currentComics && (
            <div
              className="w-full aspect-[2/3] bg-cover bg-no-repeat bg-center duration-300 transition-all"
              style={{ backgroundImage: `url(${currentComics.coverImage})` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
