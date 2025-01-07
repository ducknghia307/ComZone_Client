import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import {
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Input, message } from "antd";
import GenresSelectingModal from "./GenresSelectingModal";
import { publicAxios } from "../../../middleware/axiosInstance";
import { BaseInterface } from "../../../common/base.interface";
import { ComicMainInformation } from "./CreateNewComics";
import { Merchandise } from "../../../common/interfaces/merchandise.interface";

export interface Genre extends BaseInterface {
  name: string;
  description: string;
}

const popularSize = [
  {
    length: 18,
    width: 13,
    thickness: 1.5,
  },
  {
    length: 26,
    width: 17,
    thickness: 2,
  },
];

export default function MainComicsInformation({
  currentStep,
  isCollection,
  setIsCollection,
  handleGettingMainInfo,
}: {
  currentStep: number;
  isCollection: boolean;
  setIsCollection: React.Dispatch<React.SetStateAction<boolean>>;
  handleGettingMainInfo: (value: ComicMainInformation) => void;
}) {
  const [title, setTitle] = useState<string>();
  const [author, setAuthor] = useState<string>();
  const [quantity, setQuantity] = useState<number>(1);
  const [episodesList, setEpisodesList] = useState<string[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [description, setDescription] = useState<string>();

  const [cover, setCover] = useState<"SOFT" | "HARD" | "DETACHED">("SOFT");
  const [color, setColor] = useState<"GRAYSCALE" | "COLORED">("GRAYSCALE");
  const [page, setPage] = useState<number>();
  const [width, setWidth] = useState<number>();
  const [length, setLength] = useState<number>();
  const [thickness, setThickness] = useState<number>();

  const [merchandisesList, setMerchandisesList] = useState<Merchandise[]>([]);
  const [merchandises, setMerchandises] = useState<Merchandise[]>([]);

  const [publisher, setPublisher] = useState<string>();
  const [publicationYear, setPublicationYear] = useState<number>();
  const [originCountry, setOriginCountry] = useState<string>();
  const [releaseYear, setReleaseYear] = useState<number>();

  const [yearError, setYearError] = useState<boolean>(false);

  const [genresList, setGenresList] = useState<Genre[]>([]);
  const [isSelectingGenres, setIsSelectingGenres] = useState<boolean>(false);

  const fetchGenres = async () => {
    await publicAxios
      .get("genres")
      .then((res) => {
        setGenresList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchMerchandises = async () => {
    await publicAxios
      .get("merchandises")
      .then((res) => {
        setMerchandisesList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchGenres();
    fetchMerchandises();
  }, []);

  useEffect(() => {
    if (!isCollection) setQuantity(1);
    if (isCollection) setQuantity(2);
  }, [isCollection]);

  useEffect(() => {
    if (!publicationYear || !releaseYear) {
      if (yearError) setYearError(false);
      return;
    }
    if (publicationYear < 1000 || releaseYear < 1000) {
      if (yearError) setYearError(false);
      return;
    }

    if (publicationYear < releaseYear) setYearError(true);
  }, [publicationYear, releaseYear, yearError]);

  const handleSubmitMainInfo = () => {
    if (
      publicationYear &&
      releaseYear &&
      (publicationYear < 1800 ||
        releaseYear < 1800 ||
        publicationYear < releaseYear)
    ) {
      message.error({
        key: "form-error",
        content: (
          <p className="REM text-start">
            Thời gian phát hành và xuất bản truyện không hợp lệ!
          </p>
        ),
        duration: 5,
      });
      return;
    }

    if (isCollection && episodesList.length === 0) {
      message.error({
        key: "form-error",
        content: (
          <p className="REM text-start">
            Vui lòng nhập ít nhất tên 1 tập truyện trong bộ!
          </p>
        ),
        duration: 5,
      });
      return;
    }

    if (!title || !author || genres.length === 0 || !description) {
      const missingFields = [];
      if (!title) missingFields.push("Tựa đề");
      if (!author) missingFields.push("Tác giả");
      if (genres.length === 0) missingFields.push("Thể loại");
      if (!description) missingFields.push("Mô tả");

      message.error({
        key: "form-error",
        content: (
          <p className="REM text-start">
            Vui lòng điền đầy đủ những thông tin bắt buộc!
            <br />
            <span className="text-red-600 font-semibold">
              Thiếu:{" "}
              {missingFields.map(
                (field, index) =>
                  `${field}${index < missingFields.length - 1 ? ", " : "."}`
              )}
            </span>
          </p>
        ),
        duration: 8,
      });
      return;
    }

    handleGettingMainInfo({
      title,
      author,
      quantity,
      episodesList: isCollection ? episodesList : null,
      genres,
      description,
      cover,
      color,
      page,
      width,
      length,
      thickness,
      merchandises,
      publisher,
      publicationYear,
      originCountry,
      releaseYear,
    });
  };

  if (currentStep === 0)
    return (
      <div className="flex flex-col items-stretch xl:w-2/3 mx-auto gap-8">
        <div className="flex items-stretch gap-1">
          <button
            onClick={() => setIsCollection(false)}
            className={`grow flex items-center justify-center gap-2 py-2 px-8 border border-gray-300 rounded duration-200 ${
              !isCollection
                ? "bg-gray-900 text-white font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M21 18H6C5.44772 18 5 18.4477 5 19C5 19.5523 5.44772 20 6 20H21V22H6C4.34315 22 3 20.6569 3 19V4C3 2.89543 3.89543 2 5 2H21V18ZM5 16.05C5.16156 16.0172 5.32877 16 5.5 16H19V4H5V16.05ZM16 9H8V7H16V9Z"></path>
            </svg>
            Truyện lẻ
          </button>
          <button
            onClick={() => setIsCollection(true)}
            className={`grow flex items-center justify-center gap-2 py-2 px-8 border border-gray-300 rounded duration-200 ${
              isCollection
                ? "bg-gray-900 text-white font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H14C14.5523 21 15 20.5523 15 20V15.2973L15.9995 19.9996C16.1143 20.5398 16.6454 20.8847 17.1856 20.7699L21.0982 19.9382C21.6384 19.8234 21.9832 19.2924 21.8684 18.7522L18.9576 5.0581C18.8428 4.51788 18.3118 4.17304 17.7716 4.28786L14.9927 4.87853C14.9328 4.38353 14.5112 4 14 4H10C10 3.44772 9.55228 3 9 3H4ZM10 6H13V14H10V6ZM10 19V16H13V19H10ZM8 5V15H5V5H8ZM8 17V19H5V17H8ZM17.3321 16.6496L19.2884 16.2338L19.7042 18.1898L17.7479 18.6057L17.3321 16.6496ZM16.9163 14.6933L15.253 6.86789L17.2092 6.45207L18.8726 14.2775L16.9163 14.6933Z"></path>
            </svg>
            Bộ truyện
          </button>
        </div>

        <div className="flex flex-col items-stretch gap-4">
          <p className="font-semibold uppercase">1. Định danh truyện</p>

          <label className="w-full relative cursor-text">
            <input
              type="text"
              placeholder="Tên truyện"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
            />
            <span
              className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
            >
              {isCollection ? "Tên bộ truyện" : "Tựa đề"}{" "}
              <span className="text-red-600">*</span>
            </span>
          </label>

          <label className="w-full relative cursor-text">
            <input
              type="text"
              placeholder="Tác giả"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`${styles.animatedInput} group w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
            />
            <span
              className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
            >
              Tác giả <span className="text-red-600">*</span>
            </span>
          </label>

          {isCollection && (
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start gap-2">
              <label className="col-span-1 relative cursor-text">
                <input
                  type="number"
                  placeholder="Số lượng cuốn"
                  min={2}
                  max={99}
                  value={quantity}
                  onChange={(e) => {
                    if (
                      !/^[0-9]*$/.test(e.target.value) ||
                      Number(e.target.value) < 2
                    )
                      setQuantity(2);
                    else {
                      if (Number(e.target.value) > 99) setQuantity(99);
                      else setQuantity(Number(e.target.value));
                    }
                  }}
                  className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
                />
                <span
                  className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
                >
                  Số lượng cuốn <span className="text-red-600">*</span>
                </span>
              </label>

              <div className="col-span-2 relative cursor-text">
                <Autocomplete
                  multiple
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  options={[]}
                  value={episodesList}
                  onChange={(_, value) => {
                    setEpisodesList(value.map((v) => v.trim()));
                  }}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          variant="outlined"
                          label={<p className="REM font-light">{option}</p>}
                          {...tagProps}
                        />
                      );
                    })
                  }
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        {option}
                      </li>
                    );
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <p className="REM font-light">
                          Tập truyện số hoặc tên tập{" "}
                          <span className="text-red-600">*</span>
                        </p>
                      }
                      helperText={
                        <p className="REM italic font-light">
                          Nhập tên tập truyện và nhấn Enter để thêm.
                        </p>
                      }
                    />
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p>
              Thể loại: <span className="text-red-600">*</span>
            </p>

            {genres.length > 0 && (
              <div
                className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-1`}
              >
                {genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white rounded px-4 py-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                    >
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>{" "}
                    <p className="line-clamp-1">{genre.name}</p>
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsSelectingGenres(true)}
              className={`${
                genres.length > 0 ? "sm:w-fit" : "grow"
              } flex items-center justify-center gap-2 border border-gray-500 font-semibold p-2 rounded duration-200 hover:bg-gray-100`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M18 15L17.999 18H21V20H17.999L18 23H16L15.999 20H13V18H15.999L16 15H18ZM11 18V20H3V18H11ZM21 11V13H3V11H21ZM21 4V6H3V4H21Z"></path>
              </svg>
              {genres.length > 0 ? "Chỉnh sửa" : "Chọn thể loại"}
              <GenresSelectingModal
                open={isSelectingGenres}
                setOpen={setIsSelectingGenres}
                genresList={genresList}
                genres={genres}
                setGenres={setGenres}
              />
            </button>
          </div>

          <div className="space-y-2">
            <p>
              Mô tả truyện: <span className="text-red-600">*</span>
            </p>
            <Input.TextArea
              placeholder={`Thông tin về truyện, quá trình sử dụng, trải nghiệm,...`}
              spellCheck="false"
              autoSize={{ minRows: 3, maxRows: 10 }}
              count={{ show: true, max: 2000 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              styles={{ textarea: { padding: "10px 15px" } }}
              className="REM"
            />
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-4">
          <p className="font-semibold uppercase">2. Thuộc tính vật lý</p>

          <div
            className={`grid sm:grid-cols-${
              isCollection ? 2 : 3
            } items-stretch gap-2`}
          >
            <FormControl fullWidth>
              <InputLabel sx={{ padding: "0px 8px" }}>
                <p className="REM">
                  Bìa <span className="text-red-600">*</span>
                </p>
              </InputLabel>
              <Select
                label="Bìa **"
                sx={{ padding: "0px 8px" }}
                value={cover}
                onChange={(e) =>
                  setCover(e.target.value as "SOFT" | "HARD" | "DETACHED")
                }
              >
                <MenuItem value="SOFT">
                  <p className="REM">Bìa mềm</p>
                </MenuItem>
                <MenuItem value="HARD">
                  <p className="REM">Bìa cứng</p>
                </MenuItem>
                <MenuItem value="DETACHED">
                  <p className="REM">Bìa rời</p>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ padding: "0px 8px" }}>
                <p className="REM">
                  Màu <span className="text-red-600">*</span>
                </p>
              </InputLabel>
              <Select
                label="Màu **"
                sx={{ padding: "0px 8px" }}
                value={color}
                onChange={(e) =>
                  setColor(e.target.value as "GRAYSCALE" | "COLORED")
                }
              >
                <MenuItem value="GRAYSCALE">
                  <p className="REM">Trắng đen</p>
                </MenuItem>
                <MenuItem value="COLORED">
                  <p className="REM">Có màu</p>
                </MenuItem>
              </Select>
            </FormControl>

            {!isCollection && (
              <label className="relative cursor-text">
                <input
                  type="text"
                  placeholder="Số trang"
                  value={page}
                  onChange={(e) => {
                    if (e.target.value.length === 0) {
                      setPage(undefined);
                      return;
                    }
                    if (/^[0-9]*$/.test(e.target.value)) {
                      if (Number(e.target.value) > 999999) setPage(999999);
                      else setPage(Number(e.target.value));
                    }
                  }}
                  className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
                />
                <span
                  className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
                >
                  Số trang
                </span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 items-stretch gap-2">
            <label className="col-span-1 relative cursor-text">
              <input
                type="text"
                placeholder="Chiều dài"
                value={length}
                onChange={(e) => {
                  if (e.target.value.length === 0) {
                    setLength(undefined);
                    return;
                  }
                  if (/^\d+([.,]\d+)?$/.test(e.target.value)) {
                    if (Number(e.target.value) > 100) setLength(100);
                    else setLength(Number(e.target.value));
                  }
                }}
                className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
              />
              <span
                className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
              >
                Chiều dài (cm)
              </span>
            </label>

            <label className="col-span-1 relative cursor-text">
              <input
                type="text"
                placeholder="Chiều rộng"
                value={width}
                onChange={(e) => {
                  if (e.target.value.length === 0) {
                    setWidth(undefined);
                    return;
                  }
                  if (/^\d+([.,]\d+)?$/.test(e.target.value)) {
                    if (Number(e.target.value) > 100) setWidth(100);
                    else setWidth(Number(e.target.value));
                  }
                }}
                className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
              />
              <span
                className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
              >
                Chiều rộng (cm)
              </span>
            </label>

            <label className="col-span-1 relative cursor-text">
              <input
                type="text"
                placeholder="Độ dày"
                value={thickness}
                onChange={(e) => {
                  if (e.target.value.length === 0) {
                    setThickness(undefined);
                    return;
                  }
                  if (/^\d+([.,]\d+)?$/.test(e.target.value)) {
                    if (Number(e.target.value) > 100) setThickness(100);
                    else setThickness(Number(e.target.value));
                  }
                }}
                className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
              />
              <span
                className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
              >
                Độ dày (cm)
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-4">
          <p className="font-semibold uppercase">3. Phụ kiện đính kèm</p>

          <p className="text-sm font-light italic">
            Chọn những phụ kiện sẽ được bán kèm theo{" "}
            {isCollection ? "bộ truyện" : "truyện"} (nếu có):
          </p>

          <div className="grid sm:grid-cols-2 items-stretch justify-start gap-2">
            {merchandisesList.map((merch, index) => {
              const isSelected = merchandises.some(
                (m) => m.name === merch.name
              );
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (isSelected)
                      setMerchandises(
                        merchandises.filter((m) => m.name !== merch.name)
                      );
                    else setMerchandises((prev) => [...prev, merch]);
                  }}
                  className={`flex flex-col items-start justify-start gap-1 text-start border border-gray-300 rounded-md p-2 duration-300 ${
                    isSelected && "border-white ring-2 ring-green-600"
                  }`}
                >
                  <div className="flex items-center justify-start gap-1">
                    <p
                      className={`font-semibold duration-200 ${
                        isSelected && "text-green-600"
                      }`}
                    >
                      {merch.name}&nbsp;
                      {merch.subName && (
                        <span className="font-light">({merch.subName})</span>
                      )}
                    </p>

                    {isSelected && (
                      <span className="text-green-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="currentColor"
                        >
                          <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="font-light text-xs">
                    {merch.description ?? ""}
                  </p>
                </button>
              );
            })}
          </div>

          <p className="w-full text-end italic text-xs font-light">
            * Hệ thống chỉ hỗ trợ đính kèm những loại hình phụ kiện trên.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-4">
          <p className="font-semibold uppercase">
            4. Thông tin xuất bản{" "}
            <span className="font-light normal-case italic">
              (Không bắt buộc)
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 items-stretch gap-x-2 gap-y-3">
            <label className="col-span-2 relative cursor-text">
              <input
                type="text"
                placeholder="Nhà xuất bản"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
              />
              <span
                className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
              >
                Nhà xuất bản
              </span>
            </label>

            <label className="col-span-1 relative cursor-text">
              <input
                type="text"
                placeholder="Năm xuất bản"
                value={publicationYear}
                onChange={(e) => {
                  if (e.target.value.length === 0)
                    setPublicationYear(undefined);
                  else {
                    if (/^[0-9]*$/.test(e.target.value)) {
                      const numberValue = Number(e.target.value);
                      if (numberValue > new Date().getFullYear())
                        setPublicationYear(new Date().getFullYear());
                      else setPublicationYear(numberValue);
                    }
                  }
                }}
                className={`${
                  styles.animatedInput
                } w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none ${
                  yearError && "ring-2 ring-red-600"
                } focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
              />
              <span
                className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
              >
                Năm xuất bản
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 items-stretch gap-x-2 gap-y-3">
            <label className="col-span-2 relative cursor-text">
              <input
                type="text"
                placeholder="Xuất xứ"
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
              />
              <span
                className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
              >
                Xuất xứ
              </span>
            </label>

            <label className="col-span-1 relative cursor-text">
              <input
                type="text"
                placeholder="Năm phát hành"
                value={releaseYear}
                onChange={(e) => {
                  if (e.target.value.length === 0) setReleaseYear(undefined);
                  else {
                    if (/^[0-9]*$/.test(e.target.value)) {
                      const numberValue = Number(e.target.value);
                      if (numberValue > new Date().getFullYear())
                        setReleaseYear(new Date().getFullYear());
                      else setReleaseYear(numberValue);
                    }
                  }
                }}
                className={`${
                  styles.animatedInput
                } w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none ${
                  yearError && "relative ring-2 ring-red-600"
                } focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
              />
              <span
                className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
              >
                Năm phát hành
              </span>

              {yearError && (
                <p className="absolute text-red-600 text-xs translate-y-1">
                  Thời gian xuất bản và phát hành truyện không phù hợp!
                </p>
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-8">
          <button
            onClick={handleSubmitMainInfo}
            className="grow flex items-center justify-center gap-2 px-8 py-2 bg-cyan-700 text-white rounded duration-200 hover:bg-cyan-900"
          >
            Tiếp tục{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z"></path>
            </svg>
          </button>
        </div>
      </div>
    );
}
