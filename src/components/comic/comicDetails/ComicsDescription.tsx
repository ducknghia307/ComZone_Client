import React, { useEffect, useState } from "react";
import { Comic } from "../../../common/base.interface";

export default function ComicsDescription({
  currentComics,
}: {
  currentComics: Comic | undefined;
}) {
  const [isShowingLess, toggleIsShowingLess] = useState<boolean>(false);

  const descriptionLines = currentComics?.description.split("\n");

  useEffect(() => {
    if (currentComics?.description && currentComics.description.length > 1000)
      toggleIsShowingLess(true);
  }, [currentComics]);

  return (
    <div className="relative w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-xl drop-shadow-md">
      <p className="text-sm pb-2">Mô tả truyện</p>

      <div
        className={`font-light text-xs ${
          isShowingLess ? "max-h-40 overflow-y-hidden" : "max-h-fit"
        } transition-[max-height] ease-in-out duration-1000`}
      >
        {descriptionLines?.map((paragraph: string, index: number) => {
          return (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          );
        })}
      </div>

      <button
        onClick={() => toggleIsShowingLess(!isShowingLess)}
        className={`
          ${
            currentComics?.description &&
            currentComics.description.length < 1000 &&
            "hidden"
          }
          absolute bottom-0 left-1/2 translate-x-[-50%] w-full rounded-xl ${
            isShowingLess
              ? "pt-16 pb-4 bg-gradient-to-t from-white via-gray-50 to-transparent"
              : "pt-8 pb-2"
          } `}
      >
        <p className="font-light text-xs">
          {isShowingLess ? "Hiện thêm" : "Ẩn bớt"}
        </p>
      </button>
    </div>
  );
}
