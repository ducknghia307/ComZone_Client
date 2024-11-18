import { Modal, Radio, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import CoverImagePlaceholder from "../../../assets/comics-cover-placeholder.png";
import { UserInfo } from "../../../common/base.interface";
import { privateAxios } from "../../../middleware/axiosInstance";
import Loading from "../../loading/Loading";
import TextArea from "antd/es/input/TextArea";
import { DeleteOutlined, PictureOutlined } from "@ant-design/icons";

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
  const [used, setUsed] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [postContent, setPostContent] = useState("");
  const [previewChapterImages, setPreviewChapterImages] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const openNotification = () => {
    api.success({
      message: "Thành công",
      description: "Truyện đã được thêm vào danh sách để trao đổi trao đổi!",
      duration: 2,
    });
  };

  const handleCoverImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImageFile(selectedFile);

      const formData = new FormData();
      formData.append("image", selectedFile);
      setIsUploading(true);
      try {
        const res = await privateAxios.post("/file/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setImageUrl(res.data.imageUrl);
        sessionStorage.setItem(
          "coverImages",
          JSON.stringify(res.data.imageUrl)
        );
      } catch (error) {
        console.error("Image upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl("");
  };

  const handlePreviewChapterChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (previewChapterImages.length >= 4) {
        notification.error({
          message: "Error",
          description: "You can only upload up to 4 preview images.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedFile);
      setIsUploading(true);
      try {
        const res = await privateAxios.post("/file/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const newImageUrl = res.data.imageUrl;
        const updatedImages = [...previewChapterImages, newImageUrl];
        setPreviewChapterImages(updatedImages);
        sessionStorage.setItem(
          "previewChapterImages",
          JSON.stringify(updatedImages)
        );
      } catch (error) {
        console.error("Preview image upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemovePreviewChapterImage = (index: number) => {
    const updatedImages = previewChapterImages.filter((_, i) => i !== index);
    setPreviewChapterImages(updatedImages);
    sessionStorage.setItem(
      "previewChapterImages",
      JSON.stringify(updatedImages)
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const comicData = {
        title,
        author,
        coverImage: imageUrl,
        previewChapter: previewChapterImages,
        description: postContent,
        edition,
        condition: used === 1 ? "USED" : "SEALED",
      };
      console.log(comicData);
      const res = await privateAxios.post("/comics/exchange", comicData);
      console.log(res);

      openNotification();
      setTitle("");
      setAuthor("");
      setImageFile(null);
      setImageUrl("");
      setEdition("REGULAR");
      setUsed(1);
      setPreviewChapterImages([]);
      setPostContent("");
      handleCancel();
      sessionStorage.removeItem("coverImages");
      sessionStorage.removeItem("previewChapterImages");
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

  useEffect(() => {
    const storedCoverImage = sessionStorage.getItem("coverImages");
    if (storedCoverImage) {
      setImageUrl(JSON.parse(storedCoverImage));
    }

    const storedPreviewImages = sessionStorage.getItem("previewChapterImages");
    if (storedPreviewImages) {
      setPreviewChapterImages(JSON.parse(storedPreviewImages));
    }
  }, [userInfo]);

  return (
    <>
      {loading && <Loading />}
      <Modal
        title={<h2 className="text-xl">Thêm truyện để trao đổi</h2>}
        open={isModalOpen}
        onCancel={handleCancel}
        //   onOk={handleSubmit}
        width={1000}
        footer={null}
      >
        {contextHolder}
        {isUploading && <Loading />}
        <div className="w-full flex flex-row gap-4">
          <div className="w-1/5 p-4">
            <div className="flex flex-col items-center">
              <div
                className="border-2 rounded-md bg-no-repeat bg-center h-60 w-full cursor-pointer bg-cover"
                style={{
                  backgroundImage: `url(${imageUrl || CoverImagePlaceholder})`,
                }}
                onClick={() => document.getElementById("upload")?.click()}
              >
                <input
                  type="file"
                  id="upload"
                  className="hidden"
                  onChange={handleCoverImageChange}
                />
              </div>
              {imageUrl && (
                <button
                  className="mt-2 text-red-500 text-xs"
                  onClick={handleRemoveImage}
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
              <div className="flex flex-col w-1/2">
                <div className="flex flex-row">
                  <h2 className="font-sm">Tình trạng tối thiểu:</h2>
                  <p className="text-red-500">*</p>
                </div>
                <div className="flex flex-row w-full mt-4">
                  <Radio.Group
                    onChange={(e) => setUsed(e.target.value)}
                    value={used}
                  >
                    <Radio value={1}>Đã sử dụng</Radio>
                    <Radio value={2}>Còn nguyên seal</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="w-1/2">
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

            <div className="mt-6">
              <div className="flex flex-row gap-1">
                <h2 className="font-sm">Ảnh xem trước nội dung truyện</h2>
                <p className="text-red-500">*</p>
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
                      <PictureOutlined />
                      <p className="text-nowrap">Thêm ảnh</p>
                      <input
                        type="file"
                        onChange={handlePreviewChapterChange}
                        className="hidden"
                        id="previewChapterUpload"
                      />
                    </button>
                  </label>
                )}
              </div>
            </div>
            <TextArea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Mô tả nội dung của truyện"
              autoSize={{ minRows: 3, maxRows: 5 }}
              className="mt-4 p-3"
            />
            <div className="w-full flex flex-row gap-4 mt-6 justify-end">
              <button
                className="border-none font-semibold hover:opacity-70 duration-200"
                onClick={handleCancel}
              >
                HỦY BỎ
              </button>
              <button
                className="px-12 py-2 bg-black rounded-md text-white font-bold hover:opacity-70 duration-200 "
                onClick={handleSubmit}
                disabled={loading}
              >
                HOÀN TẤT
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NewComicOfferModal;
