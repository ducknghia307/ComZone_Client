/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Avatar, Modal, notification, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExchangePostInterface } from "../../../common/interfaces/exchange.interface";
import { Comic } from "../../../common/base.interface";
import { privateAxios, publicAxios } from "../../../middleware/axiosInstance";
import ActionConfirm from "../../actionConfirm/ActionConfirm";
import { useAppSelector } from "../../../redux/hooks";
import socket from "../../../services/socket";
import ComicsSelection from "./ComicsSelection";

export default function SelectOfferComicsModal({
  post,
  userExchangeComicsList,
  isSelectModalOpen,
  setIsSelectModalOpen,
  setIsChatOpen,
  setIsLoading,
  fetchExchangeNewsFeed,
}: {
  post: ExchangePostInterface;
  userExchangeComicsList: Comic[];
  isSelectModalOpen: string;
  setIsSelectModalOpen: Function;
  setIsChatOpen: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchExchangeNewsFeed: () => void;
}) {
  const { userId } = useAppSelector((state) => state.auth);

  const [postUserComicsList, setPostUserComicsList] = useState<Comic[]>([]);

  const [selectedRequestComicsList, setSelectedRequestComicsList] = useState<
    string[]
  >([]);
  const [selectedPostComicsList, setSelectedPostComicsList] = useState<
    string[]
  >([]);

  const [isSelectingMine, setIsSelectingMine] = useState<boolean>(true);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchPostUserOfferComics = async () => {
    await publicAxios.get(`comics/exchange/${post.user.id}`).then((res) => {
      setPostUserComicsList(res.data);
    });
  };

  useEffect(() => {
    fetchPostUserOfferComics();
  }, [isSelectModalOpen]);

  const handleModalClose = (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e) e.stopPropagation();
    setIsConfirming(false);
    setIsSelectingMine(true);
    setPostUserComicsList([]);
    setSelectedRequestComicsList([]);
    setSelectedPostComicsList([]);
    setIsSelectModalOpen("");
  };

  const handleSubmitRequest = async () => {
    handleModalClose();
    setIsLoading(true);

    await privateAxios
      .post("exchange-comics", {
        postId: post.id,
        requestUserComicsList: selectedRequestComicsList,
        postUserComicsList: selectedPostComicsList,
      })
      .then(async (res) => {
        console.log(res.data);

        await privateAxios
          .post("chat-rooms/exchange", {
            exchange: res.data.exchange.id,
          })
          .then((response) => {
            sessionStorage.setItem("connectedChat", response.data.id);

            socket.emit("join-room", { userId: userId });
            socket.emit("join-room", { userId: post.user.id });

            setIsChatOpen(true);
            handleModalClose();
          });
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Gửi không thành công!",
          description:
            "Yêu cầu đề nghị trao đổi đã được gửi đi trước đó. Vui lòng chờ phản hồi từ người nhận!",
          duration: 5,
        });
        handleModalClose();
        fetchExchangeNewsFeed();
      });
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        open={isSelectModalOpen === post.id}
        onCancel={(e) => handleModalClose(e)}
        footer={null}
        centered
        width={1000}
        styles={{ wrapper: { marginTop: "5px" } }}
      >
        <div className="w-full py-4 flex flex-col items-stretch justify-start gap-4">
          <p className="text-[1.5em] font-semibold">CHỌN TRUYỆN ĐỂ TRAO ĐỔI</p>
          <p className="inline">
            Bạn sẽ chọn những truyện của bạn dùng để trao đổi, sau đó bạn có thể
            chọn truyện của{" "}
            <span className="font-semibold">
              <Avatar src={post.user.avatar} />
              &nbsp;{post.user.name}
            </span>{" "}
            để gửi yêu cầu trao đổi với họ.
          </p>

          <div className="flex items-stretch justify-start gap-8">
            {isSelectingMine && (
              <div className="basis-full flex flex-col items-stretch gap-4">
                <div>
                  <p>
                    Đầu tiên, hãy chọn từ danh sách truyện dùng để trao đổi của
                    bạn:
                  </p>
                  <p className="font-light italic">
                    Số truyện bạn đang có để trao đổi:{" "}
                    <span className="font-bold">
                      {userExchangeComicsList.length}
                    </span>
                    <button
                      onClick={() => {
                        sessionStorage.setItem(
                          "create-exchange-comics",
                          "true"
                        );
                        navigate("/exchange/comics-collection");
                      }}
                      className="ml-8 px-2 rounded-md duration-200 bg-gray-800 text-white hover:bg-gray-700"
                    >
                      + Thêm truyện
                    </button>
                  </p>
                </div>

                <ComicsSelection
                  fullComicsList={userExchangeComicsList}
                  selectedComics={selectedRequestComicsList}
                  setSelectedComics={setSelectedRequestComicsList}
                />

                <div
                  className={`${
                    selectedPostComicsList.length === 0 && "hidden"
                  } flex items-center justify-between gap-2 text-lg`}
                >
                  <p className="font-light">
                    Tổng số truyện được chọn:{" "}
                    <span className="font-semibold">
                      {selectedPostComicsList.length}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {!isSelectingMine && (
              <div className="basis-full flex flex-col items-stretch gap-4">
                <p className="font-light italic">
                  Chọn những truyện của{" "}
                  <span className="font-semibold">{post.user.name}</span> mà bạn
                  muốn để trao đổi.
                </p>

                <ComicsSelection
                  fullComicsList={postUserComicsList}
                  selectedComics={selectedPostComicsList}
                  setSelectedComics={setSelectedPostComicsList}
                />

                <div
                  className={`${
                    selectedPostComicsList.length === 0 && "hidden"
                  } flex items-center justify-between gap-2 text-lg`}
                >
                  <p className="font-light">
                    Tổng số truyện được chọn:{" "}
                    <span className="font-semibold">
                      {selectedPostComicsList.length}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-auto flex items-center justify-end gap-8">
            <button
              onClick={(e) => {
                if (!isSelectingMine) {
                  setSelectedPostComicsList([]);
                  setIsSelectingMine(true);
                } else handleModalClose(e);
              }}
              className="p-2 hover:underline"
            >
              {isSelectingMine ? "Hủy bỏ" : "Quay lại"}
            </button>
            <button
              disabled={
                (isSelectingMine && selectedRequestComicsList.length === 0) ||
                (!isSelectingMine && selectedPostComicsList.length === 0)
              }
              onClick={() => {
                if (isSelectingMine) setIsSelectingMine(false);
                else setIsConfirming(true);
              }}
              className="px-16 py-2 bg-sky-700 text-white rounded-md duration-200 hover:bg-sky-900 disabled:bg-gray-300"
            >
              {isSelectingMine ? "Tiếp theo" : "Hoàn tất"}
            </button>

            <ActionConfirm
              isOpen={isConfirming}
              setIsOpen={setIsConfirming}
              title="Xác nhận gửi yêu cầu?"
              description={
                <p>Bạn đã chắc chắn muốn gửi yêu cầu với những truyện này?</p>
              }
              confirmCallback={() => handleSubmitRequest()}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
