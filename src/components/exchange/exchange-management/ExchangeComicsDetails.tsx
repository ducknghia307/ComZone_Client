import React, { useEffect, useState } from "react";
import { Comic } from "../../../common/base.interface";
import { Modal, notification, Popconfirm } from "antd";
import { privateAxios } from "../../../middleware/axiosInstance";
import { DeleteFilled } from "@ant-design/icons";

export default function ExchangeComicsDetails({
  comics,
  setIsShowingDetails,
  setIsUpdating,
  fetchComicExchangeOffer,
  handleUndoDelete,
}: {
  comics: Comic;
  setIsShowingDetails: React.Dispatch<React.SetStateAction<Comic>>;
  setIsUpdating: React.Dispatch<React.SetStateAction<Comic>>;
  fetchComicExchangeOffer: () => void;
  handleUndoDelete: (comics: Comic) => void;
}) {
  const [currentComics, setCurrentComics] = useState<Comic>(comics);
  const [currentImage, setCurrentImage] = useState(comics.coverImage);

  useEffect(() => {
    setCurrentComics(comics);
    setCurrentImage(comics.coverImage);
  }, [comics]);

  const handleDeleteExchangeComics = async () => {
    await privateAxios
      .delete(`comics/soft/${currentComics.id}`)
      .then(() => {
        notification.info({
          key: "delete",
          message: (
            <p className="REM">
              Đã xóa truyện{" "}
              <span className="font-semibold">"{comics.title}"</span>!
            </p>
          ),
          description: (
            <button
              onClick={() => handleUndoDelete(currentComics)}
              className="bg-sky-700 text-white px-2 py-1 rounded-md duration-200 hover:bg-sky-800"
            >
              Hoàn tác
            </button>
          ),
          duration: 5,
        });

        setIsShowingDetails(null);
        fetchComicExchangeOffer();
      })
      .catch((err) => console.log(err));
  };

  const getComicsExchangeStatus = () => {
    switch (comics.status) {
      case "UNAVAILABLE":
        return <p>Không khả dụng</p>;
      case "AVAILABLE":
        return <p className="text-green-600">Sẵn sàng trao đổi</p>;
      case "PRE_ORDER":
        return <p className="text-amber-600">Đang dùng để đổi</p>;
      case "SOLD":
        return <p className="text-cyan-600">Đã trao đổi</p>;
    }
  };

  return (
    <>
      <Modal
        open={true}
        onCancel={(e) => {
          e.stopPropagation();
          setIsShowingDetails(null);
        }}
        footer={null}
        centered
        closeIcon={null}
        styles={{ content: { padding: "2px" } }}
        width={800}
      >
        <div
          key={currentComics.id}
          className={`flex items-stretch gap-2 p-[0.2em] rounded-md duration-200`}
        >
          <div className="self-baseline shrink-0 flex flex-col items-start gap-2">
            <img
              src={currentImage}
              alt=""
              className="w-64 h-96 rounded-md object-cover"
            />

            <div
              className={`relative flex gap-2 h-full max-w-64 overflow-x-auto overflow-y-hidden snap-x snap-mandatory`}
            >
              <img
                onClick={() => setCurrentImage(currentComics.coverImage)}
                src={currentComics.coverImage}
                alt=""
                className={`w-16 h-20 ${
                  currentImage === currentComics.coverImage
                    ? "border border-gray-500"
                    : "duration-200 hover:brightness-50 cursor-pointer"
                } rounded-md object-cover snap-center snap-always`}
              />

              {currentComics.previewChapter.map((preview, index) => (
                <img
                  key={index}
                  onClick={() => setCurrentImage(preview)}
                  src={preview}
                  alt=""
                  className={`w-16 h-20 ${
                    currentImage === preview
                      ? "border border-gray-500"
                      : "duration-200 hover:brightness-50 cursor-pointer"
                  } rounded-md object-cover snap-center snap-always`}
                />
              ))}
            </div>
          </div>

          <div className="self-stretch ml-2 w-full flex flex-col justify-center gap-2 py-2">
            <div className="flex flex-col leading-tight">
              <p className="text-lg font-semibold uppercase leading-tight">
                {currentComics.title}
              </p>
              <p className="font-light uppercase text-sm">
                {currentComics.author}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pr-4">
              <p className="font-light text-xs">Phiên bản:</p>
              <p className="font-semibold">{currentComics.edition.name}</p>
            </div>

            <div className="flex items-center justify-between gap-2 pr-4">
              <p className="font-light text-xs">Tình trạng:</p>
              <p className="font-semibold">
                {currentComics.condition === 10
                  ? "Nguyên vẹn"
                  : "Đã qua sử dụng"}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pr-4">
              <p className="font-light text-xs">Số lượng cuốn:</p>
              <p className="font-semibold">
                {currentComics.quantity > 1
                  ? currentComics.quantity
                  : "Truyện lẻ"}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pr-4">
              <p className="font-light text-xs">Trạng thái:</p>
              <p className="font-semibold">{getComicsExchangeStatus()}</p>
            </div>

            {currentComics.quantity > 1 && currentComics.episodesList && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="font-light text-xs">Danh sách truyện:</p>
                {currentComics.episodesList.slice(0, 8).map((episode) => (
                  <span className="font-light text-xs italic border border-gray-300 p-1 rounded-md">
                    {episode}
                  </span>
                ))}
              </div>
            )}

            {currentComics.publicationYear && (
              <div className="flex items-center justify-between gap-2 pr-4">
                <p className="font-light text-xs">Năm xuất bản:</p>
                <p className="font-semibold">{currentComics.publicationYear}</p>
              </div>
            )}

            {currentComics.page && (
              <div className="flex items-center justify-between gap-2 pr-4">
                <p className="font-light text-xs">Số trang:</p>
                <p className="font-semibold">{currentComics.page}</p>
              </div>
            )}

            <p className="font-light text-sm">
              Mô tả:{" "}
              <span className={`font-medium`}>
                <p className="max-h-[15em] overflow-auto">
                  {currentComics.description}
                </p>
              </span>
            </p>

            {currentComics.status === "AVAILABLE" && (
              <div className="flex items-center gap-2 mt-auto text-sm">
                <Popconfirm
                  title={<p>Xóa truyện</p>}
                  description={
                    <p>Bạn có chắc chắn muốn xóa truyện này không?</p>
                  }
                  okText={<p>Xóa</p>}
                  okType="danger"
                  cancelText={<p>Quay lại</p>}
                  onConfirm={handleDeleteExchangeComics}
                  icon={<DeleteFilled style={{ color: "red" }} />}
                >
                  <button className="grow flex items-center justify-center gap-1 py-2 rounded-md text-white bg-red-600 duration-200 hover:bg-red-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                    >
                      <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                    </svg>
                    Xóa
                  </button>
                </Popconfirm>

                <button
                  onClick={() => setIsUpdating(currentComics)}
                  className="grow flex items-center justify-center gap-1 py-2 rounded-md text-white bg-cyan-600 duration-200 hover:bg-cyan-800"
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
                  Chỉnh sửa thông tin
                </button>

                <button
                  onClick={() => setIsShowingDetails(null)}
                  className="grow py-2 rounded-md border border-gray-500 duration-200 hover:bg-gray-100"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
