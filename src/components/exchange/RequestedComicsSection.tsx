import { Select, Tooltip } from "antd";
import { useState } from "react";

export default function RequestedComicsSection({
  list,
  ref2,
  index,
}: {
  list: { name: string; image: string }[];
  ref2: any;
  index: number;
}) {
  const [currentComics, setCurrentComics] = useState(0);

  const handlePrev = () => {
    currentComics > 0
      ? setCurrentComics(currentComics - 1)
      : setCurrentComics(list.length - 1);
  };

  const handleNext = () => {
    currentComics < list.length - 1
      ? setCurrentComics(currentComics + 1)
      : setCurrentComics(0);
  };
  return (
    <div
      ref={index === 0 ? ref2 : null}
      className="w-full flex flex-col items-center px-2 relative"
    >
      <button
        onClick={handlePrev}
        className="absolute flex items-center justify-center left-0 z-10 top-1/2 translate-y-[-50%] p-2 bg-white rounded-full border border-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="#000000"
        >
          <path d="M8.3685 12L13.1162 3.03212L14.8838 3.9679L10.6315 12L14.8838 20.0321L13.1162 20.9679L8.3685 12Z"></path>
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute flex items-center justify-center right-0 z-10 top-1/2 translate-y-[-50%] p-2 bg-white rounded-full border border-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="#000000"
        >
          <path d="M15.6315 12L10.8838 3.03212L9.11622 3.9679L13.3685 12L9.11622 20.0321L10.8838 20.9679L15.6315 12Z"></path>
        </svg>
      </button>

      <div className="w-full pb-4">
        <Select
          options={list.map((comics, index) => {
            return {
              value: index,
              label: (
                <span className="flex items-center justify-start gap-1 text-[0.7em]">
                  <span
                    className="min-w-8 h-8 rounded-full bg-no-repeat bg-cover bg-center"
                    style={{ backgroundImage: `url(${comics.image})` }}
                  />
                  {comics.name}
                </span>
              ),
            };
          })}
          size="large"
          value={currentComics}
          onChange={(value) => setCurrentComics(value)}
          className="w-full"
          suffixIcon={null}
        />
      </div>

      <div className="w-full flex justify-center">
        <span
          className="w-3/4 h-[20em] rounded-lg bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${list[currentComics].image})` }}
        />
      </div>

      <Tooltip title={list[currentComics].name}>
        <p className="font-semibold text-center pt-2 min-h-[3.5rem] line-clamp-2">
          {list[currentComics].name}
        </p>
      </Tooltip>

      <div className="w-full flex flex-col items-start justify-start gap-1 text-[0.7em] font-light py-2">
        <p>
          Phiên bản: <span className="font-semibold">Bản giới hạn</span>
        </p>
        <p>
          Tình trạng tối thiểu:{" "}
          <span className="font-semibold">Đã qua sử dụng</span>
        </p>
      </div>
    </div>
  );
}
