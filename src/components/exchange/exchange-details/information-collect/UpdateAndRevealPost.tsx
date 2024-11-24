import React, { SetStateAction, useState } from "react";
import { Modal, notification } from "antd";
import { ExchangePostInterface } from "../../../../common/interfaces/exchange.interface";
import { privateAxios } from "../../../../middleware/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function UpdateAndRevealPost({
  open,
  setOpen,
  post,
  setIsLoading,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  post: ExchangePostInterface;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [newPostContent, setNewPostContent] = useState<string>(
    post.postContent
  );
  const [newImages, setNewImages] = useState<string[]>(post.images || []);
  const [uploadedImageFiles, setUploadedImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleRemoveImage = (index: number) => {
    setNewImages(newImages.filter((value, i) => i !== index));
  };

  const handleRemoveFile = (index: number) => {
    setUploadedImageFiles(uploadedImageFiles.filter((value, i) => i !== index));
  };

  const handleRepost = async () => {
    setOpen(false);
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
        navigate("/exchange/all");
        notification.success({
          key: "success-repost",
          message: "Đăng lại bài viết thành công",
          duration: 5,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal
      open={open}
      onCancel={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
      footer={null}
      centered
      width={800}
    >
      <div className="flex flex-col gap-4 pt-4">
        <p className="text-xl font-semibold">HIỆN BÀI VIẾT TRAO ĐỔI</p>

        <p className="text-lg">
          Bạn có muốn đăng lại bài viết tìm kiếm trao đổi không?
        </p>

        <div className="flex flex-col gap-4 px-2 py-2 border border-gray-400 rounded-lg">
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

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="ml-auto pr-8 flex items-center gap-1 hover:opacity-80"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                  >
                    <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                  </svg>
                  <p className="text-xs">Chỉnh sửa</p>
                </button>
              ) : (
                <div className="ml-auto pr-8 flex items-center gap-4">
                  <button
                    onClick={() => {
                      setNewPostContent(post.postContent);
                      setNewImages(post.images || []);
                      setUploadedImageFiles([]);
                      setPreviewImages([]);
                    }}
                    className="text-xs hover:undeline"
                  >
                    Đặt lại
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs hover:undeline"
                  >
                    Xong
                  </button>
                </div>
              )}
            </div>
          </div>

          <input
            disabled={!isEditing}
            type="text"
            value={newPostContent}
            onChange={(e) => {
              setNewPostContent(e.target.value);
            }}
            className={`bg-white pl-2 py-1 ${
              isEditing && "border border-gray-300"
            }`}
          />

          {newImages.length > 0 && (
            <div className="flex items-center gap-2">
              {newImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    key={image}
                    src={image}
                    className="rounded-lg w-[10em] h-[15em] object-cover"
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="hidden group-hover:inline absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-2 rounded-full bg-white duration-200 hover:opacity-80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="rgba(239,6,6,1)"
                      >
                        <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              {previewImages.map((image, index) => {
                return (
                  <div className="relative group">
                    <img
                      key={image}
                      src={image}
                      className="rounded-lg w-[10em] h-[15em] object-cover"
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="hidden group-hover:inline absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-2 rounded-full bg-white duration-200 hover:opacity-80"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="rgba(239,6,6,1)"
                        >
                          <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}

              {isEditing && (
                <>
                  <input
                    type="file"
                    hidden
                    id="add-image"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={(e) => {
                      if (e.target.files !== null && e.target.files[0])
                        setUploadedImageFiles((prev) => [
                          ...prev,
                          e.target.files![0],
                        ]);
                      setPreviewImages((prev) => [
                        ...prev,
                        URL.createObjectURL(e.target.files![0]),
                      ]);
                    }}
                  />
                  <button
                    onClick={() => {
                      document.getElementById("add-image")?.click();
                    }}
                    className="px-8 text-gray-800 duration-200 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="48"
                      height="48"
                      fill="currentColor"
                    >
                      <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="self-stretch flex items-center gap-2">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/exchange/all");
            }}
            className="grow py-2 border border-gray-400 rounded-md duration-200 hover:bg-gray-100"
          >
            Không đăng lại
          </button>
          <button
            onClick={() => handleRepost()}
            className="grow py-2 bg-sky-800 text-white rounded-md duration-200 hover:bg-sky-900"
          >
            ĐĂNG LẠI BÀI VIẾT
          </button>
        </div>
      </div>
    </Modal>
  );
}
