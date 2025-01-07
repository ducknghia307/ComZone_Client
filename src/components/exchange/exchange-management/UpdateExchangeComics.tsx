import { message, Modal, notification, Slider } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Comic } from "../../../common/base.interface";
import { privateAxios, publicAxios } from "../../../middleware/axiosInstance";
import {
  Autocomplete,
  Button,
  Chip,
  IconButton,
  TextField,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "../../loading/Loading";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { Grid } from "@mui/system";
import ActionConfirm from "../../actionConfirm/ActionConfirm";
import { SliderSingleProps } from "antd/lib";
import { Condition } from "../../../common/interfaces/condition.interface";

interface EditComicFormData {
  title: string;
  author: string;
  quantity: number;
  episodesList: string[];
  description: string;
  condition: Condition;
}

const formatGradingScaleToMarks = (
  gradingScale: Condition[]
): SliderSingleProps["marks"] => {
  const marks: SliderSingleProps["marks"] = {};

  gradingScale.forEach((item) => {
    marks[item.value] = {
      label: (
        <p className="whitespace-nowrap text-xs sm:text-base">
          {item.isRemarkable ? item.name : ""}
        </p>
      ),
    };
  });

  return marks;
};

export default function UpdateExchangeComics({
  setIsOpen,
  comics,
  fetchComicExchangeOffer,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<Comic>>;
  comics: Comic;
  fetchComicExchangeOffer: () => void;
}) {
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<EditComicFormData>({
    title: comics.title,
    author: comics.author,
    quantity: comics.quantity,
    episodesList: comics.episodesList || [],
    description: comics.description,
    condition: comics.condition,
  });

  const [conditionGradingScales, setConditionGradingScales] = useState<
    Condition[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const isSeries = comics && comics.quantity > 1;

  const [coverImage, setCoverImage] = useState<string | null>(
    comics.coverImage
  );
  const [uploadedCoverImageFile, setUploadedCoverImageFile] = useState<File>();

  const [previewChapters, setPreviewChapters] = useState<string[]>(
    comics.previewChapter
  );
  const [chaptersImagePlaceholder, setChaptersImagePlaceholder] = useState<
    string[]
  >([]);
  const [uploadedChaptersFile, setUploadedChaptersFile] = useState<File[]>([]);

  const handleUpload = async () => {
    try {
      let coverImageUrl: string = comics.coverImage;

      if (coverImage !== coverImageUrl) {
        const coverResponse = await privateAxios.post(
          "/file/upload/image",
          { image: uploadedCoverImageFile },
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        coverImageUrl = coverResponse.data.imageUrl;

        setCoverImage(coverImageUrl);
      }

      const previewChapterUrls: string[] = previewChapters;
      if (uploadedChaptersFile.length > 0) {
        await Promise.all(
          uploadedChaptersFile.map(async (file) => {
            await publicAxios
              .post(
                "/file/upload/image",
                { image: file },
                { headers: { "Content-Type": "multipart/form-data" } }
              )
              .then((res) => previewChapterUrls.push(res.data.imageUrl));
          })
        );
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

  const handleUploadCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
      setCoverImage(imageUrl);
      setUploadedCoverImageFile(files[0]);
    }
  };

  const handleUploadPreviewChapters = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const max = comics.quantity > 1 ? 8 : 4;
    if (e.target.files) {
      Array.from(e.target.files).map((file, index) => {
        if (index + previewChapters.length < max) {
          setChaptersImagePlaceholder((prev) => [
            ...prev,
            URL.createObjectURL(file),
          ]);

          setUploadedChaptersFile((prev) => [...prev, file]);
        }
      });
    }
  };

  const handleRemovePreviewChaptersImage = (index: number) => {
    setPreviewChapters((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };

  const handleRemoveUploadedChapters = (index: number) => {
    setChaptersImagePlaceholder((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
    setUploadedChaptersFile((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!coverImage || coverImage.length === 0) {
      message.warning("Vui lòng thêm ảnh bìa!", 5);
      return;
    }

    if (previewChapters.length === 0 && uploadedChaptersFile.length === 0) {
      message.warning("Vui lòng thêm ít nhất 1 ảnh xem trước truyện!", 5);
      return;
    }

    if (
      formData.title.length === 0 ||
      formData.author.length === 0 ||
      formData.description.length === 0
    ) {
      message.warning("Vui lòng điền đầy đủ những thông tin bắt buộc!", 5);
      return;
    }

    if (
      isSeries &&
      (formData.episodesList.length === 0 ||
        formData.episodesList.length > formData.quantity)
    ) {
      message.warning({
        key: "series",
        content: (
          <p className="REM">
            {formData.episodesList.length === 0
              ? "Vui lòng nhập ít nhất tên (hoặc số) của một tập truyện!"
              : "Số lượng tên tập truyện không phù hợp với số lượng cuốn trọng bộ!"}
          </p>
        ),
        duration: 5,
      });
      return;
    }

    try {
      setLoading(true);
      const uploadResponse = await handleUpload();

      console.log("UPLOAD: ", uploadResponse);

      await privateAxios
        .put(`/comics/${comics.id}`, {
          ...formData,
          coverImage: uploadResponse.coverImageUrl,
          previewChapter: uploadResponse.previewChapterUrls,
        })
        .then(() => {
          notification.success({
            key: "success",
            message: "Cập nhật thông tin truyện thành công.",
            duration: 5,
          });
          setIsOpen(null);
          fetchComicExchangeOffer();
        })
        .catch((err) => {
          console.error("Error updating comic:", err);
        });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const isNotChanged =
    comics &&
    formData.author === comics.author &&
    formData.condition === comics.condition &&
    formData.description === comics.description &&
    formData.episodesList === comics.episodesList &&
    formData.quantity === comics.quantity &&
    formData.title === comics.title &&
    coverImage === comics.coverImage &&
    previewChapters.length === comics.previewChapter.length &&
    uploadedChaptersFile.length === 0;

  const reset = () => {
    setFormData({
      title: comics.title,
      author: comics.author,
      quantity: comics.quantity,
      episodesList: comics.episodesList,
      description: comics.description,
      condition: comics.condition,
    });

    setCoverImage(comics.coverImage);
    setUploadedCoverImageFile(null);
    setPreviewChapters(comics.previewChapter);
    setUploadedChaptersFile([]);
    setChaptersImagePlaceholder([]);
  };

  const fetchConditions = async () => {
    await publicAxios
      .get("conditions")
      .then((res) => {
        setConditionGradingScales(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    reset();
    fetchConditions();
  }, []);

  return (
    <Modal
      open={comics !== null}
      onCancel={(e) => {
        e.stopPropagation();
        reset();
        setIsOpen(null);
      }}
      footer={null}
      width={1000}
      centered
      styles={{ content: { padding: "0" } }}
    >
      <div className="flex flex-col items-center gap-4 border rounded-lg mx-auto p-8 max-w-[80em] REM">
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
                onChange={handleUploadCoverImage}
              />
            </div>

            <div className="w-full flex flex-col items-stretch">
              <div className="basis-1/2 flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="REM font-semibold">
                    Ảnh nội dung: (
                    {previewChapters.concat(chaptersImagePlaceholder).length}/
                    {isSeries ? 8 : 4})
                  </p>

                  <input
                    accept="image/*"
                    type="file"
                    multiple
                    onChange={handleUploadPreviewChapters}
                    style={{ display: "none" }}
                    id={`preview-upload`}
                  />
                  <label htmlFor={`preview-upload`}>
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
                  {previewChapters.map((image: string, index: number) => (
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
                        onClick={() => handleRemovePreviewChaptersImage(index)}
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
                  {chaptersImagePlaceholder.map(
                    (image: string, index: number) => (
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
                          onClick={() => handleRemoveUploadedChapters(index)}
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
                    )
                  )}
                </div>
              </div>
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
                spellCheck="false"
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

            {isSeries && (
              <>
                <Grid size={3}>
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

                <Grid size={6}>
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

            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-row">
                <h2 className="font-sm">Tình trạng truyện:</h2>
                <p className="text-red-500">*</p>
              </div>
              <div className="px-4">
                <Slider
                  marks={formatGradingScaleToMarks(conditionGradingScales)}
                  step={null}
                  tooltip={{ open: false }}
                  value={formData.condition.value}
                  onChange={(value: number) =>
                    setFormData({
                      ...formData,
                      condition: conditionGradingScales.find(
                        (condition) => condition.value === value
                      ),
                    })
                  }
                  max={10}
                />
              </div>

              <div className="xl:w-1/2 mx-auto flex flex-col items-stretch justify-start gap-2 px-2 sm:px-4 text-sm">
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path d="M22 20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20ZM11 15H4V19H11V15ZM20 11H13V19H20V11ZM11 5H4V13H11V5ZM20 5H13V9H20V5Z"></path>
                  </svg>
                  <p className="font-light">Tình trạng:&emsp;</p>
                  <p className="text-base font-semibold">
                    {formData.condition.name}
                  </p>
                </span>

                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M15 3H21V21H3V15H7V11H11V7H15V3ZM17 5V9H13V13H9V17H5V19H19V5H17Z"></path>
                  </svg>
                  <p className="font-light">Độ mới:&emsp;</p>
                  <p className="text-base font-semibold">
                    {formData.condition.value}/10
                  </p>
                </span>

                {formData.condition.usageLevel && (
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                    >
                      <path d="M12 22C6.47715 22 2 17.5228 2 12 2 6.47715 6.47715 2 12 2 17.5228 2 22 6.47715 22 12 22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12 20 7.58172 16.4183 4 12 4 7.58172 4 4 7.58172 4 12 4 16.4183 7.58172 20 12 20ZM13 10.5V15H14V17H10V15H11V12.5H10V10.5H13ZM13.5 8C13.5 8.82843 12.8284 9.5 12 9.5 11.1716 9.5 10.5 8.82843 10.5 8 10.5 7.17157 11.1716 6.5 12 6.5 12.8284 6.5 13.5 7.17157 13.5 8Z"></path>
                    </svg>
                    <p className="font-light">Mức độ sử dụng:&emsp;</p>
                    <p className="text-base font-semibold">
                      {formData.condition.usageLevel}
                    </p>
                  </span>
                )}

                <p className="text-sm font-light italic h-[6em] phone:h-[5em]">
                  {formData.condition.description}
                </p>
              </div>
            </div>

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
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
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
            {!isNotChanged ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  reset();
                }}
                className="basis-1/3 py-2 min-w-max text-sm cursor-default border border-gray-300 rounded-md duration-200 hover:bg-gray-50"
              >
                Đặt lại
              </button>
            ) : (
              <button
                onClick={(e) => {
                  reset();
                  setIsOpen(null);
                }}
                className="basis-1/3 py-2 min-w-max text-sm cursor-default border border-gray-300 rounded-md duration-200 hover:bg-gray-50"
              >
                Quay lại
              </button>
            )}

            <button
              onClick={() => setIsConfirming(true)}
              disabled={isNotChanged}
              className={`grow py-2 bg-gray-800 rounded-lg text-white font-semibold duration-200 hover:bg-gray-600 disabled:bg-gray-300`}
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
    </Modal>
  );
}
