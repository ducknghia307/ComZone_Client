import React, { useState } from "react";
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
import { Input } from "antd";
import GenresSelectingModal from "./GenresSelectingModal";

export interface Genre {
  name: string;
  description: string;
}

const genresList: Genre[] = [
  {
    name: "Shounen",
    description: "Hành động, phiêu lưu dành cho nam trẻ tuổi.",
  },
  { name: "Isekai", description: "Chuyển sinh sang thế giới khác." },
  { name: "Lãng mạn", description: "Truyện tình yêu, tình cảm." },
  { name: "Shoujo", description: "Truyện dành cho nữ trẻ tuổi." },
  {
    name: "Hành động",
    description: "Truyện hấp dẫn, gay cấn với nhiều pha hành động.",
  },
  { name: "Đời thường", description: "Câu chuyện về cuộc sống thường nhật." },
  {
    name: "Giả tưởng",
    description: "Thế giới thần tiên, phép thuật và những điều kỳ ảo.",
  },
  { name: "Hài hước", description: "Truyện chọc cười, giải trí." },
  {
    name: "Phiêu lưu",
    description: "Khám phá, thám hiểm và hành trình thú vị.",
  },
  {
    name: "Seinen",
    description: "Truyện dành cho nam trưởng thành với nội dung sâu sắc.",
  },
  { name: "Kịch tính", description: "Truyện cao trào, cảm xúc mạnh." },
  { name: "Kinh dị", description: "Những câu chuyện ma quái, đáng sợ." },
  { name: "Bí ẩn", description: "Truyện điều tra, phá án, đầy bất ngờ." },
  {
    name: "Siêu nhiên",
    description: "Hiện tượng kỳ bí và không giải thích được.",
  },
  {
    name: "Học đường",
    description: "Cuộc sống học sinh, sinh viên và tuổi trẻ.",
  },
  { name: "Hành trình", description: "Những chuyến đi xa, đầy ý nghĩa." },
  {
    name: "Thể thao",
    description: "Truyện về bóng đá, bóng rổ và các môn thể thao khác.",
  },
  {
    name: "Khoa học viễn tưởng",
    description: "Công nghệ, tương lai và khám phá không gian.",
  },
  {
    name: "Chiến tranh",
    description: "Trận chiến, lịch sử và những cuộc đấu tranh.",
  },
  { name: "Người lớn", description: "Nội dung dành cho người trưởng thành." },
];

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

