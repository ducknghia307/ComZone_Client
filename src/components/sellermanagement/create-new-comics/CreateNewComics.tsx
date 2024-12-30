import React, { useState } from "react";
import MainComicsInformation from "./MainComicsInformation";
import EditionAndCondition from "./EditionAndCondition";

export default function CreateNewComics({
  setIsCreatingComics,
}: {
  setIsCreatingComics: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [isCollection, setIsCollection] = useState<boolean>(false);

  return (
    <div className="REM flex flex-col gap-8">
      <div className="flex items-center justify-start gap-4">
        <button
          onClick={() => setIsCreatingComics(false)}
          className="duration-200 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
          </svg>
        </button>

        <p className="text-2xl font-bold uppercase">Thêm truyện mới</p>
      </div>

      <div className="flex items-center gap-4 px-4 lg:w-2/3 mx-auto">
        <div
          className={`${
            currentStep === 0 ? "font-semibold" : "font-light opacity-50"
          } ${
            currentStep > 0 && "text-green-600 opacity-80"
          } flex items-center gap-1 duration-200`}
        >
          {currentStep > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M3 6H21V18H3V6ZM2 4C1.44772 4 1 4.44772 1 5V19C1 19.5523 1.44772 20 2 20H22C22.5523 20 23 19.5523 23 19V5C23 4.44772 22.5523 4 22 4H2ZM13 9H19V11H13V9ZM18 13H13V15H18V13ZM6 13H7V16H9V11H6V13ZM9 8H7V10H9V8Z"></path>
            </svg>
          )}
          Thông tin chính
        </div>

        <span className={`grow border-b`}></span>

        <div
          className={`${
            currentStep > 0 ? "font-semibold" : "font-light opacity-50"
          } ${
            currentStep > 1 && "text-green-600 opacity-50"
          } flex items-center gap-1 duration-200`}
        >
          {currentStep > 1 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"></path>
            </svg>
          )}
          Phiên bản & Tình trạng
        </div>

        <span className={`grow border-b`}></span>

        <div
          className={`${
            currentStep > 1 ? "font-semibold" : "font-light opacity-50"
          } ${
            currentStep > 2 && "text-green-600 opacity-80"
          } flex items-center gap-1 duration-200`}
        >
          {currentStep > 1 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M3 10C3 10.5523 3.44772 11 4 11L12 11C12.5523 11 13 10.5523 13 10V4C13 3.44772 12.5523 3 12 3H4C3.44772 3 3 3.44772 3 4V10ZM11 20C11 20.5523 11.4477 21 12 21H20C20.5523 21 21 20.5523 21 20V14C21 13.4477 20.5523 13 20 13H12C11.4477 13 11 13.4477 11 14V20ZM13 15H19V19H13V15ZM3 20C3 20.5523 3.44772 21 4 21H8C8.55229 21 9 20.5523 9 20V14C9 13.4477 8.55229 13 8 13H4C3.44772 13 3 13.4477 3 14V20ZM5 19V15H7V19H5ZM5 9V5L11 5L11 9L5 9ZM20 11C20.5523 11 21 10.5523 21 10V4C21 3.44772 20.5523 3 20 3H16C15.4477 3 15 3.44772 15 4V10C15 10.5523 15.4477 11 16 11H20ZM19 9H17V5H19V9Z"></path>
            </svg>
          )}
          Hiển thị
        </div>
      </div>

      {currentStep === 0 && (
        <MainComicsInformation
          isCollection={isCollection}
          setIsCollection={setIsCollection}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 1 && <EditionAndCondition />}
    </div>
  );
}
