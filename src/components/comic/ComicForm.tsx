// src/components/ComicForm.tsx

import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  IconButton,
  Chip,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { Grid } from "@mui/system";
import CurrencySplitter from "../../assistants/Spliter";
import Conan from "../../assets/create-comics/81a9xLAmIxL.jpg";
import Marvel from "../../assets/create-comics/c2b9e59a-453c-4736-8945-99350c18d435.jpg";
import KNY from "../../assets/create-comics/kny4365413424.jpg";
import Naruto from "../../assets/create-comics/naruto-tap-63-02_8b0691abe8ea45ae9823898669da8435_ba120370bb67482d947650c643631b96.jpg";
import OP from "../../assets/create-comics/q9h6hen6hhj71.jpg";
import OP2 from "../../assets/create-comics/op2.jpg";
import Doraemon from "../../assets/create-comics/tumblr_99c5c0ccafe338e03aadc8d18bc3c4fc_5db995e4_540.jpg";
import Naruto2 from "../../assets/create-comics/naruto2.jpg";
import JJK from "../../assets/create-comics/jjks1.jpg";
import SDO from "../../assets/create-comics/sdo1.jpg";
import KNY2 from "../../assets/create-comics/kny2.jpg";
import DBZ from "../../assets/create-comics/dragonball.jpeg";

const templateImages = [
  Conan,
  Marvel,
  KNY,
  Naruto,
  OP,
  Doraemon,
  Naruto2,
  JJK,
  SDO,
  OP2,
  KNY2,
  DBZ,
];

interface Genre {
  id: string;
  name: string;
}

interface ComicFormData {
  title: string;
  author: string;
  genre: Genre[];
  price: number;
  quantity: number;
  episodesList?: string[];
  description: string;
  publishedDate: number | null;
  edition?: string;
  condition?: string;
  page?: string;
}

interface ComicFormProps {
  isSeries: boolean | null;
  formData: ComicFormData;
  setFormData: React.Dispatch<React.SetStateAction<ComicFormData>>;
  genres: Genre[];
  coverImage: string | null;
  setCoverImage: React.Dispatch<React.SetStateAction<string | null>>;
  contentImages: string[];
  setContentImages: React.Dispatch<React.SetStateAction<string[]>>;
  handleGenreChange: (event: any, newValue: Genre[]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
const ComicForm: React.FC<ComicFormProps> = ({
  isSeries,
  formData,
  setFormData,
  genres,
  coverImage,
  setCoverImage,
  contentImages,
  setContentImages,
  handleGenreChange,
  handleSubmit,
}) => {
  const coverImageInputRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    console.log("Genres available in ComicForm:", genres);
  }, [genres]);
  const editionOptions = [
    { label: "Bản thường", value: "REGULAR" },
    { label: "Bản đặc biệt", value: "SPECIAL" },
    { label: "Bản giới hạn", value: "LIMITED" },
  ];

