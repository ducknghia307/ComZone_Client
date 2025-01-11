import { Comic, Genre } from "../../../common/base.interface";

export default function ComicsDetailedInfo({
  currentComics,
}: {
  currentComics: Comic | undefined;
}) {
  const genres = currentComics?.genres?.map((genre: Genre) => {
    return genre.name;
  });

  if (!currentComics) return;

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
        <p className="w-1/2">{currentComics.author}</p>
      </div>

      <div className="w-full flex items-center justify-center text-xs py-2 border-b">
        <p className="w-1/2 text-gray-600">Phiên bản truyện</p>
        <p className="w-1/2">{currentComics.edition.name}</p>
      </div>

      <div className="flex items-center text-xs py-2 border-b">
        <p className="w-1/2 text-gray-600">Tình trạng</p>
        <p className="w-1/2">
          {currentComics.condition.name} ({currentComics.condition.value}/10)
        </p>
      </div>

      <div className="flex items-center text-xs py-2 border-b">
        <p className="w-1/2 text-gray-600">Mô tả tình trạng</p>
        <p className="w-1/2">{currentComics.condition.description}</p>
      </div>

      <div
        className={`${
          !currentComics?.page && "hidden"
        } flex items-center text-xs py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Số trang</p>
        <p className="w-1/2">{currentComics.page}</p>
      </div>

      <div
        className={`${
          !currentComics?.publicationYear && "hidden"
        } flex items-center text-xs py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Năm phát hành</p>
        <p className="w-1/2">{currentComics.publicationYear}</p>
      </div>

      <div className={` flex items-center text-xs py-2 border-b`}>
        <p className="w-1/2 text-gray-600">Truyện lẻ / Bộ truyện</p>
        <p className="w-1/2">
          {currentComics?.quantity === 1 ? "Truyện lẻ" : "Bộ truyện"}
        </p>
      </div>

      {currentComics?.quantity > 1 && (
        <div className={` flex items-center text-xs py-2 border-b`}>
          <p className="w-1/2 text-gray-600">Số lượng cuốn</p>
          <p className="w-1/2">{currentComics?.quantity}</p>
        </div>
      )}

      {currentComics?.quantity > 1 && currentComics.episodesList && (
        <div className={` flex items-center text-xs py-2 border-b`}>
          <p className="w-1/2 text-gray-600">Tên tập, số tập:</p>
          <div className="w-1/2 flex items-center justify-start gap-2 flex-wrap">
            {currentComics.episodesList.map((eps, index) => (
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
          currentComics.merchandises.length === 0 && "hidden"
        } flex items-center text-xs py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Phụ kiện đính kèm</p>
        <div className="w-1/2 flex items-center justify-start gap-2 flex-wrap">
          {currentComics.merchandises.map((mer, index) => (
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

      <div className="flex items-center text-xs py-2 border-b">
        <p className="w-1/2 text-gray-600">Bìa</p>
        <p className="w-1/2">
          {currentComics.cover === "SOFT"
            ? "Bìa mềm"
            : currentComics.cover === "HARD"
            ? "Bìa cứng"
            : "Bìa rời"}
        </p>
      </div>

      <div className="flex items-center text-xs py-2 border-b">
        <p className="w-1/2 text-gray-600">Màu sắc</p>
        <p className="w-1/2">
          {currentComics.color === "GRAYSCALE" ? "Đen trắng" : "Có màu"}
        </p>
      </div>
      <div
        className={`${
          !currentComics.originCountry && "hidden"
        } flex items-center text-xs py-2 border-b`}
      >
        <p className="w-1/2 text-gray-600">Xuất xứ</p>
        <p className={`w-1/2`}>{currentComics.originCountry}</p>
      </div>
      <div
        className={`${
          !currentComics.length &&
          !currentComics.width &&
          !currentComics.thickness &&
          "hidden"
        } flex items-center text-xs py-2`}
      >
        <p className="w-1/2 text-gray-600">Kích thước</p>
        <p
          className={`${
            !currentComics.length &&
            !currentComics.width &&
            !currentComics.thickness &&
            "hidden"
          } w-1/2`}
        >
          {`${currentComics.length} x ${currentComics.width} x ${currentComics.thickness} (cm)`}
        </p>
      </div>
    </div>
  );
}
