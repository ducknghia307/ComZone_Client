import React from "react";
import { Comic, UserInfo } from "../../../common/base.interface";

export default function OtherComicsFromSeller({
  seller,
  comicsListFromSeller,
}: {
  seller: UserInfo | undefined;
  comicsListFromSeller: Comic[] | [];
}) {
  return (
    <div className="w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-xl drop-shadow-md">
      <p className="text-sm pb-2">
        Các truyện khác của{" "}
        <span className="font-semibold">{seller?.name}</span>
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,10rem)] gap-x-2 gap-y-4 justify-between">
        {comicsListFromSeller.map((comics: Comic) => {
          return (
            <div key={comics.id} className="w-full flex flex-col">
              <div
                className={`w-full h-56 bg-cover bg-center bg-no-repeat`}
                style={{ backgroundImage: `url(${comics.coverImage[0]})` }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
