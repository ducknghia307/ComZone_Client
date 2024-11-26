/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Avatar, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import { Comic } from "../../common/base.interface";
import { ExchangePostInterface } from "../../common/interfaces/exchange.interface";
import ActionConfirm from "../actionConfirm/ActionConfirm";
import { useNavigate } from "react-router-dom";

export default function SelectOfferComicsModal({
  post,
  userExchangeComicsList,
  isSelectModalOpen,
  setIsSelectModalOpen,
  setIsChatOpen,
  setIsLoading,
}: {
  post: ExchangePostInterface;
  userExchangeComicsList: Comic[];
  isSelectModalOpen: string;
  setIsSelectModalOpen: Function;
  setIsChatOpen: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [requestSelectOptionValues, setRequestSelectOptionValues] = useState<
    { label: string; value: string; image: string }[]
  >([]);
  const [postSelectOptionValues, setPostSelectOptionValues] = useState<
    { label: string; value: string; image: string }[]
  >([]);

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
      const list = res.data;
      if (!list && list.length === 0) return;
      else {
        setRequestSelectOptionValues([]);
        setPostSelectOptionValues([]);

        userExchangeComicsList.map((comics: Comic) => {
          setRequestSelectOptionValues((prev) => [
            ...(prev as []),
            {
              label: comics.title,
              value: comics.id,
              image: comics.coverImage,
            },
          ]);
        });

        list.map((comics: Comic) => {
          setPostSelectOptionValues((prev) => [
            ...(prev as []),
            {
              label: comics.title,
              value: comics.id,
              image: comics.coverImage,
            },
          ]);
        });
      }
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
    setPostSelectOptionValues([]);
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
      });
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        open={isSelectModalOpen === post.id}
        onCancel={(e) => handleModalClose(e)}
        footer={null}
        width={window.innerWidth * 0.4}
        maskClosable={false}
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
                      {requestSelectOptionValues.length}
                    </span>
                    <button
                      onClick={() => navigate("/profile/comicExchange")}
                      className="ml-8 px-2 rounded-md duration-200 bg-gray-800 text-white hover:bg-gray-700"
                    >
                      + Thêm truyện
                    </button>
                  </p>
                </div>

                <div className="py-2 max-h-40 overflow-y-auto">
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder={
                      <p className="font-light italic">
                        Chọn truyện bạn dùng để trao đổi...
                      </p>
                    }
                    virtual={true}
                    allowClear={true}
                    size="large"
                    value={selectedRequestComicsList}
                    options={requestSelectOptionValues}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    optionRender={(option) => (
                      <div className="h-max flex items-center gap-2">
                        <img
                          src={option.data.image}
                          className="w-[2em] rounded-lg"
                        />
                        <p>{option.data.label}</p>
                      </div>
                    )}
                    labelRender={(option) => (
                      <div className="font-light">{option.label}</div>
                    )}
                    onSelect={(value: string) => {
                      setSelectedRequestComicsList((prev) => [...prev, value]);
                    }}
                    onDeselect={(value: string) => {
                      const filtered = selectedRequestComicsList.filter(
                        (comics) => comics !== value
                      );
                      setSelectedRequestComicsList(filtered);
                    }}
                    onClear={() => setSelectedRequestComicsList([])}
                  />
                </div>

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

                <div className="py-2 max-h-40 overflow-y-auto">
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder={
                      <p className="font-light italic">
                        Chọn truyện bạn muốn có để người khác trao đổi với
                        bạn...
                      </p>
                    }
                    virtual={true}
                    allowClear={true}
                    size="large"
                    value={selectedPostComicsList}
                    options={postSelectOptionValues}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    optionRender={(option) => (
                      <div className="h-max flex items-center gap-2">
                        <img
                          src={option.data.image}
                          className="w-[2em] rounded-lg"
                        />
                        <p>{option.data.label}</p>
                      </div>
                    )}
                    onSelect={(value: string) => {
                      setSelectedPostComicsList((prev) => [...prev, value]);
                    }}
                    onDeselect={(value: string) => {
                      const filtered = selectedPostComicsList.filter(
                        (comics) => comics !== value
                      );
                      setSelectedPostComicsList(filtered);
                    }}
                    onClear={() => setSelectedPostComicsList([])}
                  />
                </div>

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
