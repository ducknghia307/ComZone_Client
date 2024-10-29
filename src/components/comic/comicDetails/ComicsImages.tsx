import React from "react";

export default function ComicsImages({
  currentImage,
  setCurrentImage,
  imageList,
}: {
  currentImage: string;
  setCurrentImage: Function;
  imageList: string[];
}) {
  return (
    <div className="w-full bg-white flex flex-col items-center justify-center rounded-xl py-2 drop-shadow-md top-4 sticky">
      <div className="w-2/3 p-2">
        <img src={currentImage} alt="" className="object-cover border" />
      </div>
      <div className="flex items-center justify-center gap-2">
        {imageList.map((img: string) => {
          return (
            <button
              className={`border ${
                currentImage.match(img) && "border-black"
              } p-1 ${!currentImage.match(img) && "hover:opacity-80"}`}
              onClick={() => setCurrentImage(img)}
            >
              <img src={img} alt="" className="object-cover max-w-[5em]" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
