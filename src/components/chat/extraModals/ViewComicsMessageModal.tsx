import { Modal } from "antd";
import { Comic } from "../../../common/base.interface";
import { useEffect, useState } from "react";
import { publicAxios } from "../../../middleware/axiosInstance";
import { Condition } from "../../../common/interfaces/condition.interface";

export default function ViewComicsMessageModal({
  comicsList,
  isOpen,
  setIsOpen,
}: {
  comicsList: Comic[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentComics = comicsList[currentIndex];

  const handlePrev = () => {
    if (currentIndex === 0) setCurrentIndex(comicsList.length - 1);
    else setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex === comicsList.length - 1) setCurrentIndex(0);
    else setCurrentIndex(currentIndex + 1);
  };

  const quantityDisplay = () => {
    if (currentComics.quantity === 1) return "Truyện lẻ";
    else
      return (
        <>
          Bộ truyện{" "}
          <span className="text-[0.8rem] font-light italic">
            ({currentComics.quantity} cuốn)
          </span>
        </>
      );
  };

  return (
    <Modal
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setIsOpen("");
      }}
      footer={null}
    >
      <div className="flex flex-col items-stretch justify-start gap-4 py-4 transition-all duration-200">
        <div className="flex items-center justify-between gap-4">
          <button
            hidden={comicsList.length === 1}
            onClick={() => handlePrev()}
            className="flex items-center justify-center p-2 rounded-full bg-white drop-shadow-xl hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
            </svg>
          </button>

          <img
            id="image-section"
            src={currentComics.coverImage}
            alt=""
            className="w-[20em] h-[30em] rounded-md"
          />

          <button
            hidden={comicsList.length === 1}
            onClick={() => handleNext()}
            className="flex items-center justify-center p-2 rounded-full bg-white drop-shadow-xl hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-xl font-semibold text-center">
            {currentComics.title}
          </p>
          <p>{currentComics.author}</p>
        </div>

        <div className="self-baseline flex flex-col items-start mx-auto">
          <p className="font-semibold">
            <span className="text-xs font-medium">Phiên bản:</span>{" "}
            {currentComics.edition.name}
          </p>
          <p className="font-semibold">
            <span className="text-xs font-medium">Tình trạng truyện:</span>{" "}
            {currentComics.condition.name} ({currentComics.condition.value / 10}
            )
          </p>
          <p className="font-semibold">
            <span className="text-xs font-medium">Số lượng truyện:</span>{" "}
            {quantityDisplay()}
          </p>
        </div>
      </div>
    </Modal>
  );
}
