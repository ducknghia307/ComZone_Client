import { ExchangeDetails } from "../../../common/interfaces/exchange.interface";
import { Comic, UserInfo } from "../../../common/base.interface";
import CurrencySplitter from "../../../assistants/Spliter";
import { Avatar, Checkbox, message, Modal, notification } from "antd";
import { SetStateAction, useState } from "react";
import ViewBothComicsLists from "./information-collect/ViewBothComicsLists";
import UpdateAndRevealPost from "./information-collect/UpdateAndRevealPost";
import { privateAxios } from "../../../middleware/axiosInstance";

export default function ExchangeInformation({
  exchangeDetails,
  firstUser,
  secondUser,
  firstCurrentStage,
  secondCurrentStage,
  firstComicsGroup,
  secondComicsGroup,
  setIsLoading,
}: {
  exchangeDetails: ExchangeDetails;
  firstCurrentStage: number;
  secondCurrentStage: number;
  firstUser: UserInfo | null;
  secondUser: UserInfo | null;
  firstComicsGroup: Comic[];
  secondComicsGroup: Comic[];
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [isViewingComics, setIsViewingComics] = useState<boolean>(false);
  const [isCancelingExchange, setIsCancelingExchange] =
    useState<boolean>(false);
  const [cancelChecked, setCancelChecked] = useState<boolean>(false);
  const [isAskingToRevealPost, setIsAskingToRevealPost] =
    useState<boolean>(false);

  const handleCancelExchange = async () => {
    setIsCancelingExchange(false);

    setIsLoading(true);
    await privateAxios
      .patch(`exchange-confirmation/cancel/${exchangeDetails.exchange.id}`)
      .then(() => {
        setIsAskingToRevealPost(true);
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Lỗi hệ thống",
          description: "Vui lòng thử lại sau!",
          duration: 5,
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 py-4">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold uppercase pb-2">
          THÔNG TIN TRAO ĐỔI
        </p>

        <div className="flex items-center justify-between text-sm font-light">
          <p>Tổng số truyện của bạn:</p>
          <p className="font-semibold">{firstComicsGroup?.length}</p>
        </div>
        <div className="flex items-center justify-between text-sm font-light">
          <p>Tổng số truyện bạn có sau trao đổi:</p>
          <p className="font-semibold">{secondComicsGroup?.length}</p>
        </div>

        {exchangeDetails.exchange.depositAmount && (
          <div className="flex items-center justify-between text-sm font-light mt-4">
            <p>Giá trị tiền cọc:</p>
            <p className="font-semibold">
              {CurrencySplitter(exchangeDetails.exchange.depositAmount || 0)} đ
            </p>
          </div>
        )}

        {exchangeDetails.exchange.compensationAmount &&
          exchangeDetails.exchange.compensationAmount > 0 && (
            <div className="flex items-center justify-between text-sm font-light">
              <p>Giá trị tiền bù:</p>
              <p
                className={`${
                  exchangeDetails.exchange.compensateUser?.id === firstUser?.id
                    ? "text-red-600"
                    : "text-green-600"
                } font-semibold`}
              >
                {exchangeDetails.exchange.compensateUser?.id === firstUser?.id
                  ? "- "
                  : "+ "}
                {CurrencySplitter(exchangeDetails.exchange.compensationAmount)}{" "}
                đ
              </p>
            </div>
          )}
      </div>

      {firstCurrentStage > 0 && (
        <div className="w-full flex items-stretch gap-2">
          <button
            onClick={() => setIsCancelingExchange(true)}
            className={`${
              firstCurrentStage > 3 && "hidden"
            } flex items-center gap-2 border border-red-600 px-2 rounded-md text-red-600`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
            </svg>
            <p>Dừng trao đổi</p>
          </button>
          <Modal
            open={isCancelingExchange}
            onCancel={(e) => {
              e.stopPropagation();
              setIsCancelingExchange(false);
            }}
            footer={null}
            centered
          >
            <div className="pt-4 flex flex-col gap-4">
              <p className="font-semibold text-xl">HỦY CUỘC TRAO ĐỔI</p>

              <p>
                Nếu dừng trao đổi, bạn sẽ không thể tiếp tục thảo luận hay trò
                truyện với{" "}
                <span className="font-semibold">
                  <Avatar src={secondUser?.avatar} />
                  &ensp;
                  {secondUser?.name}
                </span>
                &ensp;về cuộc trao đổi này.
                <br />
                <span className="text-xs text-red-500 italic">
                  *Hành động này không thể hoàn tác.
                </span>
              </p>

              <div className="flex items-center gap-2 mt-4">
                <Checkbox
                  checked={cancelChecked}
                  onChange={() => setCancelChecked(!cancelChecked)}
                />
                <p>Xác nhận hủy cuộc trao đổi này</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={!cancelChecked}
                  onClick={() => handleCancelExchange()}
                  className="basis-1/3 py-2 rounded-md border bg-red-600 text-white disabled:opacity-30 duration-200 hover:bg-red-800"
                >
                  DỪNG TRAO ĐỔI
                </button>

                <button
                  onClick={() => setIsCancelingExchange(false)}
                  className="grow py-2 rounded-md text-white bg-green-800 duration-200 hover:bg-green-900"
                >
                  TIẾP TỤC TRAO ĐỔI
                </button>
              </div>
            </div>
          </Modal>
          <UpdateAndRevealPost
            open={isAskingToRevealPost}
            setOpen={setIsAskingToRevealPost}
            post={exchangeDetails.exchange.post}
            setIsLoading={setIsLoading}
          />

          <button
            onClick={() => setIsViewingComics(true)}
            className="grow gap-2 bg-gray-800 text-white py-2 rounded-md duration-200 hover:bg-gray-700"
          >
            XEM TRUYỆN TRAO ĐỔI
          </button>
          <Modal
            open={isViewingComics}
            onCancel={(e) => {
              e.stopPropagation();
              setIsViewingComics(false);
            }}
            footer={null}
            width={window.innerWidth * 0.5}
          >
            <div className="pt-8 flex flex-col gap-4">
              <p className="font-semibold text-xl">
                DANH SÁCH TRUYỆN TRAO ĐỔI:
                <p className="font-light text-sm">
                  Trạng thái:&ensp;
                  {firstCurrentStage > 0 && secondCurrentStage > 0 ? (
                    <span className="text-green-600">Đã xác nhận</span>
                  ) : (
                    <span className="text-red-600">Chưa xác nhận</span>
                  )}
                </p>
              </p>
              <ViewBothComicsLists
                requestComicsList={exchangeDetails.requestUserList.map(
                  (item) => item.comics
                )}
                postComicsList={exchangeDetails.postUserList.map(
                  (item) => item.comics
                )}
                isRequestUser={exchangeDetails.isRequestUser}
              />
              <button
                onClick={() => setIsViewingComics(false)}
                className="self-baseline ml-auto px-8 py-1 rounded-md font-light border border-gray-400 hover:border-gray-800 hover:font-medium"
              >
                Đóng
              </button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
