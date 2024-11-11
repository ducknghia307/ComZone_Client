import { Modal, notification, Select, Switch, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { privateAxios } from "../../../middleware/axiosInstance";
import { Comic } from "../../../common/base.interface";
import CurrencySplitter from "../../../assistants/Spliter";
import { ExchangeRequest } from "../../../common/interfaces/exchange-request.interface";

export default function SelectOfferComicsModal({
  exchangeRequest,
  isSelectModalOpen,
  setIsSelectModalOpen,
  isLoading,
}: {
  exchangeRequest: ExchangeRequest;
  isSelectModalOpen: boolean;
  setIsSelectModalOpen: Function;
  isLoading: boolean;
}) {
  const [selectOptionValues, setSelectOptionValues] = useState<
    { label: string; value: string; image: string }[]
  >([]);
  const [selectedComicsList, setSelectedComicsList] = useState<string[]>([]);
  const [isCompensating, setIsCompensating] = useState<boolean>(false);
  const [compensationAmount, setCompensationAmount] = useState<number>(0);

  const [api, contextHolder] = notification.useNotification();

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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setSelectOptionValues([]);
    setSelectedComicsList([]);
    setIsCompensating(false);
    setCompensationAmount(0);
    setIsSelectModalOpen(false);
  };

  const handleSubmitOffer = async (e: any) => {
    console.log("first: ", selectedComicsList);
    console.log("second: ", compensationAmount);

    await privateAxios
      .post("exchange-offers", {
        exchangeRequest: exchangeRequest.id,
        offerComics: selectedComicsList,
        compensationAmount,
      })
      .then(() => {
        api.open({
          type: "success",
          message: "Gửi thành công!",
          description:
            "Yêu cầu đề nghị trao đổi đã được gửi đi. Hãy chờ phản hồi của người nhận.",
          duration: 10,
        });
        handleModalClose(e);
      })
      .catch(() => {
        api.open({
          type: "error",
          message: "Gửi không thành công!",
          description:
            "Yêu cầu đề nghị trao đổi đã được gửi đi trước đó. Vui lòng chờ phản hồi từ người nhận!",
          duration: 10,
        });
      });
  };

  return (
    <Modal
      open={isSelectModalOpen}
      onCancel={(e) => handleModalClose(e)}
      footer={null}
      width={1000}
      maskClosable={false}
    >
      <div className="w-full lg:h-[50vh] py-4 flex flex-col items-stretch justify-between gap-4">
        {contextHolder}
        <div className="flex flex-col items-stretch gap-8">
          <p className="text-[1.5em] font-semibold">
            Chọn truyện của bạn dùng để trao đổi:
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

            <span className="flex items-center gap-2">
              <Tooltip
                title={
                  <p className="text-black font-light">
                    Đây là khoản tiền cộng thêm để bù cho tổng giá trị những
                    truyện bạn dùng để thực hiện trao đổi.
                    <br />
                    Hãy trao đổi cụ thể với người yêu cầu trao đổi để có được
                    khoản bù chính xác nhất.
                  </p>
                }
                color="white"
                placement="bottomLeft"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z"></path>
                </svg>
              </Tooltip>
              <p className="font-light">Bù thêm giá:</p>
              <Switch
                checked={isCompensating}
                onChange={() => {
                  setCompensationAmount(0);
                  setIsCompensating(!isCompensating);
                }}
                className="w-4"
              />
            </span>

            <span
              className={`${
                !isCompensating && "invisible"
              } flex items-center gap-2`}
            >
              <p className="font-light">Tổng số tiền bù thêm:</p>
              <input
                type="text"
                value={CurrencySplitter(compensationAmount)}
                onChange={(e) => {
                  const onlyNumberInput = e.target.value.replace(/,/g, "");
                  if (onlyNumberInput.length > 9) return;
                  if (e.target.value.length === 0) setCompensationAmount(0);
                  else if (onlyNumberInput.match("[0-9]+")) {
                    setCompensationAmount(parseInt(onlyNumberInput));
                  }
                }}
                className="w-[7em] text-end"
              />
              <span className="font-light text-xs">đ</span>
            </span>
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
            onClick={(e) => handleSubmitOffer(e)}
            className="px-8 py-2 bg-sky-700 text-white rounded-lg duration-200 hover:bg-sky-900 disabled:bg-gray-300"
          >
            HOÀN TẤT
          </button>
        </div>
      </div>
    </Modal>
  );
}