  const conditionOptions = [
    { label: "Đã sử dụng", value: "USED" },
    { label: "Nguyên seal", value: "SEALED" },
  ];

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]); // Only take the first file
      setCoverImage(imageUrl);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImageState: React.Dispatch<React.SetStateAction<string[]>>,
    maxImages: number
  ) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setImageState((prevImages) => {
        const combinedImages = [...prevImages, ...newImages];
        return combinedImages.slice(0, maxImages);
      });
    }
  };

  const handleRemoveImage = (
    index: number,
    setImageState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setImageState((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const renderImageUploadSection = (
    title: string,
    images: string[],
    setImageState: React.Dispatch<React.SetStateAction<string[]>>,
    maxImages: number
  ) => (
    <div className="basis-1/2 flex flex-col">
      <div className="flex items-center gap-2">
        <p className="REM font-semibold">
          {title} ({images.length}/{isSeries ? 8 : 4})
        </p>

        <input
          accept="image/*"
          type="file"
          multiple
          onChange={(e) => handleFileChange(e, setImageState, maxImages)}
          style={{ display: "none" }}
          id={`${title.replace(/\s/g, "-")}-upload`}
        />
        <label htmlFor={`${title.replace(/\s/g, "-")}-upload`}>
          <Button
            component="span"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              marginLeft: "10px",
              color: "#000",
              backgroundColor: "#fff",
              border: "1px solid black",
              borderRadius: "10px",
              padding: "5px 15px",
            }}
            startIcon={<CloudUploadOutlinedIcon />}
          >
            <p className="REM font-light">Tải lên</p>
          </Button>
        </label>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,8rem)] items-center justify-start gap-2 py-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`uploaded-${index}`}
              style={{
                width: "8em",
                height: "10em",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #DCDCDC",
              }}
            />
            <IconButton
              onClick={() => handleRemoveImage(index, setImageState)}
              sx={{
                position: "absolute",
                top: "1px",
                right: "0px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "2px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex border rounded-lg xl:w-2/3 mx-auto px-8 py-4 mb-8 max-w-[80em]">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <div className="basis-1/2 flex flex-col items-center justify-start text-center">
            <div className="flex flex-col items-center justify-center py-8 group">
              <div
                className={`${
                  coverImage ? "" : "image-upload-circle hover:opacity-70"
                } cursor-pointer flex items-center justify-center mb-4`}
                onClick={() => coverImageInputRef.current?.click()}
              >
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="cover"
                    className="object-cover w-2/3 rounded-lg duration-200 group-hover:opacity-70"
                  />
                ) : (
                  <CameraAltOutlinedIcon />
                )}
              </div>
              <p className="REM font-semibold pb-2">Ảnh bìa</p>
              <p className="REM font-light text-xs">
                Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm.
              </p>
            </div>
            <input
              type="file"
              id="coverImageUpload"
              style={{ display: "none" }}
              accept="image/*"
              ref={coverImageInputRef}
              onChange={handleImageChange}
            />
          </div>

          <div className="w-full flex flex-col items-stretch">
            {renderImageUploadSection(
              "Ảnh nội dung",
              contentImages,
              setContentImages,
              isSeries ? 8 : 4
            )}

            {contentImages.length === 0 && (
              <div className="REM w-full">
                <p className="text-xs font-light italic pb-2">
                  Gợi ý hình thức ảnh:&ensp;
                  <span className="text-xs italic text-red-500">
                    (Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập vào
                    sản phẩm của bạn)
                  </span>
                </p>
                <div className="w-full grid grid-cols-6 items-stretch justify-center gap-1">
                  {templateImages.map((image, index) => {
                    return (
                      <img
                        key={index}
                        src={image}
                        className="object-cover rounded-sm"
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <Grid
          container
          columnSpacing={4}
          rowSpacing={3}
          sx={{ paddingTop: "20px" }}
        >
          <Grid size={6}>
            <TextField
              error={formData.title.length > 100}
              fullWidth
              label={
                <p className="REM">
                  Tên truyện <span className="text-red-600">*</span>
                </p>
              }
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              variant="outlined"
              id="outlined-error-helper-text"
              helperText={
                <p
                  className={`${
                    formData.title.length <= 100 && "hidden"
                  } REM text-xs`}
                >
                  Tên truyện không chứa quá 100 ký tự!
                </p>
              }
            />
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              error={formData.author.length > 50}
              label={
                <p className="REM">
                  Tác giả <span className="text-red-600">*</span>
                </p>
              }
              name="author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              variant="outlined"
              helperText={
                <p
                  className={`${
                    formData.author.length <= 50 && "hidden"
                  } REM text-xs`}
                >
                  Tên tác giả không chứa quá 50 ký tự!
                </p>
              }
            />
          </Grid>

          <Grid size={6}>
            <Autocomplete
              multiple
              options={genres}
              getOptionLabel={(option) => option.name}
              value={formData.genre}
              filterSelectedOptions
              onChange={handleGenreChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={
                    <p className="REM">
                      Chọn thể loại <span className="text-red-600">*</span>
                    </p>
                  }
                />
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    // key={option.id}
                    label={<p className="REM">{option.name}</p>}
                    {...getTagProps({ index })}
                    onDelete={() => {
                      const newGenres = formData.genre.filter(
                        (_, i) => i !== index
                      );
                      setFormData({ ...formData, genre: newGenres });
                    }}
                  />
                ))
              }
            />
          </Grid>

          <Grid size={6}>
            <Autocomplete
              options={editionOptions}
              getOptionLabel={(option) => option.label}
              value={
                editionOptions.find((opt) => opt.value === formData.edition) ||
                null
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  edition: newValue ? newValue.value : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    <p className="REM">
                      Phiên bản <span className="text-red-600">*</span>
                    </p>
                  }
                />
              )}
            />
          </Grid>

          <Grid size={isSeries ? 6 : 4}>
            <Autocomplete
              options={conditionOptions}
              getOptionLabel={(option) => option.label}
              value={
                conditionOptions.find(
                  (opt) => opt.value === formData.condition
                ) || null
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  condition: newValue ? newValue.value : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    <p className="REM">
                      Tình trạng <span className="text-red-600">*</span>
                    </p>
                  }
                />
              )}
            />
          </Grid>

          <Grid size={isSeries ? 3 : 3}>
            <TextField
              fullWidth
              error={formData.price < 0 || formData.price > 999999999}
              label={
                <p className="REM">
                  Giá tiền (đ) <span className="text-red-600">*</span>
                </p>
              }
              type="text"
              name="price"
              value={CurrencySplitter(formData.price)}
              onChange={(e) => {
                const numberString = e.target.value.replace(/\./g, "");
                let price = 0;
                if (e.target.value.length === 0) price = 0;
                else if (/^\d+$/.test(numberString)) {
                  if (parseInt(numberString) > 999999999) price = 999999999;
                  else price = parseInt(numberString);
                }
                setFormData({ ...formData, price: price });
              }}
              variant="outlined"
              helperText={
                <p
                  className={`${
                    (formData.price >= 0 || formData.price <= 999999999) &&
                    "hidden"
                  } REM text-xs`}
                >
                  Giá tiền không hợp lệ!
                </p>
              }
            />
          </Grid>

          <Grid size={isSeries ? 3 : 3}>
            <TextField
              fullWidth
              label={<p className="REM">Năm xuất bản</p>}
              type="text"
              name="publishedDate"
              value={formData.publishedDate || ""}
              onChange={(e) => {
                let year = 0;
                if (e.target.value.length === 0) year = 0;
                if (parseInt(e.target.value) > new Date().getFullYear())
                  year = new Date().getFullYear();
                else if (/^\d+$/.test(e.target.value))
                  year = parseInt(e.target.value);
                setFormData({
                  ...formData,
                  publishedDate: year,
                  page: "",
                });
              }}
              variant="outlined"
            />
          </Grid>

          {!isSeries ? (
            <Grid size={2}>
              <TextField
                fullWidth
                label={<p className="REM">Số trang</p>}
                type="number"
                name="page"
                value={formData.page || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    page: e.target.value,
                  })
                }
                variant="outlined"
              />
            </Grid>
          ) : (
            <>
              <Grid size={4}>
                <TextField
                  fullWidth
                  error={isSeries && Number(formData.quantity) < 2}
                  label={
                    <p className="REM">
                      Số lượng cuốn trong bộ{" "}
                      <span className="text-red-600">*</span>
                    </p>
                  }
                  type="number"
                  name="quantity"
                  value={formData.quantity || ""}
                  onChange={(e) => {
                    if (Number(e.target.value) > 0)
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value),
                      });
                    else
                      setFormData({
                        ...formData,
                        quantity: 1,
                      });
                  }}
                  variant="outlined"
                  helperText={
                    <p
                      className={`${
                        Number(formData.quantity) > 1 && isSeries && "hidden"
                      } REM text-xs`}
                    >
                      Số lượng truyện tối thiểu trong bộ truyện là 2!
                    </p>
                  }
                />
              </Grid>

              <Grid size={8}>
                <Autocomplete
                  multiple
                  value={formData.episodesList}
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      episodesList: newValue.map((tags) => tags.trim()),
                    });
                  }}
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
                        <p className="REM">
                          Tập truyện số hoặc tên tập{" "}
                          <span className="text-red-600">*</span>
                        </p>
                      }
                      helperText={
                        <p className="REM italic ">
                          Nhập tên tập truyện và nhấn Enter để thêm.
                        </p>
                      }
                    />
                  )}
                />
              </Grid>
            </>
          )}

          <Grid size={12}>
            <p className="REM py-2">
              Thêm mô tả cho truyện của bạn:{" "}
              <span className="text-red-600">*</span>
            </p>
            <TextField
              fullWidth
              spellCheck="false"
              error={formData.description.length > 2000}
              placeholder="Mô tả đặc điểm thêm, tình trạng, nội dung hay trải nghiệm của bạn về truyện..."
              multiline
              rows={5}
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              variant="outlined"
              helperText={
                <p
                  className={`${
                    formData.description.length <= 2000 && "hidden"
                  } REM text-xs`}
                >
                  Mô tả không dài quá 2000 ký tự!
                </p>
              }
            />
          </Grid>
        </Grid>

        <div className="w-full flex items-center gap-2 mt-8 mb-4 REM">
          <button
            onClick={(e) => {
              e.preventDefault();
              setFormData({
                title: "",
                author: "",
                genre: [] as Genre[],
                price: 0,
                quantity: isSeries ? 2 : 1,
                episodesList: [],
                description: "",
                publishedDate: null,
                edition: "",
                condition: "",
                page: "",
              });
              setCoverImage(null);
              setContentImages([]);
            }}
            className="basis-1/3 min-w-max text-sm cursor-default"
          >
            Đặt lại
          </button>
          <button
            type="submit"
            className="grow py-2 bg-black rounded-lg text-white font-semibold duration-200 hover:bg-gray-800"
          >
            HOÀN TẤT
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComicForm;
