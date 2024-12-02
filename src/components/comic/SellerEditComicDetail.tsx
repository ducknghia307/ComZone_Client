/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Autocomplete,
  Chip,
  IconButton,
} from "@mui/material";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Grid } from "@mui/system";
import CurrencySplitter from "../../assistants/Spliter";
import { Comic } from "../../common/base.interface";
import { notification } from "antd";
import Loading from "../loading/Loading";
import ActionConfirm from "../actionConfirm/ActionConfirm";

interface EditComicFormData {
  title: string;
  author: string;
  genres: Genre[];
  price: number;
  quantity: number;
  episodesList: string[];
  description: string;
  publishedDate: number;
  edition: string;
  condition: string;
  page: string;
}
interface Genre {
  id: string;
  name: string;
}

const EditComicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const [currentComics, setCurrentComics] = useState<Comic>();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<EditComicFormData>({
    title: "",
    author: "",
    genres: [] as Genre[],
    price: 0,
    quantity: 1,
    episodesList: [],
    description: "",
    publishedDate: null,
    edition: "",
    condition: "",
    page: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const isSeries = currentComics && currentComics.quantity > 1;

  const availableGenres = genres.filter(
    (genre) => !formData.genres.some((selected) => selected.id === genre.id)
  );

  const [previousCoverImage, setPreviousCoverImage] = useState<
    string | null | undefined
  >(null);

  const [previousContentImages, setPreviousContentImages] = useState<string[]>(
    []
  );

  const editionOptions = [
    { label: "Bản thường", value: "REGULAR" },
    { label: "Bản đặc biệt", value: "SPECIAL" },
    { label: "Bản giới hạn", value: "LIMITED" },
  ];

  const conditionOptions = [
    { label: "Đã sử dụng", value: "USED" },
    { label: "Nguyên seal", value: "SEALED" },
  ];
  useEffect(() => {
    publicAxios
      .get("/genres")
      .then((response) => {
        const genreData = response.data;
        const genresData: Genre[] = genreData || [];

        setGenres(genresData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleUpload = async (coverImage: string, contentImages: string[]) => {
    try {
      // Ensure previous images are correctly initialized
      if (!coverImage && !previousCoverImage) {
        throw new Error("No cover image provided.");
      }
      if (!contentImages.length && previousContentImages.length === 0) {
        throw new Error("No content images provided.");
      }

      let coverImageUrl: string | undefined; // Define coverImageUrl to store the response

      // Check if the cover image is new or different
      if (coverImage && coverImage !== previousCoverImage) {
        const coverFormData = new FormData();
        const coverBlobResponse = await fetch(coverImage);
        const coverBlob = await coverBlobResponse.blob();
        const coverFile = new File([coverBlob], "coverImage.jpg", {
          type: coverBlob.type,
        });
        coverFormData.append("images", coverFile);

        const coverResponse = await publicAxios.post(
          "/file/upload/multiple-images",
          coverFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        coverImageUrl = coverResponse.data.imageUrls[0]; // Assuming the response contains an array

        // Update the previous cover image URL
        setPreviousCoverImage(coverImageUrl);
      }

      // Check for new content images
      const newContentImages = contentImages.filter(
        (image) => !previousContentImages.includes(image)
      );

      let previewChapterUrls: string[] = [];
      if (newContentImages.length > 0) {
        const contentFormData = new FormData();
        const contentBlobs = await Promise.all(
          newContentImages.map(async (blobUrl) => {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            return new File([blob], "image.jpg", { type: blob.type });
          })
        );
        contentBlobs.forEach((file) => contentFormData.append("images", file));

        const contentResponse = await publicAxios.post(
          "/file/upload/multiple-images",
          contentFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        previewChapterUrls = contentResponse.data.imageUrls;

        // Update the previous content images URLs
        setPreviousContentImages([
          ...previousContentImages,
          ...newContentImages,
        ]);
      }

      return {
        coverImageUrl,
        previewChapterUrls,
      };
    } catch (error) {
      console.error("Error uploading images:", error);
      notification.error({
        key: "failed",
        message: "Tải hình ảnh lên thất bại!",
        duration: 5,
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
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
  const handleRemoveImage = (index: number) => {
    const imageToRemove = contentImages[index];

    setRemovedImages((prev) => [...prev, imageToRemove]);

    setContentImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const uploadCoverImage = coverImage ?? "";

    const response = await handleUpload(uploadCoverImage, contentImages);

    await privateAxios
      .put(`/comics/${id}`, {
        ...formData,
        genreIds: formData.genres.map((g) => g.id),
        coverImage: response?.coverImageUrl,
        previewChapter: [
          ...previousContentImages.filter(
            (image) => !removedImages.includes(image)
          ),
          ...(Array.isArray(response?.previewChapterUrls)
            ? response.previewChapterUrls
            : []),
        ],
      })
      .then(() => {
        notification.success({
          key: "success",
          message: "Cập nhật thông tin truyện thành công.",
          duration: 5,
        });
        setRemovedImages([]);
        navigate("/sellermanagement/comic");
      })
      .catch((err) => {
        console.error("Error updating comic:", err);
        setError("Failed to update comic. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGenreChange = (event: any, newValue: Genre[]) => {
    setFormData({ ...formData, genres: newValue });
  };

  const fetchComicData = async () => {
    setLoading(true);
    await privateAxios
      .get(`/comics/${id}`)
      .then((res) => {
        const comic: Comic = res.data;

        console.log(comic);
        setCurrentComics(comic);
        setFormData({
          title: comic.title,
          author: comic.author,
          genres: comic.genres,
          price: comic.price,
          quantity: comic.quantity,
          episodesList: comic.episodesList,
          description: comic.description,
          publishedDate: comic.publishedDate && Number(comic.publishedDate),
          edition: comic.edition,
          condition: comic.condition,
          page: comic.page && comic.page.toString(),
        });

        setCoverImage(comic.coverImage || null);
        setPreviousCoverImage(comic.coverImage);
        setContentImages(comic.previewChapter || []);
        setPreviousContentImages(comic.previewChapter);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComicData();
  }, [id]);

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
              onClick={() => handleRemoveImage(index)}
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

  const isChanged =
    currentComics &&
    (formData.author !== currentComics.author ||
      formData.condition !== currentComics.condition ||
      formData.description !== currentComics.description ||
      formData.edition !== currentComics.edition ||
      formData.episodesList !== currentComics.episodesList ||
      formData.genres !== currentComics.genres ||
      formData.page !== (currentComics.page && currentComics.page.toString()) ||
      formData.price !== currentComics.price ||
      formData.publishedDate !==
        (currentComics.publishedDate && Number(currentComics.publishedDate)) ||
      formData.quantity !== currentComics.quantity ||
      formData.title !== currentComics.title ||
      coverImage !== currentComics.coverImage ||
      contentImages !== currentComics.previewChapter);

  return (
    <div className="flex flex-col items-center gap-4 border rounded-lg xl:w-2/3 mx-auto p-8 my-8 max-w-[80em] REM">
      {loading && <Loading />}
      <p className="font-bold text-2xl">CẬP NHẬT THÔNG TIN TRUYỆN</p>

      <div>
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
              spellCheck="false"
              label={
                <p className="REM">
                  Tên truyện <span className="text-red-600">*</span>
                </p>
              }
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value.trim() })
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
              spellCheck="false"
              label={
                <p className="REM">
                  Tác giả <span className="text-red-600">*</span>
                </p>
              }
              name="author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value.trim() })
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
              value={formData.genres}
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
                    key={option.id}
                    label={<p className="REM">{option.name}</p>}
                    {...getTagProps({ index })}
                    onDelete={() => {
                      const newGenres = formData.genres.filter(
                        (_, i) => i !== index
                      );
                      setFormData({ ...formData, genres: newGenres });
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
                const numberString = e.target.value.replace(/,/g, "");
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
              error={formData.description.length > 1000}
              placeholder="Mô tả đặc điểm thêm, tình trạng, nội dung hay trải nghiệm của bạn về truyện..."
              multiline
              spellCheck="false"
              rows={4}
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value.trim() })
              }
              variant="outlined"
              helperText={
                <p
                  className={`${
                    formData.description.length <= 1000 && "hidden"
                  } REM text-xs`}
                >
                  Mô tả không dài quá 1000 ký tự!
                </p>
              }
            />
          </Grid>
        </Grid>

        <div className="w-full flex items-stretch gap-2 mt-8 mb-4 REM">
          {isChanged ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                setFormData({
                  title: currentComics.title,
                  author: currentComics.author,
                  genres: currentComics.genres,
                  price: currentComics.price,
                  quantity: currentComics.quantity,
                  episodesList: currentComics.episodesList,
                  description: currentComics.description,
                  publishedDate:
                    currentComics.publishedDate &&
                    Number(currentComics.publishedDate),
                  edition: currentComics.edition,
                  condition: currentComics.condition,
                  page: currentComics.page && currentComics.page.toString(),
                });
                setCoverImage(currentComics.coverImage);
                setContentImages(currentComics.previewChapter);
              }}
              className="basis-1/3 py-2 min-w-max text-sm cursor-default border border-gray-300 rounded-md duration-200 hover:bg-gray-50"
            >
              Đặt lại
            </button>
          ) : (
            <button
              onClick={(e) => {
                navigate(-1);
              }}
              className="basis-1/3 py-2 min-w-max text-sm cursor-default border border-gray-300 rounded-md duration-200 hover:bg-gray-50"
            >
              Quay lại
            </button>
          )}

          <button
            onClick={() => setIsConfirming(true)}
            disabled={!isChanged}
            className={`grow py-2 bg-black rounded-lg text-white font-semibold duration-200 hover:bg-gray-900 disabled:bg-gray-300`}
          >
            CẬP NHẬT
          </button>
          <ActionConfirm
            isOpen={isConfirming}
            setIsOpen={setIsConfirming}
            title="Xác nhận cập nhật thông tin truyện?"
            confirmCallback={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default EditComicDetail;
