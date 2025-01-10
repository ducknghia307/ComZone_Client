import React from "react";
import { Chip } from "@mui/material";
import { Comic } from "../../common/base.interface";

const AuctionPublisher: React.FC<{ comic: Comic }> = ({ comic }) => {
  return (
    <div
      className="space-y-4"
      style={{
        padding: "30px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex justify-between items-start gap-4 py-4 border-b border-gray-300">
        <p className="text-black font-light text-base min-w-fit">
          Tên {comic.quantity > 1 ? "bộ truyện" : "truyện"}
        </p>
        <span className="font-semibold text-black text-lg">{comic.title}</span>
      </div>

      <div className="flex justify-between items-start gap-2 pb-[15px] border-b border-gray-300">
        <p className="text-black font-light text-base min-w-fit">Tác giả</p>
        <span className="font-semibold text-black text-lg">{comic.author}</span>
      </div>

      <div className="flex justify-between items-start gap-2 pb-[15px] border-b border-gray-300">
        <p className="text-black font-light text-base min-w-fit">Thể loại</p>
        <span className="font-semibold text-black text-lg">
          {comic.genres.map((genre) => genre.name).join(", ")}
        </span>
      </div>

      <div className="flex justify-between items-start gap-2 pb-[15px] border-b border-gray-300">
        <p className="text-black font-light text-base min-w-fit">
          Truyện lẻ / Bộ truyện
        </p>
        <span className="font-semibold text-black text-lg">
          {comic.quantity > 1 ? "Bộ truyện" : "Truyện lẻ"}
        </span>
      </div>

      {comic.quantity > 1 && (
        <div className="flex justify-between items-start gap-2 pb-[15px] border-b border-gray-300">
          <p className="text-black font-light text-base min-w-fit">Số quyển</p>
          <span className="font-semibold text-black text-lg">
            {comic.quantity}
          </span>
        </div>
      )}

      {comic.merchandises && comic.merchandises.length > 0 && (
        <div className="flex justify-between items-start gap-2 pb-[15px] border-b border-gray-300">
          <p className="text-black font-light text-base min-w-fit">Phụ kiện</p>
          <span className="font-semibold text-black text-lg">
            {comic.merchandises.map((merch) => merch.name).join(", ")}
          </span>
        </div>
      )}

      {comic.page && (
        <div className="flex justify-between items-start gap-2 pb-[15px] border-b border-gray-300">
          <p className="text-black font-light text-base min-w-fit">Số trang</p>
          <span className="font-semibold text-black text-lg">{comic.page}</span>
        </div>
      )}

      {comic.edition && (
        <div className="flex justify-between items-start gap-2 pb-[15px] border-b border-gray-300">
          <p className="text-black font-light text-base min-w-fit">Phiên bản</p>
          <Chip
            label={comic.edition.name}
            style={{
              fontFamily: "REM",
              fontSize: "16px",
              fontWeight: "bold",
              padding: "10px 15px",
              backgroundColor: "#f8f9fa",
              color: "#000",
              border: "1px solid #000",
              borderRadius: "20px",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              textTransform: "capitalize",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AuctionPublisher;
