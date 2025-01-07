import { Modal } from "antd";
import React, { useState } from "react";
import { Comic } from "../../../../common/base.interface";

export default function SingleComicsDetails({
  currentComics,
  setCurrentComics,
}: {
  currentComics: Comic | undefined;
  setCurrentComics: React.Dispatch<React.SetStateAction<Comic | undefined>>;
}) {
  const [currentImage, setCurrentImage] = useState(currentComics?.coverImage);

  return (
    <Modal
      open={currentComics !== undefined}
      onCancel={(e) => {
        e.stopPropagation();
        setCurrentComics(undefined);
      }}
      centered
      footer={null}
      width={1000}
    >
      <div
        key={currentComics.id}
        className={`flex items-stretch gap-2 p-[0.2em] rounded-md duration-200`}
      >
        <div className="self-baseline shrink-0 basis-1/3 flex flex-col items-start gap-2">
          <img
            src={currentImage}
            alt=""
            className="self-center w-full aspect-[2/3] rounded-md object-cover"
          />

          <div
            className={`relative flex gap-2 h-full max-w-64 overflow-x-auto overflow-y-hidden snap-x snap-mandatory`}
          >
            <img
              onClick={() => setCurrentImage(currentComics.coverImage)}
              src={currentComics.coverImage}
              alt=""
              className={`w-16 aspect-[2/3] ${
                currentImage === currentComics.coverImage
                  ? "border border-gray-500"
                  : "duration-200 hover:brightness-50 cursor-pointer"
              } rounded-md object-cover snap-center snap-always`}
            />

            {currentComics.previewChapter.map((preview, index) => (
              <img
                key={index}
                onClick={() => setCurrentImage(preview)}
                src={preview}
                alt=""
                className={`w-16 aspect-[2/3] ${
                  currentImage === preview
                    ? "border border-gray-500"
                    : "duration-200 hover:brightness-50 cursor-pointer"
                } rounded-md object-cover snap-center snap-always`}
              />
            ))}
          </div>
        </div>

        <div className="self-stretch ml-2 w-full flex flex-col justify-start gap-2 py-2">
          <div className="flex flex-col leading-tight">
            <p className="text-xl font-semibold uppercase leading-tight">
              {currentComics.title}
            </p>
            <p className="font-light uppercase">{currentComics.author}</p>
          </div>

          <div className="flex items-center justify-between gap-2 pr-4">
            <p className="font-light text-xs">Tình trạng:</p>
            <p className="font-semibold">
              {currentComics.condition.name} ({currentComics.condition.value}
              /10)
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pr-4">
            <p className="font-light text-xs">Số lượng cuốn:</p>
            <p className="font-semibold">
              {currentComics.quantity > 1
                ? currentComics.quantity
                : "Truyện lẻ"}
            </p>
          </div>

          {currentComics.quantity > 1 && currentComics.episodesList && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-light text-xs">Danh sách truyện:</p>
              {currentComics.episodesList.slice(0, 8).map((episode) => (
                <span className="font-light text-xs italic border border-gray-300 p-1 rounded-md">
                  {episode}
                </span>
              ))}
            </div>
          )}

          <p className="font-light">
            Mô tả: <p className="font-medium">{currentComics.description}</p>
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentComics(undefined);
            }}
            className="mt-auto self-stretch border border-gray-300 rounded px-4 py-2 duration-200 hover:bg-gray-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
