import React from "react";
import { Chip } from "@mui/material";
import { Comic, Genre } from "../../common/base.interface";

const AuctionPublisher: React.FC<{ comic: Comic }> = ({ comic }) => {
  return (
    <div className="w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-md border border-gray-300">
      <p className="text-sm pb-2">Thông tin chi tiết</p>

      <div className="w-full flex items-center justify-center text-xs sm:text-sm py-2 border-b">
        <p className="w-1/2 text-gray-600">Thể loại</p>
        <div className="w-1/2">
          {comic.genres?.map((genre: Genre, index: number) => {
            return (
              <span key={index} className="text-sky-800">
                {genre.name}
                {index < comic.genres.length - 1 && ", "}
              </span>
            );
          })}
        </div>
      </div>

      <div className="w-full flex items-center justify-center text-xs sm:text-sm py-2 border-b">
        <p className="w-1/2 text-gray-600">Tác giả</p>
        <p className="w-1/2">{comic.author}</p>
      </div>

      <div className="w-full flex items-center justify-center text-xs sm:text-sm py-2 border-b">
        <p className="w-1/2 text-gray-600">Phiên bản truyện</p>
        <p className="w-1/2">{comic.edition.name}</p>
      </div>

      <div className="flex items-center text-xs sm:text-sm py-2 border-b">
        <p className="w-1/2 text-gray-600">Tình trạng</p>
        <p className="w-1/2">
          {comic.condition.name} ({comic.condition.value}/10)
        </p>
      </div>

      <div className="flex items-center text-xs sm:text-sm py-2 border-b">
        <p className="w-1/2 text-gray-600">Mô tả tình trạng</p>
        <p className="w-1/2">{comic.condition.description}</p>
      </div>

      <div
        className={`${
          !comic?.page && "hidden"
        } flex items-center text-xs sm:text-sm py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Số trang</p>
        <p className="w-1/2">{comic.page}</p>
      </div>

      <div
        className={`${
          !comic?.publicationYear && "hidden"
        } flex items-center text-xs sm:text-sm py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Năm phát hành</p>
        <p className="w-1/2">{comic.publicationYear}</p>
      </div>

      <div className={` flex items-center text-xs sm:text-sm py-2 border-b`}>
        <p className="w-1/2 text-gray-600">Truyện lẻ / Bộ truyện</p>
        <p className="w-1/2">
          {comic?.quantity === 1 ? "Truyện lẻ" : "Bộ truyện"}
        </p>
      </div>

      {comic?.quantity > 1 && (
        <div className={` flex items-center text-xs sm:text-sm py-2 border-b`}>
          <p className="w-1/2 text-gray-600">Số lượng cuốn</p>
          <p className="w-1/2">{comic?.quantity}</p>
        </div>
      )}

      {comic?.quantity > 1 && comic.episodesList && (
        <div className={` flex items-center text-xs sm:text-sm py-2 border-b`}>
          <p className="w-1/2 text-gray-600">Tên tập, số tập:</p>
          <div className="w-1/2 flex items-center justify-start gap-2 flex-wrap">
            {comic.episodesList.map((eps, index) => (
              <>
                <span
                  key={index}
                  className="px-2 py-1 rounded-md border border-gray-300"
                >
                  {/^[0-9]*$/.test(eps) && "Tập "}
                  {eps}
                </span>
              </>
            ))}
          </div>
        </div>
      )}
      <div
        className={`${
          comic.merchandises.length === 0 && "hidden"
        } flex items-center text-xs sm:text-sm py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Phụ kiện đính kèm</p>
        <div className="w-1/2 flex items-center justify-start gap-2 flex-wrap">
          {comic.merchandises.map((mer, index) => (
            <>
              <span
                key={index}
                className="px-2 py-1 rounded-md border border-gray-300"
              >
                {mer.name}
              </span>
            </>
          ))}
        </div>
      </div>

      <div className="flex items-center text-xs sm:text-sm py-2 border-b">
        <p className="w-1/2 text-gray-600">Bìa</p>
        <p className="w-1/2">
          {comic.cover === "SOFT"
            ? "Bìa mềm"
            : comic.cover === "HARD"
            ? "Bìa cứng"
            : "Bìa rời"}
        </p>
      </div>

      <div className="flex items-center text-xs sm:text-sm py-2 border-b">
        <p className="w-1/2 text-gray-600">Màu sắc</p>
        <p className="w-1/2">
          {comic.color === "GRAYSCALE" ? "Đen trắng" : "Có màu"}
        </p>
      </div>
      <div
        className={`${
          !comic.originCountry && "hidden"
        } flex items-center text-xs sm:text-sm py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Xuất xứ</p>
        <p className={`w-1/2`}>{comic.originCountry}</p>
      </div>
      <div
        className={`${
          !comic.length && !comic.width && !comic.thickness && "hidden"
        } flex items-center text-xs sm:text-sm py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Kích thước</p>
        <p
          className={`${
            !comic.length && !comic.width && !comic.thickness && "hidden"
          }w-1/2`}
        >
          {`${comic.length} x ${comic.width} x ${comic.thickness} (cm)`}
        </p>
      </div>
    </div>
  );
};

export default AuctionPublisher;
