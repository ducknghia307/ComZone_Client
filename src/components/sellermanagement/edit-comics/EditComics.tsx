import React, { useEffect, useState } from "react";
import MainComicsInformation from "./MainComicsInformation";
import EditionAndCondition from "./EditionAndCondition";
import { Edition } from "../../../common/interfaces/edition.interface";
import PriceAndImages from "./PriceAndImages";
import { privateAxios } from "../../../middleware/axiosInstance";
import { CircularProgress } from "@mui/material";
import { notification } from "antd";
import { Merchandise } from "../../../common/interfaces/merchandise.interface";
import { Comic, Genre } from "../../../common/base.interface";
import ActionConfirm from "../../actionConfirm/ActionConfirm";

export interface ComicMainInformation {
  title: string;
  author: string;
  quantity: number;
  episodesList: string[] | null;
  genres: Genre[];
  description: string;

  cover: "SOFT" | "HARD" | "DETACHED";
  color: "GRAYSCALE" | "COLORED";
  page?: number;
  length?: number;
  width?: number;
  thickness?: number;

  merchandises: Merchandise[];

  publisher?: string;
  publicationYear?: number;
  originCountry?: string;
  releaseYear?: number;
}

export interface ConditionAndEditionResponse {
  condition: number;
  edition: Edition;
  evidenceFields: string[];
  willNotAuction: boolean;
}

export interface PriceAndImagesResponse {
  coverImage: File;
  previewChapters: File[];
  price: number;
}

export default function EditComics({
  comics,
  setIsEditingComics,
  fetchSellerComics,
}: {
  comics: Comic;
  setIsEditingComics: React.Dispatch<React.SetStateAction<Comic>>;
  fetchSellerComics: () => void;
}) {
  const [currentComics, setCurrentComics] = useState<Comic>(comics);

  const [uploadedCoverImage, setUploadedCoverImage] = useState<File>();
  const [uploadedPreviewChapters, setUploadedPreviewChapters] = useState<
    File[]
  >([]);

  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const [resetTrigger, setResetTrigger] = useState<boolean>(false);

  const [updateProgress, setUpdateProgress] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const normalizeObject = (obj: object) => {
    return JSON.stringify(
      Object.keys(obj)
        .sort()
        .reduce((sortedObj, key) => {
          (sortedObj as any)[key] = (obj as any)[key];
          return sortedObj;
        }, {})
    );
  };

  const isNotChanged =
    comics &&
    normalizeObject(comics) === normalizeObject(currentComics) &&
    !uploadedCoverImage &&
    uploadedPreviewChapters.length === 0;

  const handleSubmitEditingComics = async () => {
    setIsLoading(true);

    let newCoverImage: string;
    const newPreviewChapters: string[] = [];

    if (uploadedCoverImage)
      await privateAxios
        .post(
          "file/upload/image",
          {
            image: uploadedCoverImage,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((res) => {
          newCoverImage = res.data.imageUrl;
          setUpdateProgress(33);
        })
        .catch((err) => {
          console.log("Error uploading cover image: ", err);
          setIsLoading(false);
        });
    else setUpdateProgress(33);

    if (uploadedPreviewChapters.length > 0)
      await Promise.all(
        uploadedPreviewChapters.map(async (file) => {
          await privateAxios
            .post(
              "file/upload/image",
              {
                image: file,
              },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              newPreviewChapters.push(res.data.imageUrl);
              setUpdateProgress(
                (prev) => prev + Math.round(33 / uploadedPreviewChapters.length)
              );
            })
            .catch((err) => {
              console.log("Error uploading preview chapter images: ", err);
              setIsLoading(false);
            });
        })
      );
    else setUpdateProgress(66);

    const comicsData = {
      ...currentComics,
      genres: currentComics.genres.map((genre) => genre.id),
      merchandises: currentComics.merchandises.map((merch) => merch.id),
      edition: currentComics.edition.id,
      editionEvidence:
        currentComics.editionEvidence &&
        currentComics.editionEvidence.length > 0
          ? currentComics.editionEvidence
          : null,
      coverImage: uploadedCoverImage ? newCoverImage : currentComics.coverImage,
      previewChapter:
        uploadedPreviewChapters.length > 0
          ? newPreviewChapters
          : currentComics.previewChapter,
    };
    console.log({ comicsData });

    await privateAxios
      .put(`comics/${comics.id}`, comicsData)
      .then(() => {
        setUpdateProgress(100);

        notification.success({
          key: "success",
          message: "Cập nhật thông tin truyện thành công",
          description: `Thông tin của truyện "${currentComics.title}" đã được cập nhật.`,
          duration: 8,
        });

        fetchSellerComics();
        setIsEditingComics(undefined);
      })
      .catch((err) => {
        notification.error({
          message: "Đã có lỗi xảy ra khi cập nhật thông tin truyện.",
          duration: 5,
        });
        console.log("Error editing comics: ", err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setCurrentComics(comics);
  }, [comics]);

  if (!comics) return;

  if (isLoading)
    return (
      <div className="REM w-full h-[70vh] flex flex-col items-center justify-center gap-4">
        <p className="font-light text-sm">Đang cập nhật thông tin truyện ...</p>

        <div className="relative inline-flex">
          <CircularProgress
            variant="determinate"
            color="inherit"
            value={updateProgress}
          />

          <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-xs font-light">
            {updateProgress}%
          </p>
        </div>
      </div>
    );

  return (
    <div className="REM flex flex-col gap-8">
      <div className="flex items-center justify-start gap-4">
        <button
          onClick={() => setIsEditingComics(undefined)}
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

        <p className="text-2xl font-bold uppercase">
          Chỉnh sửa thông tin truyện
        </p>
      </div>

      <MainComicsInformation
        currentComics={currentComics}
        setCurrentComics={setCurrentComics}
        resetTrigger={resetTrigger}
      />

      <EditionAndCondition
        currentComics={currentComics}
        setCurrentComics={setCurrentComics}
        resetTrigger={resetTrigger}
      />

      <PriceAndImages
        currentComics={currentComics}
        setCurrentComics={setCurrentComics}
        setUploadedCoverImage={setUploadedCoverImage}
        uploadedPreviewChapters={uploadedPreviewChapters}
        setUploadedPreviewChapters={setUploadedPreviewChapters}
        resetTrigger={resetTrigger}
      />

      <div className="w-full xl:w-2/3 mx-auto flex flex-col-reverse sm:flex-row items-stretch gap-1">
        <button
          onClick={() => {
            if (isNotChanged) setIsEditingComics(undefined);
            else setResetTrigger(!resetTrigger);
          }}
          className="sm:basis-1/3 border border-gray-300 rounded-md py-2 duration-200 hover:bg-gray-100"
        >
          {isNotChanged ? "Quay lại" : "Đặt lại"}
        </button>
        <button
          disabled={isNotChanged}
          onClick={() => setIsConfirming(true)}
          className="grow bg-green-700 text-white rounded-md py-2 duration-200 hover:bg-green-800 disabled:bg-gray-300"
        >
          Hoàn tất
        </button>

        {isConfirming && (
          <ActionConfirm
            isOpen={isConfirming}
            setIsOpen={setIsConfirming}
            title="Xác nhận cập nhật thông tin truyện?"
            confirmCallback={handleSubmitEditingComics}
            cancelCallback={() => {}}
          />
        )}
      </div>
    </div>
  );
}
