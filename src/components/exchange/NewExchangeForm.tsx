import { InputNumber, Radio, RadioChangeEvent, Select } from "antd";
import React, { useState } from "react";
import CoverImagePlaceholder from "../../assets/comics-cover-placeholder.png";
import { privateAxios } from "../../middleware/axiosInstance";
import Loading from "../loading/Loading";
import { ExchangeElement } from "../../common/interfaces/exchange-post.interface";
interface NewExchangeFormProps {
  setComicList: (comics: ExchangeElement[]) => void; // Prop to pass the updated comic list to the parent
}
const NewExchangeForm: React.FC<NewExchangeFormProps> = ({ setComicList }) => {
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
  const onUsedChange = (e: RadioChangeEvent) => setUsed(e.target.value);
  const onQuantityChange = (e: RadioChangeEvent) => setQuantity(e.target.value);

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
      setIsUploading(false); // Stop loading indicator
    }
  };

  const handleSubmit = () => {
    setIsUploading(true);
    const comicData = {
      title,
      author,
      coverImage: imageUrl,
      edition,
      condition: used === 1 ? "USED" : "SEALED",
      quantity: quantity === 2 ? numOfComics : 1,
      // numOfComics: quantity === 2 ? numOfComics : 1,
    };

    console.log(comicData);
    const currentComics = JSON.parse(
      sessionStorage.getItem("newComicData") || "[]"
    );
    console.log(currentComics);
    currentComics.push(comicData);
    console.log(currentComics);
    setComicList(currentComics);
    sessionStorage.setItem("newComicData", JSON.stringify(currentComics));
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl("");
  };

  return (
    <>
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
                    disabled={!!imageUrl} // Disable file input if an image is already uploaded
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
                  onChange={(e) => setTitle(e.target.value)}
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
                      onChange={(e) => setAuthor(e.target.value)}
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
                      onChange={(value) => setEdition(value)}
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
                      <Radio.Group value={used} onChange={onUsedChange}>
                        <Radio value={1}>Đã qua sử dụng</Radio>
                        <Radio value={2}>Còn nguyên seal</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <div className="flex flex-row">
                      <h2 className="font-sm">Số lượng truyện:</h2>
                      <p className="text-red-500">*</p>
                    </div>
                    <div className="flex flex-row w-full items-center mt-4">
                      <Radio.Group value={quantity} onChange={onQuantityChange}>
                        <Radio value={1}>Truyện lẻ</Radio>
                        <Radio value={2}>Bộ truyện</Radio>
                      </Radio.Group>
                      {quantity === 2 && (
                        <div className="flex flex-row items-center">
                          <h2 className="font-sm">Số lượng:</h2>
                          <p className="text-red-500 mr-2">*</p>
                          <InputNumber
                            min={2}
                            max={30}
                            value={numOfComics}
                            onChange={(value) => setNumOfComics(value ?? 2)}
                            className="w-12"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end py-2 px-14">
              <button
                className="px-14 py-2 font-bold border border-black rounded-lg hover:opacity-70 duration-200"
                onClick={handleSubmit}
              >
                XONG
              </button>
            </div>
          </div>
        )}
        {!newComicRes && (
          <div className="w-full flex items-start">
            <button
              className="px-3 py-1 border-2 rounded-md flex items-center hover:opacity-70 duration-200 gap-2"
              onClick={() => setNewComicRes(true)}
            >
              <p className="text-2xl font-light opacity-55">+</p>
              <p className="text-base font-light opacity-55">Thêm</p>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewExchangeForm;
