/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Radio, notification, message, Slider, Input } from "antd";
import React, { useEffect, useState } from "react";
import CoverImagePlaceholder from "../../../assets/image-placeholder.jpg";
import { UserInfo } from "../../../common/base.interface";
import { privateAxios, publicAxios } from "../../../middleware/axiosInstance";
import { DeleteOutlined } from "@ant-design/icons";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { SliderSingleProps } from "antd/lib";
import { Condition } from "../../../common/interfaces/condition.interface";

interface NewComicOfferModalProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  userInfo: UserInfo;
  fetchComicExchangeOffer: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

const NewComicOfferModal: React.FC<NewComicOfferModalProps> = ({
  isModalOpen,
  handleCancel,
  userInfo,
  fetchComicExchangeOffer,
  isLoading,
  setIsLoading,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isSeries, setIsSeries] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);
  const [episodesList, setEpisodeList] = useState<string[]>([]);

  const [conditionGradingScales, setConditionGradingScales] = useState<
    Condition[]
  >([]);
  const [condition, setCondition] = useState<Condition>();

  const [description, setDescription] = useState("");

  const [uploadedImageFile, setUploadedImageFile] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();

  const [
    uploadedPreviewChapterImageFiles,
    setUploadedPreviewChapterImageFiles,
  ] = useState<File[]>([]);
  const [previewChapterImages, setPreviewChapterImages] = useState<string[]>(
    []
  );

  const maxPreviewChapters = quantity > 1 ? 8 : 4;

  const fetchConditions = async () => {
    await publicAxios
      .get("conditions")
      .then((res) => {
        const fetchedConditions: Condition[] = res.data;
        setConditionGradingScales(fetchedConditions);
        if (fetchedConditions.length > 0)
          setCondition(
            fetchedConditions[Math.floor(fetchedConditions.length / 2)]
          );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchConditions();
  }, []);

  useEffect(() => {
    if (quantity === 1) {
      setPreviewChapterImages(
        previewChapterImages.slice(0, maxPreviewChapters)
      );
      setUploadedPreviewChapterImageFiles(
        uploadedPreviewChapterImageFiles.slice(0, maxPreviewChapters)
      );
    }
  }, [quantity]);

  const isDisabled =
    title.length === 0 ||
    author.length === 0 ||
    description.length === 0 ||
    !uploadedImageFile ||
    uploadedPreviewChapterImageFiles.length === 0 ||
    (isSeries && episodesList.length === 0);

  const handleImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewImage(url);
      setUploadedImageFile(e.target.files[0]);
    }
  };

  const handleRemoveUploadImage = () => {
    setPreviewImage(null);
    setUploadedImageFile(null);
  };

  const handlePreviewChapterChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      fileArray.map((file, index) => {
        if (
          index + uploadedPreviewChapterImageFiles.length <
          maxPreviewChapters
        ) {
          const url = URL.createObjectURL(file);
          setPreviewChapterImages((prev) => [...prev, url]);
          setUploadedPreviewChapterImageFiles((prev) => [...prev, file]);
        }
      });
    }
  };

  const handleRemovePreviewChapterImage = (index: number) => {
    setPreviewChapterImages(
      previewChapterImages.filter((value, i) => i !== index)
    );
    setUploadedPreviewChapterImageFiles(
      uploadedPreviewChapterImageFiles.filter((value, i) => i !== index)
    );
  };

  const reset = () => {
    setTitle("");
    setAuthor("");
    setPreviewImage(null);
    setUploadedImageFile(null);
    setCondition(
      conditionGradingScales.length > 0 &&
        conditionGradingScales[Math.floor(conditionGradingScales.length / 2)]
    );
    setPreviewChapterImages([]);
    setUploadedPreviewChapterImageFiles([]);
    setDescription("");
    setQuantity(1);
    setIsSeries(false);
    setEpisodeList([]);
  };

  const handleSubmit = async () => {
    if (isSeries && quantity < 2) {
      message.warning({
        key: "series",
        content: <p className="REM">Bộ truyện phải có ít nhất 2 cuốn!</p>,
        duration: 5,
      });
      return;
    }

    if (
      isSeries &&
      (episodesList.length === 0 || episodesList.length > quantity)
    ) {
      message.warning({
        key: "series",
        content: (
          <p className="REM">
            {episodesList.length === 0
              ? "Vui lòng nhập ít nhất tên (hoặc số) của một tập truyện!"
              : "Số lượng tên tập truyện không phù hợp với số lượng cuốn trọng bộ!"}
          </p>
        ),
        duration: 5,
      });
      return;
    }
    setIsLoading(true);
    handleCancel();

    try {
      let coverImage: string;
      const previewChapters: string[] = [];

      await privateAxios
        .post(
          "file/upload/image",
          {
            image: uploadedImageFile,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          coverImage = res.data.imageUrl;
        });

      if (uploadedPreviewChapterImageFiles.length > 0) {
        await Promise.all(
          uploadedPreviewChapterImageFiles.map(async (file) => {
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
                previewChapters.push(res.data.imageUrl);
              });
          })
        );
      }

      const comicData = {
        title,
        author,
        coverImage,
        previewChapter: previewChapters,
        description,
        condition: condition.value,
        quantity,
        episodesList,
      };

      await privateAxios.post("comics/exchange", comicData);

      notification.success({
        message: "Thành công",
        description: "Truyện đã được thêm vào danh sách để trao đổi!",
        duration: 5,
      });

      reset();
      fetchComicExchangeOffer();
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Lỗi",
        description: `Vui lòng thử lại sau!`,
        duration: 2,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={<h2 className="text-xl">Thêm truyện để trao đổi</h2>}
      open={isModalOpen}
      onCancel={() => {
        reset();
        handleCancel();
      }}
      width={1000}
      footer={null}
    >
      <div className="w-full flex flex-col sm:flex-row items-stretch justify-start gap-4 sm:gap-8">
        <div className="flex flex-col items-center gap-2">
          <div
            className={`relative border-2 rounded-md bg-no-repeat bg-center w-full aspect-square bg-contain ${
              !uploadedImageFile && "hover:opacity-70 cursor-pointer group"
            } `}
            style={{
              backgroundImage: `url(${previewImage || CoverImagePlaceholder})`,
            }}
            onClick={() => document.getElementById("upload")?.click()}
          >
            <span
              className={`${
                uploadedImageFile && "hidden"
              } w-full absolute top-3/4 left-1/2 -translate-x-1/2 text-[0.8em] text-center group-hover:hidden`}
            >
              <span className="text-red-600">*</span> Nhấn vào để thêm ảnh bìa
            </span>
            <input
              type="file"
              id="upload"
              accept="image/png, image/gif, image/jpeg"
              hidden
              onChange={handleImageUploadChange}
            />
          </div>

          {previewImage && (
            <button
              className="mt-2 text-red-500 text-xs"
              onClick={handleRemoveUploadImage}
            >
              <DeleteOutlined style={{ fontSize: 16 }} />
            </button>
          )}

          <p className="font-light text-xs italic text-gray-500 text-center mt-4">
            Ảnh bìa được dùng để người khác nhận diện truyện của bạn.
          </p>
        </div>

        <div className="w-full flex flex-col items-stretch gap-4">
          <div className="w-full flex flex-col items-stretch gap-4">
            <div className="w-full flex gap-2">
              <h2 className="font-sm">Truyện lẻ / Bộ truyện:</h2>
              <p className="text-red-500">*</p>
            </div>
            <div className="flex flex-row w-full items-center">
              <Radio
                value={isSeries}
                checked={isSeries === false}
                onChange={() => {
                  setIsSeries(false);
                  setQuantity(1);
                  setEpisodeList([]);
                }}
              >
                Truyện lẻ
              </Radio>
              <Radio
                value={isSeries}
                checked={isSeries === true}
                onChange={() => {
                  setIsSeries(true);
                  setQuantity(2);
                }}
              >
                Bộ truyện
              </Radio>
            </div>
          </div>

          <div className="w-full flex flex-col">
            <p className="font-sm">
              Tựa đề: <span className="text-red-500">*</span>
            </p>

            <input
              type="text"
              placeholder="Tựa đề của truyện..."
              className="font-light border border-gray-300 rounded-lg mt-2 p-2 min-w-[20em]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col">
            <p className="font-sm">
              Tác giả: <span className="text-red-500">*</span>
            </p>

            <input
              type="text"
              placeholder="Tác giả của truyện..."
              className="font-light border border-gray-300 rounded-lg mt-2 p-2 min-w-[20em]"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          {isSeries && (
            <div className="flex items-start">
              <div className="w-full grid grid-cols-3 items-start gap-2">
                <div className="col-span-1 flex flex-col items-start gap-2">
                  <p className="text-sm">
                    Số lượng: <span className="text-red-600">*</span>
                  </p>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      if (e.target.value.length > 0) {
                        const number = Number(e.target.value);
                        setQuantity(number);
                      } else setQuantity(2);
                    }}
                    min={2}
                    max={99}
                    className="w-full p-2 border border-gray-300 rounded-md focus:!border-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className="col-span-2 flex flex-col items-stretch gap-2">
                  <p className="text-sm">
                    Tập truyện số hoặc tên tập:{" "}
                    <span className="text-red-600">*</span>
                  </p>

                  <div className="w-full">
                    <Autocomplete
                      size="small"
                      multiple
                      value={episodesList}
                      onChange={(event, newValue) => {
                        setEpisodeList(newValue.map((tags) => tags.trim()));
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
                          hiddenLabel
                          helperText={
                            <p className="REM italic">
                              Nhập tên tập truyện và nhấn Enter để thêm.
                            </p>
                          }
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
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
                value={condition?.value}
                onChange={(value: number) =>
                  setCondition(
                    conditionGradingScales.find(
                      (condition) => condition.value === value
                    )
                  )
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
                <p className="text-base font-semibold">{condition?.name}</p>
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
                <p className="text-base font-semibold">{condition?.value}/10</p>
              </span>

              {condition?.usageLevel && (
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
                    {condition?.usageLevel}
                  </p>
                </span>
              )}

              <p className="text-sm font-light italic h-[6em] phone:h-[5em]">
                {condition?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <h2 className="font-sm">Ảnh xem trước nội dung truyện:</h2>
            <p className="text-red-500">*</p>
            <p className="font-light text-xs italic">
              (Tối đa {maxPreviewChapters} ảnh)
            </p>
          </div>

          <div className="flex gap-2 mt-2">
            {previewChapterImages.map((imgUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imgUrl}
                  alt={`preview chapter ${index}`}
                  className="w-20 h-20 object-cover transition-opacity duration-200 ease-in-out group-hover:opacity-50 rounded-md border p-1"
                />
                <button
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleRemovePreviewChapterImage(index)}
                >
                  <DeleteOutlined style={{ fontSize: 16 }} />
                </button>
              </div>
            ))}
            {previewChapterImages.length < maxPreviewChapters && (
              <label htmlFor="previewChapterUpload">
                <button
                  className=" h-20 w-20 p-4 border bg-gray-100 hover:opacity-75 duration-200 rounded-lg flex flex-col items-center justify-center gap-2"
                  onClick={() =>
                    document.getElementById("previewChapterUpload")?.click()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8284L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z"></path>
                  </svg>
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/gif, image/jpeg"
                    onChange={handlePreviewChapterChange}
                    hidden
                    id="previewChapterUpload"
                  />
                </button>
              </label>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm">
              Mô tả: <span className="text-red-600">*</span>
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

          <div className="w-full flex flex-row gap-16 pt-6 justify-end">
            <button
              className="border-none hover:opacity-70 duration-200"
              onClick={reset}
            >
              Đặt lại
            </button>
            <button
              className="px-12 py-2 bg-black rounded-md text-white font-bold duration-200 hover:bg-gray-800 disabled:bg-gray-300 disabled:hover:bg-gray-300"
              onClick={handleSubmit}
              disabled={isDisabled || isLoading}
            >
              THÊM TRUYỆN
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NewComicOfferModal;
