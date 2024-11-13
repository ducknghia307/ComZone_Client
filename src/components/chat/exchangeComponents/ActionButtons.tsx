import React from "react";

export default function ActionButtons({
  currentStage,
}: {
  currentStage: number;
}) {
  switch (currentStage) {
    case 1:
      return (
        <div className="flex items-stretch justify-center px-2 mt-1">
          <button className="w-full bg-sky-700 text-white py-1 rounded-lg duration-200 hover:bg-sky-800">Tiến hành đặt cọc</button>
        </div>
      );
    case 2:
    case 3:
    case 4:
  }
}
