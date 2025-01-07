/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import CurrencySplitter from "../../../assistants/Spliter";
import { Comic } from "../../../common/base.interface";

export default function PriceAndImages({
  currentComics,
  setCurrentComics,
  uploadedPreviewChapters,
  setUploadedCoverImage,
  setUploadedPreviewChapters,
  resetTrigger,
}: {
  currentComics: Comic;
  setCurrentComics: React.Dispatch<React.SetStateAction<Comic>>;
  setUploadedCoverImage: React.Dispatch<React.SetStateAction<File>>;
  uploadedPreviewChapters: File[];
  setUploadedPreviewChapters: React.Dispatch<React.SetStateAction<File[]>>;
  resetTrigger: boolean;
}) {
  const [coverImage, setCoverImage] = useState<string>();

  const [previewChapters, setPreviewChapters] = useState<string[]>([]);

  const [previewChaptersPlaceholder, setPreviewChaptersPlaceholder] = useState<
    string[]
  >([]);

  const [price, setPrice] = useState<number>();

  const coverImageInputRef = useRef<HTMLInputElement>();
  const previewChaptersInputRef = useRef<HTMLInputElement>();

  const maxPreviewChapters =
    currentComics && currentComics.quantity > 1 ? 8 : 4;

  const resetComicsData = () => {
    setCoverImage(currentComics.coverImage);
    setPreviewChapters(currentComics.previewChapter);
    setPrice(currentComics.price);
  };

  useEffect(() => {
    resetComicsData();
  }, [resetTrigger]);

  const handleUploadCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files.length > 0) {
      setCoverImage(URL.createObjectURL(files[0]));
      setUploadedCoverImage(files[0]);
    }
  };

  const handleUploadPreviewChapters = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files.length > 0) {
      Array.from(files).map((file, index) => {
        if (index < maxPreviewChapters) {
          setUploadedPreviewChapters((prev) => [...prev, file]);
          setPreviewChaptersPlaceholder((prev) => [
            ...prev,
            URL.createObjectURL(file),
          ]);
        }
      });
    }
  };

  const handleRemovePreviewChapters = (index: number) => {
    setUploadedPreviewChapters(
      uploadedPreviewChapters.filter((_, i) => i !== index)
    );
    setPreviewChaptersPlaceholder(
      previewChaptersPlaceholder.filter((_, i) => i !== index)
    );
  };

  if (!currentComics) return;

  return (
    <div className="flex flex-col items-stretch xl:w-2/3 mx-auto gap-4">
      <p className="font-semibold uppercase">Hình ảnh truyện</p>

      <div className="space-y-2">
        <p className="italic font-light text-sm">
          Tải ảnh để sử dụng cho mục đích hiển thị trên trang bán (đấu giá).
        </p>

        <ul className="list-disc px-4">
          <li className="text-sm font-light">
            <span className="font-semibold text-base">Ảnh bìa</span>:{" "}
            <span className="text-red-600">*</span>&emsp;Ảnh được sử dụng chính
            làm hình minh họa cho{" "}
            {currentComics.quantity > 1 ? "bộ truyện" : "truyện"} của bạn.
          </li>

          <li className="text-sm font-light">
            <span className="font-semibold text-base">Ảnh đính kèm</span>
            &nbsp;(Tối đa {maxPreviewChapters} ảnh):{" "}
            <span className="text-red-600">*</span>&emsp;Ảnh chụp{" "}
            {currentComics.quantity > 1 ? "bộ truyện" : "truyện"} theo nhiều
            hình thức khác nhau (mặt sau, các trang truyện, phụ kiện, điểm nổi
            bật...).
          </li>
        </ul>
      </div>

      {currentComics.editionEvidence &&
        currentComics.editionEvidence.length > 0 && (
          <p className="text-red-600 font-light">
            * Vui lòng thêm vào{" "}
            <span className="font-semibold">Ảnh đính kèm</span> hình ảnh có chứa{" "}
            {currentComics.editionEvidence.length > 1 &&
              "ít nhất 1 trong những"}{" "}
            yếu tố sau:{" "}
            <span className="font-semibold">
              {currentComics.editionEvidence.map(
                (field, index) =>
                  field +
                  (index < currentComics.editionEvidence.length - 1
                    ? ", "
                    : ".")
              )}
            </span>
          </p>
        )}

      <div className="flex flex-col sm:flex-row items-stretch justify-start gap-4">
        <input
          ref={coverImageInputRef}
          type="file"
          accept="image/png, image/gif, image/jpeg"
          hidden
          onChange={handleUploadCoverImage}
        />
        <div
          onClick={() => {
            if (coverImageInputRef && !coverImage)
              coverImageInputRef.current.click();
          }}
          className={`relative group/cover min-w-[20em] w-[20em] max-w-[20em] aspect-[2/3] flex flex-col items-center justify-center mx-auto gap-2 ${
            !coverImage &&
            "cursor-pointer border-2 border-gray-500 rounded-lg duration-200 hover:text-green-700 hover:ring-2 hover:border-none ring-green-600"
          } `}
        >
          {coverImage ? (
            <div
              onClick={() => {
                if (coverImageInputRef && coverImage)
                  coverImageInputRef.current.click();
              }}
              className="cursor-pointer group/image"
            >
              <img
                src={coverImage}
                alt={currentComics.title}
                className="w-full aspect-[2/3] object-cover object-center rounded duration-200 group-hover/image:brightness-50"
              />

              <span className="hidden group-hover/cover:flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M20 3C20.5523 3 21 3.44772 21 4V5.757L19 7.757V5H5V13.1L9 9.1005L13.328 13.429L12.0012 14.7562L11.995 18.995L16.2414 19.0012L17.571 17.671L18.8995 19H19V16.242L21 14.242V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM21.7782 7.80761L23.1924 9.22183L15.4142 17L13.9979 16.9979L14 15.5858L21.7782 7.80761ZM15.5 7C16.3284 7 17 7.67157 17 8.5C17 9.32843 16.3284 10 15.5 10C14.6716 10 14 9.32843 14 8.5C14 7.67157 14.6716 7 15.5 7Z"></path>
                </svg>
                Tải ảnh khác
              </span>
            </div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8284L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z"></path>
              </svg>
              Ảnh bìa
            </>
          )}
        </div>

        <div className="grid grid-cols-4 items-center justify-center gap-2">
          {previewChapters.map((image) => (
            <button
              onClick={() => {
                setPreviewChapters(
                  previewChapters.filter((img) => img !== image)
                );
                setCurrentComics({
                  ...currentComics,
                  previewChapter: previewChapters.filter(
                    (img) => img !== image
                  ),
                });
              }}
              className="relative group/preview"
            >
              <img
                src={image}
                alt=""
                className="w-[10em] aspect-[2/3] object-cover rounded duration-200 group-hover/preview:brightness-50"
              />

              <span className="hidden group-hover/preview:block absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                </svg>
              </span>
            </button>
          ))}
          {previewChaptersPlaceholder.map((image, index) => (
            <button
              onClick={() => handleRemovePreviewChapters(index)}
              className="relative group/preview"
            >
              <img
                src={image}
                alt=""
                className="w-[10em] aspect-[2/3] object-cover rounded duration-200 group-hover/preview:brightness-50"
              />

              <span className="hidden group-hover/preview:block absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                </svg>
              </span>
            </button>
          ))}
          <input
            ref={previewChaptersInputRef}
            type="file"
            multiple
            accept="image/png, image/gif, image/jpeg"
            hidden
            onChange={handleUploadPreviewChapters}
          />

          {previewChapters.length + previewChaptersPlaceholder.length <
            maxPreviewChapters && (
            <button
              onClick={() => {
                if (previewChaptersInputRef)
                  previewChaptersInputRef.current.click();
              }}
              className={`w-[10em] aspect-[2/3] flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-md text-sm p-4 duration-200 hover:bg-gray-100`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
              </svg>
              <p>Ảnh đính kèm</p>
            </button>
          )}
        </div>
      </div>

      <p className="font-semibold uppercase">Giá bán truyện</p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-center gap-4 sm:gap-2">
        <label className="basis-1/3 relative cursor-text">
          <input
            type="text"
            placeholder="Giá bán *"
            value={price > 0 ? CurrencySplitter(price) : undefined}
            onChange={(e) => {
              let newPrice: number;
              if (e.target.value.length === 0) newPrice = undefined;
              else {
                const priceValue = e.target.value.replace(/\./g, "");
                if (/^\d+$/.test(priceValue)) {
                  const numberValue = Number(priceValue);
                  if (numberValue > 99999000) newPrice = 99999000;
                  else newPrice = numberValue;
                }
              }
              setPrice(newPrice);
              setCurrentComics({ ...currentComics, price: newPrice });
            }}
            className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
          />
          <span
            className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
          >
            Giá bán (&#8363;) <span className="text-red-600">*</span>
          </span>
        </label>

        <div className="grow grid md:grid-cols-4 grid-cols-2 gap-2">
          {[10000, 20000, 30000, 50000, 100000, 120000, 150000, 200000].map(
            (value) => (
              <button
                key={value}
                className={`p-4 duration-200 rounded ${
                  price === value
                    ? "bg-gray-900 text-white font-semibold"
                    : "bg-white text-black border border-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setPrice(value);
                  setCurrentComics({ ...currentComics, price: value });
                }}
              >
                {CurrencySplitter(value)} &#8363;
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
