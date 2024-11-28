import { Modal, notification, Popover } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import { privateAxios } from "../../../middleware/axiosInstance";
import ActionConfirm from "../../actionConfirm/ActionConfirm";
import EmojiPicker from "emoji-picker-react";

export default function CreatePostModal({
  openCreatePost,
  setOpenCreatePost,
  fetchExchangeNewsFeed,
}: {
  openCreatePost: boolean;
  setOpenCreatePost: (open: boolean) => void;
  fetchExchangeNewsFeed: () => void;
}) {
  const [postContent, setPostContent] = useState("");
  const [uploadedImagesFile, setUploadedImagesFile] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [postContentError, setPostContentError] = useState(false);

  const handlePreviewChapterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      fileArray.map((file, index) => {
        if (index + uploadedImagesFile.length < 8) {
          const url = URL.createObjectURL(file);
          setPreviewImages((prev) => [...prev, url]);
          setUploadedImagesFile((prev) => [...prev, file]);
        }
      });
    }
  };
  const handleRemovePreviewChapterImage = (index: number) => {
    setPreviewImages(previewImages.filter((value, i) => i !== index));
    setUploadedImagesFile(uploadedImagesFile.filter((value, i) => i !== index));
  };

  const handleClose = () => {
    setPostContent("");
    setPreviewImages([]);
    setUploadedImagesFile([]);
    setIsConfirming(false);
    setOpenCreatePost(false);
  };

  const handleSubmit = async () => {
    handleClose();
    setLoading(true);

    try {
      const imagesList: string[] = [];
      if (uploadedImagesFile.length > 0) {
        await Promise.all(
          uploadedImagesFile.map(async (file) => {
            await privateAxios
              .post(
                "/file/upload/image",
                {
                  image: file,
                },
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then((res) => imagesList.push(res.data.imageUrl))
              .catch((err) => console.log(err));
          })
        );
      }

      await privateAxios.post("exchange-posts", {
        postContent,
        images: imagesList,
      });

      notification.success({
        key: "success",
        message: "Thành công",
        description: "Đăng bài trao đổi truyện thành công!",
        duration: 5,
      });

      fetchExchangeNewsFeed();
    } catch (error) {
      console.error("Error posting exchange request:", error);
      notification.error({
        key: "error",
        message: "Đã xảy ra lỗi!",
        description: "Vui lòng thử lại sau.",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={openCreatePost}
        onCancel={handleClose}
        footer={null}
        width={window.innerWidth * 0.4}
      >
        <h2 className="text-xl font-medium my-4">
          ĐĂNG BÀI TÌM KIẾM TRUYỆN ĐỂ TRAO ĐỔI
        </h2>

        <div className="flex flex-row gap-1 mt-4">
          <h2>Nội dung bài viết:</h2>
          <p className="text-red-500">*</p>
        </div>

        <div className="relative">
          <TextArea
            value={postContent}
            onChange={(e) => {
              setPostContent(e.target.value);
              setPostContentError(false);
            }}
            placeholder="Mô tả truyện mà bạn đang tìm kiếm để trao đổi..."
            autoSize={{ minRows: 3, maxRows: 10 }}
            className="font-light mt-2 p-3"
          />
          <Popover
            content={
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setPostContent((prev) => prev + emojiData.emoji);
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

        <p
          className={`${
            postContent.trim().length > 0 && "invisible"
          } text-xs font-light italic text-green-600 mt-2`}
        >
          Việc mô tả chi tiết sẽ giúp người khác hiểu rõ hơn về truyện bạn đang
          tìm kiếm.
        </p>
        {postContentError && (
          <p className="text-red-500 text-xs mt-1">
            Cần nhập nội dung bài đăng
          </p>
        )}

        <div className="flex flex-col mt-4">
          <p>
            Ảnh đi kèm:{" "}
            <span className="text-xs font-light italic">(Tối đa 8 ảnh)</span>
          </p>
          <p className="text-xs">
            Sử dụng hình ảnh để người khác nhận diện truyện bạn tìm kiếm dễ hơn.
          </p>

          <div className="grid grid-cols-[repeat(auto-fill,10rem)] gap-2 mt-2">
            {previewImages.map((imgUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imgUrl}
                  alt={`preview chapter ${index}`}
                  className="w-[10em] h-[15em] object-cover transition-opacity duration-200 ease-in-out group-hover:opacity-50 rounded-md border p-1"
                />
                <button
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleRemovePreviewChapterImage(index)}
                >
                  <DeleteOutlined style={{ fontSize: 16 }} />
                </button>
              </div>
            ))}
            {uploadedImagesFile.length < 8 && (
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
                  onChange={handlePreviewChapterChange}
                  id="previewChapterUpload"
                />
              </button>
            )}
          </div>
        </div>

        <div className="w-full flex justify-end mt-4 flex-row gap-10">
          <button
            className="border-none hover:opacity-70 duration-200"
            onClick={() => setOpenCreatePost(false)}
          >
            Hủy bỏ
          </button>
          <button
            disabled={loading || postContent.trim().length === 0}
            onClick={() => setIsConfirming(true)}
            className="px-12 py-2 bg-black rounded-md text-white font-bold hover:opacity-70 duration-200 disabled:bg-gray-300"
          >
            HOÀN TẤT
          </button>

          <ActionConfirm
            isOpen={isConfirming}
            setIsOpen={setIsConfirming}
            title="Xác nhận đăng bài?"
            confirmCallback={() => handleSubmit()}
          />
        </div>
      </Modal>
    </>
  );
}
