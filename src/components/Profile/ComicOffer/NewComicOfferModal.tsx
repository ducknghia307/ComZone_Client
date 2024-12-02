import { Modal, Radio, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import CoverImagePlaceholder from "../../../assets/image-placeholder.jpg";
import { UserInfo } from "../../../common/base.interface";
import { privateAxios } from "../../../middleware/axiosInstance";
import Loading from "../../loading/Loading";
import TextArea from "antd/es/input/TextArea";
import { DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import ActionConfirm from "../../actionConfirm/ActionConfirm";
import { Autocomplete, Chip, TextField } from "@mui/material";

interface NewComicOfferModalProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  userInfo: UserInfo;
  fetchComicExchangeOffer: () => void;
}

const NewComicOfferModal: React.FC<NewComicOfferModalProps> = ({
  isModalOpen,
  handleCancel,
  userInfo,
  fetchComicExchangeOffer,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [edition, setEdition] = useState("REGULAR");
  const [quantity, setQuantity] = useState(1);
  const [episodesList, setEpisodeList] = useState<string[]>([]);
  const [used, setUsed] = useState(1);

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

  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const isDisabled =
    title.length === 0 ||
    author.length === 0 ||
    description.length === 0 ||
    !uploadedImageFile ||
    uploadedPreviewChapterImageFiles.length === 0;

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
        if (index + uploadedPreviewChapterImageFiles.length < 4) {
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
    setEdition("REGULAR");
    setUsed(1);
    setPreviewChapterImages([]);
    setUploadedPreviewChapterImageFiles([]);
    setDescription("");
  };

  const handleSubmit = async () => {
    setLoading(true);

    console.log(uploadedImageFile);
    console.log(uploadedPreviewChapterImageFiles);
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
        description: description,
        edition,
        condition: used === 1 ? "USED" : "SEALED",
      };
      console.log(comicData);

      await privateAxios.post("/comics/exchange", comicData);

      api.success({
        message: "Thành công",
        description: "Truyện đã được thêm vào danh sách để trao đổi trao đổi!",
        duration: 2,
      });
      reset();
      fetchComicExchangeOffer();
    } catch (error) {
      api.error({
        message: "Lỗi",
        description: `${error}`,
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      {loading && <Loading />}
      <Modal
        title={<h2 className="text-xl">Thêm truyện để trao đổi</h2>}
        open={isModalOpen}
        onCancel={handleCancel}
        width={1000}
        footer={null}
      >
        <div className="w-full flex flex-row gap-4">
          <div className="w-1/5 p-4">
            <div className="flex flex-col items-center">
              <div
                className={`relative border-2 rounded-md bg-no-repeat bg-center h-60 w-full bg-contain ${
                  !uploadedImageFile && "hover:opacity-70 cursor-pointer group"
                } `}
                style={{
                  backgroundImage: `url(${
                    previewImage || CoverImagePlaceholder
                  })`,
                }}
                onClick={() => document.getElementById("upload")?.click()}
              >
                <span
                  className={`${
                    uploadedImageFile && "hidden"
                  } absolute top-2/3 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap group-hover:hidden`}
                >
                  Thêm ảnh bìa <span className="text-red-600">*</span>
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
            </div>
          </div>

          <div className="w-5/6 p-4">
            <div className="w-full flex flex-row">
              <div className="w-1/2">
                <div className="flex flex-row gap-1">
                  <h2 className="font-sm">Tựa đề:</h2>
                  <p className="text-red-500">*</p>
                </div>
                <input
                  type="text"
                  placeholder="Tựa đề của truyện..."
                  className="border border-gray-300 rounded-lg mt-2 p-2 min-w-[20em]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="w-1/2">
                <div className="flex flex-row gap-1">
                  <h2 className="font-sm">Tác giả:</h2>
                  <p className="text-red-500">*</p>
                </div>
                <input
                  type="text"
                  placeholder="Tác giả của truyện..."
                  className="border border-gray-300 rounded-lg mt-2 p-2 min-w-[20em]"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex flex-row mt-6">
              <div className="flex flex-col gap-4 w-1/2">
                <div className="flex flex-row">
                  <h2 className="font-sm">Tình trạng tối thiểu:</h2>
                  <p className="text-red-500">*</p>
                </div>
                <div className="flex flex-row w-full">
                  <Radio.Group
                    onChange={(e) => setUsed(e.target.value)}
                    value={used}
                  >
                    <Radio value={1}>Đã sử dụng</Radio>
                    <Radio value={2}>Còn nguyên seal</Radio>
                  </Radio.Group>
                </div>
              </div>

              <div className="w-1/2 flex flex-col gap-2">
                <div className="flex flex-row gap-1">
                  <h2 className="font-sm">Phiên bản:</h2>
                  <p className="text-red-500">*</p>
                </div>
                <Select
                  value={edition}
                  onChange={(value) => setEdition(value)}
                  style={{ width: 280 }}
                  options={[
                    { value: "REGULAR", label: "Phiên bản thường" },
                    { value: "SPECIAL", label: "Phiên bản đặc biệt" },
                    { value: "LIMITED", label: "Phiên bản giới hạn" },
                  ]}
                />
              </div>
            </div>

            <div className="flex items-start mt-6">
              <div className="flex flex-col gap-4 w-1/2">
                <div className="flex flex-row">
                  <h2 className="font-sm">Truyện lẻ / Bộ truyện:</h2>
                  <p className="text-red-500">*</p>
                </div>
                <div className="flex flex-row w-full items-center">
                  <Radio.Group
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}
                  >
                    <Radio checked={quantity === 1} value={1}>
                      Truyện lẻ
                    </Radio>
                    <Radio checked={quantity > 1} value={2}>
                      Bộ truyện
                    </Radio>
                  </Radio.Group>

                  {quantity > 1 && (
                    <div className="flex items-center gap-2">
                      <p className="font-light">Số lượng:</p>
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
                        className="w-[3em] p-1 border border-gray-300 rounded-md focus:!border-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {quantity > 1 && (
                <div className="flex flex-col gap-2 w-1/2">
                  <div className="flex flex-row">
                    <h2 className="font-sm">Nhập tên của tập truyện:</h2>
                    <p className="text-red-500">*</p>
                  </div>

                  <div className="flex flex-row w-full">
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
                          label={
                            <p className="REM">
                              Tập truyện số hoặc tên tập{" "}
                              <span className="text-red-600">*</span>
                            </p>
                          }
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
              )}
            </div>

            <div className="flex items-center gap-1 mt-6">
              <h2 className="font-sm">Ảnh xem trước nội dung truyện:</h2>
              <p className="text-red-500">*</p>
              <p className="font-light text-xs italic">(Tối đa 4 ảnh)</p>
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
              {previewChapterImages.length < 4 && (
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

            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả nội dung của truyện"
              autoSize={{ minRows: 3, maxRows: 5 }}
              className="mt-4 p-3"
            />
            <div className="w-full flex flex-row gap-16 mt-6 justify-end">
              <button
                className="border-none hover:opacity-70 duration-200"
                onClick={handleCancel}
              >
                HỦY BỎ
              </button>
              <button
                className="px-12 py-2 bg-black rounded-md text-white font-bold duration-200 hover:bg-gray-800 disabled:bg-gray-300 disabled:hover:bg-gray-300"
                onClick={() => setIsConfirming(true)}
                disabled={isDisabled || loading}
              >
                HOÀN TẤT
              </button>

              <ActionConfirm
                isOpen={isConfirming}
                setIsOpen={setIsConfirming}
                title="Xác nhận thêm truyện trao đổi?"
                confirmCallback={handleSubmit}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NewComicOfferModal;
