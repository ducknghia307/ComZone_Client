import {
  InputNumber,
  notification,
  Radio,
  RadioChangeEvent,
  Select,
} from "antd";
import React, { useState, useEffect } from "react";
import CoverImagePlaceholder from "../../assets/comics-cover-placeholder.png";
import { privateAxios } from "../../middleware/axiosInstance";
import Loading from "../loading/Loading";
import { UserInfo } from "../../common/base.interface";
import { ExchangeElement } from "../../common/interfaces/exchange-post.interface";

interface EditComicToExchangeProps {
  userInfo: UserInfo;
  comicData: ExchangeElement; // This will be the comic data you want to edit
  setComicList: React.Dispatch<React.SetStateAction<ExchangeElement[]>>;
}

const EditComicToExchange: React.FC<EditComicToExchangeProps> = ({
  userInfo,
  comicData,
  setComicList,
}) => {
  const [used, setUsed] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [newComicRes, setNewComicRes] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [edition, setEdition] = useState("REGULAR");
  const [numOfComics, setNumOfComics] = useState(2);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    // If comicData is passed, pre-fill the form
    if (comicData) {
      setTitle(comicData.title);
      setAuthor(comicData.author);
      setEdition(comicData.edition);
      setUsed(comicData.condition === "USED" ? 1 : 2);
      setQuantity(comicData.quantity > 1 ? 2 : 1);
      setNumOfComics(comicData.quantity);
      setImageUrl(comicData.coverImage);
    }
  }, [comicData]);

  const openNotification = () => {
    api.success({
      message: "Thành công",
      description: "Cập nhật truyện để yêu cầu trao đổi truyện thành công!",
    });
  };

  const handleClickUpload = () => {
    document.getElementById("upload")?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImageFile(selectedFile);
      await uploadImage(selectedFile);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);
    try {
      const res = await privateAxios.post("/file/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImageUrl(res.data.imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl("");
  };

  // Handle change for each input
  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeAuthor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };

  const handleChangeEdition = (value: string) => {
    setEdition(value);
  };

  const handleChangeCondition = (e: RadioChangeEvent) => {
    setUsed(e.target.value);
  };

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumOfComics(Number(e.target.value));
  };

  const handleSubmit = () => {
    setIsUploading(true);
    const comicDataUpdated = {
      title,
      author,
      coverImage: imageUrl,
      edition,
      condition: used === 1 ? "USED" : "SEALED",
      quantity: quantity === 2 ? numOfComics : 1,
    };

    console.log(comicDataUpdated);
    const userId = userInfo.id;

    const existingData = JSON.parse(
      sessionStorage.getItem("newComicData") || "{}"
    );

    if (!existingData[userId]) {
      existingData[userId] = [];
    }

    // Replace old comic data with updated comic data
    const index = existingData[userId].findIndex(
      (item: ExchangeElement) => item.title === comicData.title
    );
    if (index !== -1) {
      existingData[userId][index] = comicDataUpdated;
    }

    sessionStorage.setItem("newComicData", JSON.stringify(existingData));
    setComicList(existingData[userId]);
    openNotification();
    setTitle("");
    setAuthor("");
    setImageFile(null);
    setImageUrl("");
    setEdition("REGULAR");
    setUsed(1);
    setQuantity(1);
    setNumOfComics(2);
    setNewComicRes(false);
    setIsUploading(false);
  };

  return (
    <>
      {contextHolder}
      {isUploading && <Loading />}
      <div className="w-full flex flex-col mt-4">
        {newComicRes && (
          <div className="w-full border-2 rounded-md flex flex-col">
            <div className="flex flex-row w-full gap-5">
              <div className="flex flex-col w-1/5 p-4">
                <div
                  className="border-2 rounded-md bg-contain bg-no-repeat bg-center h-60 w-full cursor-pointer"
                  style={{
                    backgroundImage: `url(${
                      imageUrl || CoverImagePlaceholder
                    })`,
                  }}
                  onClick={handleClickUpload}
                >
                  <input
                    type="file"
                    id="upload"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={!!imageUrl}
                  />
                </div>
                {imageUrl ? (
                  <button
                    className="mt-2 text-red-500 text-xs"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </button>
                ) : (
                  <p className="text-green-700 text-[7px] italic max-w-52 text-center mt-2">
                    * Đính kèm hình ảnh để truyện dễ được nhận dạng hơn.
                  </p>
                )}
              </div>
              <div className="flex flex-col w-5/6 justify-center gap-7">
                <input
                  type="text"
                  placeholder="Tựa đề của truyện..."
                  className="py-2 border-b-2 px-2 w-[20em] border-black focus:!border-white"
                  value={title}
                  onChange={handleChangeTitle}
                />
                <div className="flex flex-row w-full gap-5">
                  <div className="w-1/2">
                    <div className="flex flex-row gap-1">
                      <h2 className="font-sm">Tác giả:</h2>
                      <p className="text-red-500">*</p>
                    </div>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-lg mt-2 p-2 min-w-[20em]"
                      value={author}
                      onChange={handleChangeAuthor}
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-row gap-1">
                      <h2 className="font-sm">Phiên bản:</h2>
                      <p className="text-red-500">*</p>
                    </div>
                    <Select
                      size="large"
                      value={edition}
                      onChange={handleChangeEdition}
                      style={{ width: 300, borderRadius: 9 }}
                      options={[
                        { value: "REGULAR", label: "Phiên bản thường" },
                        { value: "SPECIAL", label: "Phiên bản đặc biệt" },
                        { value: "LIMITED", label: "Phiên bản giới hạn" },
                      ]}
                      className="mt-2 border-1"
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-5 w-full">
                  <div className="flex flex-col w-1/2">
                    <div className="flex flex-row">
                      <h2 className="font-sm">Tình trạng tối thiểu:</h2>
                      <p className="text-red-500">*</p>
                    </div>
                    <div className="flex flex-row w-full mt-4">
                      <Radio.Group
                        value={used}
                        onChange={handleChangeCondition}
                      >
                        <Radio value={1}>Đã qua sử dụng</Radio>
                        <Radio value={2}>Còn nguyên seal</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <div className="flex flex-row gap-1">
                      <h2 className="font-sm">Số lượng:</h2>
                      <p className="text-red-500">*</p>
                    </div>
                    <input
                      type="number"
                      className="mt-2 w-24"
                      value={numOfComics}
                      onChange={handleChangeQuantity}
                    />
                  </div>
                </div>
                <button
                  className="w-full bg-primary py-3 text-white font-bold rounded-md mt-4"
                  onClick={handleSubmit}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditComicToExchange;
