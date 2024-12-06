/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Comic } from "../../../common/base.interface";

export default function SingleExchangeComics({
  comics,
  setIsShowingDetails,
}: {
  comics: Comic;
  setIsShowingDetails: React.Dispatch<React.SetStateAction<Comic>>;
}) {
  const [currentComics, setCurrentComics] = useState<Comic>(comics);

  const imagesList = [currentComics.coverImage].concat(
    currentComics.previewChapter
  );

  const [currentImage, setCurrentImage] = useState(imagesList[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    setCurrentComics(comics);
    setCurrentImage(comics.coverImage);
  }, [comics]);

  const imageListRef = useRef<HTMLDivElement>();
  const singleImageRef = useRef<HTMLImageElement>();

  const getComicsExchangeStatus = () => {
    switch (currentComics.status) {
      case "UNAVAILABLE":
        return <p>Không khả dụng</p>;
      case "AVAILABLE":
        return <p className="text-green-600">Sẵn sàng trao đổi</p>;
      case "PRE_ORDER":
        return <p className="text-amber-600">Đang dùng để đổi</p>;
      case "SOLD":
        return <p className="text-cyan-600">Đã trao đổi</p>;
    }
  };

  const imageListGap = 4;
  const scrollHandler = (type: "UP" | "DOWN") => {
    if (
      imageListRef &&
      imageListRef.current &&
      singleImageRef &&
      singleImageRef.current
    ) {
      const maxScrollHeight =
        imageListRef.current.scrollHeight - singleImageRef.current.height * 2;
      const distance = singleImageRef.current.height + imageListGap;

      imageListRef.current.scrollBy({
        top: type === "UP" ? -distance : distance,
        behavior: "smooth",
      });

      if (type === "UP") {
        if (scrollPosition > distance)
          setScrollPosition(scrollPosition - distance);
        else setScrollPosition(0);

        if (currentIndex < 2) {
          setCurrentImage(imagesList[0]);
          setCurrentIndex(0);
        } else {
          setCurrentImage(imagesList[currentIndex - 1]);
          setCurrentIndex(currentIndex - 1);
        }
      } else {
        if (scrollPosition < maxScrollHeight - distance)
          setScrollPosition(scrollPosition + distance);
        else setScrollPosition(maxScrollHeight);

        if (currentIndex > imagesList.length - 2) {
          setCurrentImage(imagesList[imagesList.length - 1]);
          setCurrentIndex(imagesList.length - 1);
        } else {
          setCurrentImage(imagesList[currentIndex + 1]);
          setCurrentIndex(currentIndex + 1);
        }
      }
    }
  };

  return (
    <div
      className={`${
        currentComics.quantity > 1
          ? "bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 p-[0.2em]"
          : "bg-gray-800 p-[0.1em]"
      } text-white font-semibold rounded-md duration-200`}
    >
      <div
        key={currentComics.id}
        className={`relative flex items-start gap-2 bg-white text-black p-[0.2em] rounded-md duration-200 group hover:bg-gray-50`}
      >
        <div className="shrink-0 flex items-start gap-2">
          <img
            src={currentImage}
            alt=""
            className="w-24 h-36 rounded-md object-cover"
          />

          <div
            ref={imageListRef}
            className={`relative flex flex-col gap-[${imageListGap}px] h-full max-h-36 overflow-hidden`}
          >
            <button
              onClick={() => scrollHandler("UP")}
              className={`${
                scrollPosition === 0 ? "hidden" : "group-hover:inline"
              } z-50 w-fit sticky top-1 left-1/2 -translate-x-1/2 border border-black bg-black text-white rounded-full duration-200 hover:bg-white hover:text-black hidden`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12 8.36853L20.9679 13.1162L20.0321 14.8838L12 10.6315L3.9679 14.8838L3.03212 13.1162L12 8.36853Z"></path>
              </svg>
            </button>

            {imagesList.map((preview, index) => (
              <img
                ref={index === 0 ? singleImageRef : null}
                key={index}
                onClick={() => {
                  setCurrentImage(preview);
                  setCurrentIndex(index);
                }}
                src={preview}
                alt=""
                className={`w-16 h-20 ${
                  currentImage === preview
                    ? "border border-gray-500"
                    : "duration-200 hover:scale-110 hover:z-20"
                } rounded-md object-cover`}
              />
            ))}

            <button
              onClick={() => scrollHandler("DOWN")}
              className={`${
                imageListRef.current &&
                singleImageRef.current &&
                scrollPosition ===
                  imageListRef.current.scrollHeight -
                    singleImageRef.current.height * 2
                  ? "hidden"
                  : "group-hover:inline"
              } z-50 w-fit sticky bottom-1 left-1/2 -translate-x-1/2 border border-black bg-black text-white rounded-full duration-200 hover:bg-white hover:text-black hidden`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12 15.6315L20.9679 10.8838L20.0321 9.11619L12 13.3685L3.96788 9.11619L3.0321 10.8838L12 15.6315Z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="self-stretch max-w-96 ml-2 flex flex-col justify-center gap-2 py-2">
          <div className="flex flex-col leading-tight">
            <p className="text-lg font-semibold uppercase leading-tight">
              {currentComics.title}
            </p>
            <p className="font-light uppercase text-sm">
              {currentComics.author}
            </p>
          </div>

          {currentComics.quantity > 1 && currentComics.episodesList && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {currentComics.episodesList.slice(0, 8).map((episode) => (
                <span className="font-light text-xs italic border border-gray-300 p-1 rounded-md">
                  {episode}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-light text-xs">Trạng thái:</span>{" "}
            {getComicsExchangeStatus()}
          </div>

          <button
            onClick={() => setIsShowingDetails(currentComics)}
            className="self-baseline px-4 py-1 border border-gray-500 bg-gray-900 text-white rounded-md font-light text-sm duration-200 hover:bg-white hover:text-black"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
