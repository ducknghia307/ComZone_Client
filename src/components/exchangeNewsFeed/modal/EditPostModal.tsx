import { Modal, notification, Popover } from "antd";
import React, { SetStateAction, useEffect, useState } from "react";
import { ExchangePostInterface } from "../../../common/interfaces/exchange.interface";
import { privateAxios } from "../../../middleware/axiosInstance";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import TextArea from "antd/es/input/TextArea";
import { DeleteOutlined } from "@ant-design/icons";
import ActionConfirm from "../../actionConfirm/ActionConfirm";

export default function EditPostModal({
  open,
  setOpen,
  post,
  setIsLoading,
  fetchExchangeNewsFeed,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<string>>;
  post: ExchangePostInterface;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  fetchExchangeNewsFeed: () => void;
}) {
  const [newPostContent, setNewPostContent] = useState<string>(
    post.postContent
  );
  const [newImages, setNewImages] = useState<string[]>(post.images || []);
  const [uploadedImageFiles, setUploadedImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const isNotChanged =
    post.postContent === newPostContent.trim() &&
    uploadedImageFiles.length === 0 &&
    post.images.length === newImages.length &&
    post.images.every(function (value, index) {
      return value === newImages[index];
    });

  const reset = () => {
    setNewPostContent(post.postContent);
    setNewImages(post.images || []);
    setUploadedImageFiles([]);
    setPreviewImages([]);
  };

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      fileArray.map((file, index) => {
        if (index + uploadedImageFiles.length < 8) {
          const url = URL.createObjectURL(file);
          setPreviewImages((prev) => [...prev, url]);
          setUploadedImageFiles((prev) => [...prev, file]);
        }
      });
    }
  };
  const handleRemoveUploadImage = (index: number) => {
    setPreviewImages(previewImages.filter((value, i) => i !== index));
    setUploadedImageFiles(uploadedImageFiles.filter((value, i) => i !== index));
  };

  const handleClose = () => {
    reset();
    setIsConfirming(false);
    setOpen("");
  };

  const handleSubmitEdit = async () => {
    setTimeout(() => setIsConfirming(false), 0);
    setOpen("");
    setIsLoading(true);

    const newUpdatedImages: string[] = [];
    if (uploadedImageFiles.length > 0) {
      await Promise.all(
        uploadedImageFiles.map(async (file) => {
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
              newUpdatedImages.push(res.data.imageUrl);
            })
            .catch((err) => console.log(err));
        })
      );
    }

    await privateAxios
      .patch(`exchange-posts/repost/${post.id}`, {
        postContent: newPostContent,
        images: newImages.concat(newUpdatedImages),
      })
      .then(() => {
        notification.success({
          key: "edit",
          message: "Cập nhật bài viết thành công",
          duration: 5,
        });
        fetchExchangeNewsFeed();
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          key: "edit",
          message: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
          duration: 5,
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={800}
    >
      <div className="flex flex-col gap-4 pt-4">
        <p className="text-xl font-semibold">CHỈNH SỬA BÀI VIẾT TRAO ĐỔI</p>

        <div className="flex flex-col gap-4 px-2 py-2rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="w-full flex items-center gap-4">
              <img
                src={post.user.avatar}
                className="w-[4em] h-[4em] rounded-full"
              />
              <div className="flex flex-col items-start gap-1">
                <p className="font-semibold text-lg tracking-wide">
                  {post.user.name}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <TextArea
              value={newPostContent}
              onChange={(e) => {
                setNewPostContent(e.target.value);
              }}
              placeholder="Mô tả truyện mà bạn đang tìm kiếm để trao đổi..."
              autoSize={{ minRows: 3, maxRows: 10 }}
              className="font-light mt-2 p-3"
            />
            <Popover
              content={
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setNewPostContent((prev) => prev + emojiData.emoji);
                  }}
                  lazyLoadEmojis={true}
                  skinTonesDisabled={true}
                />
              }
              trigger="click"
              className="absolute bottom-1 right-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM7 13H9C9 14.6569 10.3431 16 12 16C13.6569 16 15 14.6569 15 13H17C17 15.7614 14.7614 18 12 18C9.23858 18 7 15.7614 7 13ZM8 11C7.17157 11 6.5 10.3284 6.5 9.5C6.5 8.67157 7.17157 8 8 8C8.82843 8 9.5 8.67157 9.5 9.5C9.5 10.3284 8.82843 11 8 11ZM16 11C15.1716 11 14.5 10.3284 14.5 9.5C14.5 8.67157 15.1716 8 16 8C16.8284 8 17.5 8.67157 17.5 9.5C17.5 10.3284 16.8284 11 16 11Z"></path>
              </svg>
            </Popover>
          </div>

          <div className="flex flex-col mt-4">
            <p>
              Ảnh đi kèm:{" "}
              <span className="text-xs font-light italic">(Tối đa 8 ảnh)</span>
            </p>
            <p className="text-xs">
              Sử dụng hình ảnh để người khác nhận diện truyện bạn tìm kiếm dễ
              hơn.
            </p>

            <div className="grid grid-cols-[repeat(auto-fill,10rem)] gap-2 mt-2">
              {newImages.map((imgUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imgUrl}
                    alt={`preview chapter ${index}`}
                    className="w-[10em] h-[15em] object-cover transition-opacity duration-200 ease-in-out group-hover:opacity-50 rounded-md border p-1"
                  />
                  <button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() =>
                      setNewImages(newImages.filter((value, i) => i !== index))
                    }
                  >
                    <DeleteOutlined style={{ fontSize: 16 }} />
                  </button>
                </div>
              ))}

              {previewImages.map((imgUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imgUrl}
                    alt={`preview chapter ${index}`}
                    className="w-[10em] h-[15em] object-cover transition-opacity duration-200 ease-in-out group-hover:opacity-50 rounded-md border p-1"
                  />
                  <button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => handleRemoveUploadImage(index)}
                  >
                    <DeleteOutlined style={{ fontSize: 16 }} />
                  </button>
                </div>
              ))}

              {uploadedImageFiles.length < 8 && (
                <button
                  className="w-[10em] h-[15em] p-4 border bg-gray-100 hover:opacity-75 duration-200 rounded-lg flex flex-col items-center justify-center gap-2"
                  onClick={() =>
                    document.getElementById("previewChapterUpload")?.click()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="currentColor"
                  >
                    <path d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8284L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z"></path>
                  </svg>
                  <p className="text-nowrap">Thêm ảnh</p>
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/png, image/gif, image/jpeg"
                    onChange={handleUploadChange}
                    id="previewChapterUpload"
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="self-stretch flex items-center gap-2">
          {!isNotChanged ? (
            <button
              onClick={reset}
              className="grow py-2 border border-gray-400 rounded-md duration-200 hover:bg-gray-100"
            >
              Đặt lại
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="grow py-2 border border-gray-400 rounded-md duration-200 hover:bg-gray-100"
            >
              Hủy bỏ
            </button>
          )}
          <button
            disabled={isNotChanged}
            onClick={() => setIsConfirming(true)}
            className="grow py-2 bg-sky-800 text-white rounded-md duration-200 hover:bg-sky-900 disabled:bg-gray-300"
          >
            Cập nhật bài viết
          </button>
        </div>
      </div>

      <ActionConfirm
        isOpen={isConfirming}
        setIsOpen={setIsConfirming}
        title="Xác nhận chỉnh sửa bài viết trao đổi?"
        confirmCallback={() => {
          setIsConfirming(false);
          handleSubmitEdit();
        }}
      />
    </Modal>
  );
}
