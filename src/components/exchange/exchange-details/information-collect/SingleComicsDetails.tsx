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

  const getEdition = () => {
    switch (currentComics.edition) {
      case "REGULAR":
        return "Bản thường";
      case "SPECIAL":
        return "Bản đặc biệt";
      case "LIMITED":
        return "Bản giới hạn";
    }
  };

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

  return (
    <Modal
      open={currentComics !== undefined}
      onCancel={(e) => {
        e.stopPropagation();
        setCurrentComics(undefined);
      }}
      centered
      footer={null}
    >
      <div
        key={currentComics.id}
        className={`flex items-stretch gap-2 p-[0.2em] rounded-md duration-200`}
      >
        <div className="self-baseline shrink-0 flex flex-col items-start gap-2">
          <img
            src={currentImage}
            alt=""
            className="self-center w-[15em] aspect-[2/3] rounded-md object-cover"
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

        <div className="self-stretch ml-2 w-full flex flex-col justify-center gap-2 py-2">
          <div className="flex flex-col leading-tight">
            <p className="text-lg font-semibold uppercase leading-tight">
              {currentComics.title}
            </p>
            <p className="font-light uppercase text-sm">
              {currentComics.author}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pr-4">
            <p className="font-light text-xs">Phiên bản:</p>
            <p className="font-semibold">{getEdition()}</p>
          </div>

          <div className="flex items-center justify-between gap-2 pr-4">
            <p className="font-light text-xs">Tình trạng:</p>
            <p className="font-semibold">
              {currentComics.condition === "SEALED"
                ? "Nguyên seal"
                : "Đã qua sử dụng"}
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

          <div className="flex items-center justify-between gap-2 pr-4">
            <p className="font-light text-xs">Trạng thái:</p>
            <p className="font-semibold">{getComicsExchangeStatus()}</p>
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

          {currentComics.publishedDate && (
            <div className="flex items-center justify-between gap-2 pr-4">
              <p className="font-light text-xs">Năm xuất bản:</p>
              <p className="font-semibold">{currentComics.publishedDate}</p>
            </div>
          )}

          {currentComics.page && (
            <div className="flex items-center justify-between gap-2 pr-4">
              <p className="font-light text-xs">Số trang:</p>
              <p className="font-semibold">{currentComics.page}</p>
            </div>
          )}

          <p className="font-light text-sm">
            Mô tả:{" "}
            <span className={`font-medium`}>
              <p className="max-h-[10em] overflow-auto">
                {currentComics.description}
              </p>
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
}
