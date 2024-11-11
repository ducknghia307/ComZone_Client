import { useState } from "react";
import SingleOfferedComics from "./SingleOfferedComics";
import styles from "./style.module.css";
import { ExchangeRequest } from "../../common/interfaces/exchange-request.interface";
import moment from "moment/min/moment-with-locales";
import dateFormat from "../../assistants/date.format";
import SelectOfferComicsModal from "../chat/right/SelectOfferComicsModal";
import { Modal } from "antd";
import { privateAxios } from "../../middleware/axiosInstance";
import { Comic } from "../../common/base.interface";

moment.locale("vi");

export default function ExchangePost({
  exchangeRequest,
  refs,
  index,
  isLoading,
  isSelectModalOpen,
  setIsSelectModalOpen,
  currentUserId,
}: {
  exchangeRequest: ExchangeRequest;
  refs: any[];
  index: number;
  isLoading: boolean;
  isSelectModalOpen: string;
  setIsSelectModalOpen: Function;
  currentUserId: string;
}) {
  const [currentlySelected, setCurrentlySelected] = useState<number>(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comicExchangeOffer, setComicExchangeOffer] = useState<Comic[]>([]);
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSelect = (value: number) => {
    if (currentlySelected === value) setCurrentlySelected(-1);
    else setCurrentlySelected(value);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
    fetchComicExchangeOffer();
  };
  const checkTimeDisplay =
    exchangeRequest.createdAt &&
    moment(new Date()).unix() - moment(exchangeRequest.createdAt).unix() >
      172800;

  const fetchComicExchangeOffer = async () => {
    try {
      const res = await privateAxios(
        `/comics/exchange-offer/${exchangeRequest.user.id}`
      );
      setComicExchangeOffer(res.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="w-full flex rounded-lg px-4 max-w-[100em] bg-white drop-shadow-md">
      <div className="grow flex flex-col min-w-[30em] px-2 py-4">
        <div className="flex items-center justify-between gap-4">
          <div
            ref={index === 0 ? refs[1] : null}
            className="w-full flex items-center gap-4"
          >
            <img
              src={
                exchangeRequest.user.avatar ||
                "https://static.vecteezy.com/system/resources/thumbnails/020/911/740/small/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
              }
              className="w-[4em] h-[4em] rounded-full"
            />
            <div className="flex flex-col items-start gap-1">
              <p className="font-semibold text-lg tracking-wide">
                {exchangeRequest.user.name}
              </p>
              <p className="font-light text-[0.7em] tracking-wider">
                {checkTimeDisplay ? (
                  <span>
                    {dateFormat(exchangeRequest.createdAt, "dd/mm/yy")} &#8226;{" "}
                    {dateFormat(exchangeRequest.createdAt, "HH:MM")}
                  </span>
                ) : (
                  moment(exchangeRequest.createdAt).calendar()
                )}
              </p>
            </div>
            <span
              className={`${
                exchangeRequest.user.role !== "SELLER" && "hidden"
              } flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500 text-white`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="currentColor"
              >
                <path d="M14 4.4375C15.3462 4.4375 16.4375 3.34619 16.4375 2H17.5625C17.5625 3.34619 18.6538 4.4375 20 4.4375V5.5625C18.6538 5.5625 17.5625 6.65381 17.5625 8H16.4375C16.4375 6.65381 15.3462 5.5625 14 5.5625V4.4375ZM1 11C4.31371 11 7 8.31371 7 5H9C9 8.31371 11.6863 11 15 11V13C11.6863 13 9 15.6863 9 19H7C7 15.6863 4.31371 13 1 13V11ZM4.87601 12C6.18717 12.7276 7.27243 13.8128 8 15.124 8.72757 13.8128 9.81283 12.7276 11.124 12 9.81283 11.2724 8.72757 10.1872 8 8.87601 7.27243 10.1872 6.18717 11.2724 4.87601 12ZM17.25 14C17.25 15.7949 15.7949 17.25 14 17.25V18.75C15.7949 18.75 17.25 20.2051 17.25 22H18.75C18.75 20.2051 20.2051 18.75 22 18.75V17.25C20.2051 17.25 18.75 15.7949 18.75 14H17.25Z"></path>
              </svg>
              <p className="text-xs">Người bán trên ComZone</p>
            </span>
          </div>

          <div
            className={`${
              currentUserId === exchangeRequest.user.id && "hidden"
            }`}
          >
            <div className="flex flex-row gap-4">
              <button
                className="border rounded-lg min-w-max p-2"
                onClick={handleOpenModal}
              >
                Xem truyện của{" "}
                <span className="font-semibold">
                  {exchangeRequest.user.name}
                </span>
              </button>
              <button
                ref={index == 0 ? refs[2] : null}
                onClick={() => setIsSelectModalOpen(exchangeRequest.id)}
                className="min-w-max p-2 bg-sky-700 text-white rounded-lg"
              >
                Bắt đầu trao đổi
              </button>
            </div>
            <SelectOfferComicsModal
              exchangeRequest={exchangeRequest}
              isLoading={isLoading}
              isSelectModalOpen={isSelectModalOpen}
              setIsSelectModalOpen={setIsSelectModalOpen}
            />
          </div>
        </div>

        <p className="pl-2 py-4">{exchangeRequest.postContent}</p>

        <div
          ref={index === 0 ? refs[0] : null}
          className={`${
            exchangeRequest.requestComics.length === 0 && "hidden"
          } w-full border border-gray-300 rounded-lg relative overflow-hidden mt-4`}
        >
          <div className="w-full bg-[rgba(0,0,0,0.03)] border-b border-gray-300 py-2 top-0 sticky">
            <p className="px-4 font-light">
              Danh sách truyện{" "}
              <span className="font-semibold">{exchangeRequest.user.name}</span>{" "}
              đang tìm kiếm trao đổi:
            </p>
          </div>

          <div
            className={`w-full flex flex-wrap gap-x-[2%] gap-y-2 p-2 max-h-[25em] relative overflow-y-auto ${styles.exchangeRequest}`}
          >
            {exchangeRequest.requestComics &&
              exchangeRequest.requestComics.map((comics, index) => {
                return (
                  <SingleOfferedComics
                    key={index}
                    comics={comics}
                    index={index}
                    currentlySelected={currentlySelected}
                    handleSelect={handleSelect}
                    length={exchangeRequest.requestComics?.length || 0}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <div
          ref={index === 0 ? refs[0] : null}
          className={`${
            comicExchangeOffer.length === 0 && "hidden"
          } w-full border border-gray-300 rounded-lg relative overflow-hidden mt-4`}
        >
          <div className="w-full bg-[rgba(0,0,0,0.03)] border-b border-gray-300 py-2 top-0 sticky">
            <p className="px-4 font-light">
              Danh sách truyện{" "}
              <span className="font-semibold">{exchangeRequest.user.name}</span>{" "}
              đang có:
            </p>
          </div>

          <div
            className={`w-full flex flex-wrap gap-x-[2%] gap-y-2 p-2 max-h-[25em] relative overflow-y-auto ${styles.exchangeRequest}`}
          >
            {comicExchangeOffer &&
              comicExchangeOffer.map((comics, index) => {
                return (
                  <SingleOfferedComics
                    key={index}
                    comics={comics}
                    index={index}
                    currentlySelected={currentlySelected}
                    handleSelect={handleSelect}
                    length={comicExchangeOffer.length || 0}
                  />
                );
              })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
