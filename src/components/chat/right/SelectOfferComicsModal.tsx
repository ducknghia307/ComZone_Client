import { Modal, notification, Select, Switch, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { privateAxios } from "../../../middleware/axiosInstance";
import { Comic } from "../../../common/base.interface";
import { ExchangeRequest } from "../../../common/interfaces/exchange-request.interface";
import ActionConfirm from "../../actionConfirm/ActionConfirm";

export default function SelectOfferComicsModal({
  exchangeRequest,
  isSelectModalOpen,
  setIsSelectModalOpen,
  isLoading,
}: {
  exchangeRequest: ExchangeRequest;
  isSelectModalOpen: string;
  setIsSelectModalOpen: Function;
  isLoading: boolean;
}) {
  const [selectOptionValues, setSelectOptionValues] = useState<
    { label: string; value: string; image: string }[]
  >([]);
  const [selectedComicsList, setSelectedComicsList] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const fetchUserOfferComics = async () => {
    await privateAxios.get("exchange-offers/comics/user").then((res) => {
      const list = res.data;
      if (!list && list.length === 0) return;
      else {
        setSelectOptionValues([]);
        list.map((comics: Comic) => {
          setSelectOptionValues((prev) => [
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
    fetchUserOfferComics();
  }, [isSelectModalOpen]);

  const handleModalClose = (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e && e.stopPropagation();
    setIsConfirming(false);
    setSelectOptionValues([]);
    setSelectedComicsList([]);
    setIsSelectModalOpen("");
  };

  const handleSubmitOffer = async () => {
    console.log(exchangeRequest);
    console.log(selectedComicsList);

    await privateAxios
      .post("exchange-offers", {
        exchangeRequest: exchangeRequest.id,
        offerComics: selectedComicsList,
        compensationAmount: 0,
      })
      .then(() => {
        notification.success({
          message: "Gửi thành công!",
          description:
            "Yêu cầu đề nghị trao đổi đã được gửi đi. Hãy chờ phản hồi của người nhận.",
          duration: 10,
        });
        handleModalClose();
      })
      .catch(() => {
        notification.error({
          message: "Gửi không thành công!",
          description:
            "Yêu cầu đề nghị trao đổi đã được gửi đi trước đó. Vui lòng chờ phản hồi từ người nhận!",
          duration: 10,
        });
        handleModalClose();
      });
  };

  return (
    <Modal
      open={isSelectModalOpen === exchangeRequest.id}
      onCancel={(e) => handleModalClose(e)}
      footer={null}
      width={1000}
      maskClosable={false}
    >
      <div className="w-full lg:h-[40vh] py-4 flex flex-col items-stretch justify-between gap-4">
        <div className="flex flex-col items-stretch gap-8">
          <p className="text-[1.5em] font-semibold">
            Chọn truyện của bạn dùng để trao đổi:
          </p>
          <p className="font-light italic">
            Thêm vào những truyện mà bạn muốn dùng để trao đổi. Bạn vẫn có thể
            thay đổi sau khi trao đổi trực tiếp với{" "}
            <span className="font-semibold">{exchangeRequest.user.name}</span>.
          </p>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Chọn truyện..."
            virtual={true}
            allowClear={true}
            size="large"
            value={selectedComicsList}
            options={selectOptionValues}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            optionRender={(option) => (
              <div className="h-max flex items-center gap-2">
                <img src={option.data.image} className="w-[2em] rounded-lg" />
                <p>{option.data.label}</p>
              </div>
            )}
            onSelect={(value: string) => {
              setSelectedComicsList((prev) => [...prev, value]);
            }}
            onDeselect={(value: string) => {
              const filtered = selectedComicsList.filter(
                (comics) => comics !== value
              );
              setSelectedComicsList(filtered);
            }}
            onClear={() => setSelectedComicsList([])}
          />

          <div
            className={`${
              selectedComicsList.length === 0 && "hidden"
            } flex items-center justify-between gap-2 text-lg`}
          >
            <p className="font-light">
              Tổng số truyện được chọn:{" "}
              <span className="font-semibold">{selectedComicsList.length}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-8">
          <button
            onClick={(e) => handleModalClose(e)}
            className="p-2 hover:underline"
          >
            Quay lại
          </button>
          <button
            disabled={selectedComicsList.length === 0}
            onClick={() => setIsConfirming(true)}
            className="px-8 py-2 bg-sky-700 text-white rounded-lg duration-200 hover:bg-sky-900 disabled:bg-gray-300"
          >
            HOÀN TẤT
          </button>
          <ActionConfirm
            isOpen={isConfirming}
            setIsOpen={setIsConfirming}
            title="Xác nhận gửi yêu cầu?"
            description={
              <p>
                Yêu cầu của bạn sẽ được gửi đến người dùng này. Bạn có thể tiếp
                tục trao đổi và cập nhật yêu cầu của bạn khi trò chuyện trực
                tiếp với họ.
              </p>
            }
            cancelCallback={() => {}}
            confirmCallback={() => handleSubmitOffer()}
          />
        </div>
      </div>
    </Modal>
  );
}
