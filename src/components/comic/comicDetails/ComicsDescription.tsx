import { useEffect, useState } from "react";
import { Comic } from "../../../common/base.interface";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function ComicsDescription({
  currentComics,
  fontSize = "1rem",
}: {
  currentComics?: Comic;
  fontSize?: string;
}) {
  const [isShowingLess, toggleIsShowingLess] = useState<boolean>(false);
  const descriptionLines = currentComics?.description.split("\n");

  useEffect(() => {
    if (currentComics?.description && currentComics.description.length > 1000)
      toggleIsShowingLess(true);
  }, [currentComics]);

  return (
    <div className="relative w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-xl drop-shadow-md">
      <p
        style={{ fontFamily: "REM", fontWeight: "600", fontSize }}
        className="text-base pb-1"
      >
        Mô tả truyện
      </p>

      <div
        style={{ fontSize }}
        className={`font-light ${
          isShowingLess ? "max-h-40 overflow-hidden" : "max-h-fit"
        } leading-relaxed`}
      >
        {descriptionLines?.map((paragraph: string, index: number) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      <button
        onClick={() => toggleIsShowingLess(!isShowingLess)}
        className={`${
          currentComics?.description &&
          currentComics?.description.length < 1000 &&
          "hidden"
        } absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full rounded-xl ${
          isShowingLess
            ? "pt-16 pb-4 bg-gradient-to-t from-white via-gray-50 to-transparent"
            : "pt-8 pb-2"
        }`}
      >
        <p className="font-light text-sm">
          <KeyboardArrowDownIcon />
          {isShowingLess ? "Hiện thêm" : "Ẩn bớt"}
        </p>
      </button>
    </div>
  );
}
