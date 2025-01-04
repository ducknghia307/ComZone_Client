import React from "react";

export default function PriceAndImages({
  currentStep,
}: {
  currentStep: number;
}) {
  if (currentStep === 2)
    return (
      <div className="flex flex-col items-stretch xl:w-2/3 mx-auto gap-8">
        <div className="flex flex-col items-stretch gap-4">
          <p className="font-semibold uppercase text-lg">1. Hình ảnh truyện</p>
        </div>
      </div>
    );
}
