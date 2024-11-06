import { Comic, Genre } from "../../../common/base.interface";
import dateFormat from "../../../assistants/date.format";

export default function ComicsDetailedInfo({
  currentComics,
}: {
  currentComics: Comic | undefined;
}) {
  const genres = currentComics?.genres?.map((genre: Genre) => {
    return genre.name;
  });

  return (
    <div className="w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-xl drop-shadow-md">
      <p className="text-sm pb-2">Thông tin chi tiết</p>

      <div className="w-full flex items-center justify-center text-xs py-2 border-b">
        <p className="w-1/2 text-gray-600">Thể loại</p>
        <div className="w-1/2">
          {genres?.map((genre: string, index: number) => {
            return (
              <span key={index} className="text-sky-800">
                {genre}
                {index < genres.length - 1 && ", "}
              </span>
            );
          })}
        </div>
      </div>

      <div className="w-full flex items-center justify-center text-xs py-2 border-b">
        <p className="w-1/2 text-gray-600">Tác giả</p>
        <p className="w-1/2">{currentComics?.author}</p>
      </div>

      <div className="w-full flex items-center justify-center text-xs py-2 border-b">
        <p className="w-1/2 text-gray-600">Phiên bản truyện</p>
        <p className="w-1/2">
          {(currentComics?.edition === "REGULAR" && "Bản thường") ||
            (currentComics?.edition === "SPECIAL" && "Bản đặc biệt") ||
            "Bản giới hạn"}
        </p>
      </div>

      <div className="flex items-center text-xs py-2 border-b">
        <p className="w-1/2 text-gray-600">Tình trạng</p>
        <p className="w-1/2">
          {(currentComics?.condition === "SEALED" && "Nguyên seal") ||
            "Đã qua sử dụng"}
        </p>
      </div>

      <div
        className={`${
          !currentComics?.page && "hidden"
        } flex items-center text-xs py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Số trang</p>
        <p className="w-1/2">{currentComics?.page}</p>
      </div>

      <div
        className={`${
          !currentComics?.publishedDate && "hidden"
        } flex items-center text-xs py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Ngày phát hành</p>
        <p className="w-1/2">
          {dateFormat(currentComics?.publishedDate, "dd/mm/yyyy")}
        </p>
      </div>

      <div
        className={`${
          !currentComics?.publishedDate && "hidden"
        } flex items-center text-xs py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Số lượng cuốn</p>
        <p className="w-1/2">{currentComics?.quantity}</p>
      </div>
    </div>
  );
}
