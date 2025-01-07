/* eslint-disable react-hooks/exhaustive-deps */
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
import { Comic, Genre } from "../../../common/base.interface";
import { Merchandise } from "../../../common/interfaces/merchandise.interface";

const originCountriesList = [
  "Nhật Bản",
  "Hàn Quốc",
  "Mỹ",
  "Trung Quốc",
  "Việt Nam",
  "Pháp",
  "Đức",
  "Brazil",
  "Ý",
  "Canada",
  "Tây Ban Nha",
  "Argentina",
  "Mexico",
  "Anh",
  "Ấn Độ",
  "Nga",
  "Thái Lan",
  "Indonesia",
  "Philippines",
  "Singapore",
];

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
  currentComics,
  setCurrentComics,
  resetTrigger,
}: {
  currentComics: Comic;
  setCurrentComics: React.Dispatch<React.SetStateAction<Comic>>;
  resetTrigger: boolean;
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

  const isCollection = currentComics && currentComics.quantity > 1;

  useEffect(() => {
    fetchGenres();
    fetchMerchandises();
  }, []);

  const resetComicsData = () => {
    if (!currentComics) return;
    setTitle(currentComics.title);
    setAuthor(currentComics.author);
    setQuantity(currentComics.quantity);
    setEpisodesList(currentComics.episodesList);
    setGenres(currentComics.genres);
    setDescription(currentComics.description);
    setCover(currentComics.cover);
    setColor(currentComics.color);
    setPage(currentComics.page);
    setWidth(currentComics.width);
    setLength(currentComics.length);
    setThickness(currentComics.thickness);
    setMerchandises(currentComics.merchandises);
    setPublisher(currentComics.publisher);
    setPublicationYear(currentComics.publicationYear);
    setOriginCountry(currentComics.originCountry);
    setReleaseYear(currentComics.releaseYear);
  };

  useEffect(() => {
    resetComicsData();
  }, [resetTrigger]);

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
  };

  if (!currentComics) return;

  return (
    <div className="flex flex-col items-stretch xl:w-2/3 mx-auto gap-8">
      <div className="flex flex-col items-stretch gap-4">
        <p className="font-semibold uppercase">
          Định danh {currentComics.quantity > 1 && "bộ"} truyện
        </p>

        <label className="w-full relative cursor-text">
          <input
            type="text"
            placeholder="Tên truyện"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setCurrentComics({ ...currentComics, title: e.target.value });
            }}
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
            onChange={(e) => {
              setAuthor(e.target.value);
              setCurrentComics({ ...currentComics, author: e.target.value });
            }}
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
                  ) {
                    setQuantity(2);

                    setCurrentComics({
                      ...currentComics,
                      quantity: 2,
                    });
                  } else {
                    if (Number(e.target.value) > 99) {
                      setQuantity(99);
                      setCurrentComics({
                        ...currentComics,
                        quantity: 99,
                      });
                    } else {
                      setQuantity(Number(e.target.value));
                      setCurrentComics({
                        ...currentComics,
                        quantity: Number(e.target.value),
                      });
                    }
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
                  setCurrentComics({
                    ...currentComics,
                    episodesList: value.map((v) => v.trim()),
                  });
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
              currentComics={currentComics}
              setCurrentComics={setCurrentComics}
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
            onChange={(e) => {
              setDescription(e.target.value);
              setCurrentComics({
                ...currentComics,
                description: e.target.value,
              });
            }}
            styles={{ textarea: { padding: "10px 15px" } }}
            className="REM"
          />
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-4">
        <p className="font-semibold uppercase">Thuộc tính vật lý</p>

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
              onChange={(e) => {
                setCover(e.target.value as "SOFT" | "HARD" | "DETACHED");

                setCurrentComics({
                  ...currentComics,
                  cover: e.target.value as "SOFT" | "HARD" | "DETACHED",
                });
              }}
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
              onChange={(e) => {
                setColor(e.target.value as "GRAYSCALE" | "COLORED");
                setCurrentComics({
                  ...currentComics,
                  color: e.target.value as "GRAYSCALE" | "COLORED",
                });
              }}
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
                  let newPage: number;
                  if (e.target.value.length === 0) {
                    newPage = undefined;
                  }
                  if (/^[0-9]*$/.test(e.target.value)) {
                    if (Number(e.target.value) > 999999) newPage = 999999;
                    else newPage = Number(e.target.value);
                  }

                  setPage(newPage);
                  setCurrentComics({
                    ...currentComics,
                    page: newPage,
                  });
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

        <div className="grow flex flex-col sm:flex-row items-stretch gap-1">
          {popularSize.map((size) => {
            const isSelected =
              width === size.width &&
              length === size.length &&
              thickness === size.thickness;
            return (
              <button
                onClick={() => {
                  setWidth(size.width);
                  setLength(size.length);
                  setThickness(size.thickness);

                  setCurrentComics({
                    ...currentComics,
                    width: size.width,
                    length: size.length,
                    thickness: size.thickness,
                  });
                }}
                className={`grow ${
                  isSelected
                    ? "ring-1 ring-black font-semibold"
                    : "hover:bg-gray-100"
                } border border-gray-300 rounded px-4 py-1 duration-100`}
              >
                {size.length} x {size.width} x {size.thickness}{" "}
                <span className="text-xs">(cm)</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-stretch gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 items-stretch gap-2">
            <label className="col-span-1 relative cursor-text">
              <input
                type="text"
                placeholder="Chiều dài"
                value={length}
                onChange={(e) => {
                  let newLength: number;
                  if (e.target.value.length === 0) {
                    newLength = undefined;
                  }
                  if (/^\d+([.,]\d+)?$/.test(e.target.value)) {
                    if (Number(e.target.value) > 100) newLength = 100;
                    else newLength = Number(e.target.value);
                  }

                  setLength(newLength);
                  setCurrentComics({
                    ...currentComics,
                    length: newLength,
                  });
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
                  let newWidth: number;
                  if (e.target.value.length === 0) {
                    newWidth = undefined;
                  }
                  if (/^\d+([.,]\d+)?$/.test(e.target.value)) {
                    if (Number(e.target.value) > 100) newWidth = 100;
                    else newWidth = Number(e.target.value);
                  }

                  setWidth(newWidth);
                  setCurrentComics({
                    ...currentComics,
                    width: newWidth,
                  });
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
                  let newThickness: number;
                  if (e.target.value.length === 0) {
                    newThickness = undefined;
                  }
                  if (/^\d+([.,]\d+)?$/.test(e.target.value)) {
                    if (Number(e.target.value) > 100) newThickness = 100;
                    else newThickness = Number(e.target.value);
                  }

                  setThickness(newThickness);
                  setCurrentComics({
                    ...currentComics,
                    thickness: newThickness,
                  });
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

          <div className="flex flex-col items-stretch gap-2">
            <p className="text-sm italic font-light text-sky-600">
              * Kích thước phổ biến:
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-4">
        <p className="font-semibold uppercase">
          Phụ kiện đính kèm{" "}
          <span className="normal-case font-light">(nếu có)</span>
        </p>

        <div className="grid sm:grid-cols-2 items-stretch justify-start gap-2">
          {merchandisesList.map((merch, index) => {
            const isSelected = merchandises.some((m) => m.name === merch.name);
            return (
              <button
                key={index}
                onClick={() => {
                  if (isSelected) {
                    setMerchandises(
                      merchandises.filter((m) => m.name !== merch.name)
                    );
                    setCurrentComics({
                      ...currentComics,
                      merchandises: currentComics.merchandises.filter(
                        (m) => m.name !== merch.name
                      ),
                    });
                  } else {
                    setMerchandises((prev) => [...prev, merch]);
                    setCurrentComics({
                      ...currentComics,
                      merchandises: [...currentComics.merchandises, merch],
                    });
                  }
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
                <p className="font-light text-xs">{merch.description ?? ""}</p>
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
          Thông tin xuất bản{" "}
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
              onChange={(e) => {
                setPublisher(e.target.value);
                setCurrentComics({
                  ...currentComics,
                  publisher: e.target.value,
                });
              }}
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
                if (e.target.value.length === 0) setPublicationYear(undefined);
                else {
                  if (/^[0-9]*$/.test(e.target.value)) {
                    const numberValue = Number(e.target.value);
                    if (numberValue > new Date().getFullYear()) {
                      setPublicationYear(new Date().getFullYear());
                      setCurrentComics({
                        ...currentComics,
                        publicationYear: new Date().getFullYear(),
                      });
                    } else {
                      setPublicationYear(numberValue);
                      setCurrentComics({
                        ...currentComics,
                        publicationYear: numberValue,
                      });
                    }
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
          <FormControl fullWidth className="col-span-2">
            <InputLabel sx={{ padding: "0px 8px" }}>
              <p className="REM">Xuất xứ</p>
            </InputLabel>
            <Select
              label="Xuất xứ *"
              sx={{ padding: "0px 8px" }}
              value={originCountry}
              onChange={(e) => {
                setOriginCountry(e.target.value);
                setCurrentComics({
                  ...currentComics,
                  originCountry: e.target.value,
                });
              }}
            >
              {originCountriesList.map((country) => (
                <MenuItem key={country} value={country}>
                  <p className="REM">{country}</p>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
                    if (numberValue > new Date().getFullYear()) {
                      setReleaseYear(new Date().getFullYear());
                      setCurrentComics({
                        ...currentComics,
                        releaseYear: new Date().getFullYear(),
                      });
                    } else {
                      setReleaseYear(numberValue);
                      setCurrentComics({
                        ...currentComics,
                        releaseYear: numberValue,
                      });
                    }
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
    </div>
  );
}