export default function MainComicsInformation({
  isCollection,
  setIsCollection,
  setCurrentStep,
}: {
  isCollection: boolean;
  setIsCollection: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isSelectingGenres, setIsSelectingGenres] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-stretch md:w-1/2 mx-auto gap-8">
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
            className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
          />
          <span
            className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
          >
            Tác giả <span className="text-red-600">*</span>
          </span>
        </label>

        <div className="space-y-2">
          <p>
            Thể loại: <span className="text-red-600">*</span>
          </p>

          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setIsSelectingGenres(true)}
              className="flex items-center justify-center gap-2 border-2 border-gray-500 font-semibold py-2 rounded duration-200 hover:bg-gray-100"
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
              Chọn thể loại
              <GenresSelectingModal
                open={isSelectingGenres}
                setOpen={setIsSelectingGenres}
                genresList={genresList}
              />
            </button>

            <button className="flex items-center justify-center gap-2 bg-sky-800 text-white font-semibold py-2 rounded duration-200 hover:bg-sky-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M10.6144 17.7956C10.277 18.5682 9.20776 18.5682 8.8704 17.7956L7.99275 15.7854C7.21171 13.9966 5.80589 12.5726 4.0523 11.7942L1.63658 10.7219C.868536 10.381.868537 9.26368 1.63658 8.92276L3.97685 7.88394C5.77553 7.08552 7.20657 5.60881 7.97427 3.75892L8.8633 1.61673C9.19319.821767 10.2916.821765 10.6215 1.61673L11.5105 3.75894C12.2782 5.60881 13.7092 7.08552 15.5079 7.88394L17.8482 8.92276C18.6162 9.26368 18.6162 10.381 17.8482 10.7219L15.4325 11.7942C13.6789 12.5726 12.2731 13.9966 11.492 15.7854L10.6144 17.7956ZM4.53956 9.82234C6.8254 10.837 8.68402 12.5048 9.74238 14.7996 10.8008 12.5048 12.6594 10.837 14.9452 9.82234 12.6321 8.79557 10.7676 7.04647 9.74239 4.71088 8.71719 7.04648 6.85267 8.79557 4.53956 9.82234ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899ZM18.3745 19.0469 18.937 18.4883 19.4878 19.0469 18.937 19.5898 18.3745 19.0469Z"></path>
              </svg>
              Tự động chọn bằng AI
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p>
            Mô tả truyện: <span className="text-red-600">*</span>
          </p>
          <Input.TextArea
            placeholder={`Thông tin chi tiết về truyện, quá trình sử dụng, trải nghiệm,...`}
            autoSize={{ minRows: 3, maxRows: 10 }}
            count={{ show: true, max: 2000 }}
            styles={{ textarea: { padding: "10px 15px" } }}
            className="REM"
          />
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-4">
        <p className="font-semibold uppercase">2. Thuộc tính vật lý</p>

        <div className="grid grid-cols-2 items-stretch gap-x-2">
          <FormControl fullWidth>
            <InputLabel sx={{ padding: "0px 8px" }}>
              <p className="REM">
                Bìa <span className="text-red-600">*</span>
              </p>
            </InputLabel>
            <Select
              label="Bìa **"
              sx={{ padding: "0px 8px" }}
              defaultValue={"soft"}
              // value={age}
              // onChange={handleChange}
            >
              <MenuItem value="soft">
                <p className="REM">Bìa mềm</p>
              </MenuItem>
              <MenuItem value="hard">
                <p className="REM">Bìa cứng</p>
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
              defaultValue={"grayscale"}
              // value={age}
              // onChange={handleChange}
            >
              <MenuItem value="grayscale">
                <p className="REM">Không màu</p>
              </MenuItem>
              <MenuItem value="colored">
                <p className="REM">Có màu</p>
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        {isCollection ? (
          <div className="grid grid-cols-3 items-start gap-x-2">
            <label className="col-span-1 relative cursor-text">
              <input
                type="text"
                placeholder="Số lượng cuốn"
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
        ) : (
          <div className="grid grid-cols-3 items-stretch gap-x-2">
            <label className="col-span-1 relative cursor-text">
              <input
                type="text"
                placeholder="Dài"
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
                placeholder="Dài"
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
                placeholder="Dài"
                className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
              />
              <span
                className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
              >
                Độ dày (cm)
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="flex flex-col items-stretch gap-4">
        <p className="font-semibold uppercase">
          3. Thông tin xuất bản{" "}
          <span className="font-light normal-case italic">
            (Không bắt buộc)
          </span>
        </p>
        <div className="grid grid-cols-3 items-stretch gap-x-2">
          <label className="col-span-2 relative cursor-text">
            <input
              type="text"
              placeholder="Nhà xuất bản"
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
              className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
            />
            <span
              className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
            >
              Năm xuất bản
            </span>
          </label>
        </div>

        <div className="grid grid-cols-3 items-stretch gap-x-2">
          <FormControl fullWidth className="col-span-2">
            <InputLabel sx={{ padding: "0px 8px" }}>
              <p className="REM">Xuất xứ</p>
            </InputLabel>
            <Select
              label="Xuất xứ *"
              sx={{ padding: "0px 8px" }}
              // value={age}
              // onChange={handleChange}
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
              className={`${styles.animatedInput} w-full py-4 px-4 border border-gray-400 rounded-lg border-opacity-50 outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 placeholder-gray-600 placeholder-opacity-0 transition duration-200`}
            />
            <span
              className={`${styles.inputText} italic text-opacity-80 bg-white font-light absolute left-4 top-1/2 -translate-y-1/2 px-1 transition duration-200`}
            >
              Năm phát hành
            </span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-4">
        <button
          onClick={() => setCurrentStep((prev) => prev - 1)}
          className="flex items-center gap-2 font-light hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
          </svg>
          Quay lại
        </button>
        <button
          onClick={() => setCurrentStep((prev) => prev + 1)}
          className="flex items-center justify-center gap-2 px-8 py-2 bg-cyan-700 text-white rounded duration-200 hover:bg-cyan-900"
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
