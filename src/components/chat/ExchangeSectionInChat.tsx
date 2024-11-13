import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { Comic } from "../../common/base.interface";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { ChatRoom } from "../../common/interfaces/chat-room.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import { ExchangeOffer } from "../../common/interfaces/exchange-offer.interface";
import { useAppSelector } from "../../redux/hooks";
import ViewExchangeOfferModal from "./extraModals/ViewExchangeOfferModal";
import ProgressSection from "./exchangeComponents/ProgressSection";

export default function ExchangeSectionInChat({
  chatRoom,
  currentRoomIdRef,
  handleDeleteExchangeOffer,
  fetchChatRoomList,
  setIsLoading,
}: {
  chatRoom: ChatRoom;
  currentRoomIdRef: MutableRefObject<string>;
  setIsLoading: Function;
  fetchChatRoomList: Function;
  handleDeleteExchangeOffer: Function;
}) {
  const { userId } = useAppSelector((state) => state.auth);
  const [exchangeOffer, setExchangeOffer] = useState<ExchangeOffer>();
  const [isViewingOffer, setIsViewingOffer] = useState<boolean>(false);

  const { exchangeRequest } = chatRoom;

  const requestItems: CollapseProps["items"] = [
    {
      key: 0,
      label: (
        <span className="flex flex-row gap-1">
          Danh sách{" "}
          {exchangeRequest?.user.id === userId ? (
            "bạn"
          ) : (
            <p className="font-semibold">{exchangeRequest?.user.name}</p>
          )}{" "}
          đang tìm kiếm trao đổi ({exchangeRequest?.requestComics.length || 0})
        </span>
      ),
      children: (
        <div className="flex flex-col items-stretch justify-start gap-2">
          {exchangeRequest
            ? exchangeRequest.requestComics.map((comics: Comic) => {
                return (
                  <div
                    key={comics.id}
                    className="w-full flex items-center gap-4"
                  >
                    <img
                      src={comics.coverImage}
                      className="w-[4em] rounded-lg"
                    />
                    <span className="flex flex-col items-start justify-center">
                      <p className="font-semibold line-clamp-2">
                        {comics.title}
                      </p>
                      <p className="text-xs font-light">{comics.author}</p>
                    </span>
                  </div>
                );
              })
            : null}
        </div>
      ),
    },
  ];

  const fetchExchangeOffer = useCallback(async () => {
    if (!exchangeRequest) return;
    setIsLoading(true);
    await privateAxios
      .get(
        `exchange-offers/exchange-request/${exchangeRequest.id}/offer-user/${
          exchangeRequest.user.id === userId ? chatRoom.secondUser.id : userId
        }`
      )
      .then((res) => {
        const offer = res.data;
        if (offer) setExchangeOffer(offer);
        else setExchangeOffer(undefined);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [currentRoomIdRef]);

  useEffect(() => {
    fetchExchangeOffer();
  }, [currentRoomIdRef]);

  const updateExchangeOfferSeenStatus = async () => {
    if (
      exchangeRequest &&
      exchangeRequest.user.id === userId &&
      exchangeOffer?.status === "PENDING"
    )
      await privateAxios
        .patch(`exchange-offers/status/seen/${exchangeOffer?.id}`)
        .then(() => {
          fetchExchangeOffer();
        })
        .catch((err) => console.log(err));
  };

  if (!exchangeRequest) return;

  if (exchangeRequest.status !== "DEALING")
    return (
      <div className="w-full flex flex-col items-stretch justify-between gap-1 px-2 overflow-y-auto">
        <Collapse items={requestItems} size="large" className="w-full mt-1" />

        <div className="flex items-center gap-1 pt-1">
          <button
            onClick={() => {
              updateExchangeOfferSeenStatus();
              setIsViewingOffer(true);
            }}
            className={`relative grow flex items-center justify-center gap-2 py-2 rounded-lg border border-black duration-200 hover:bg-gray-100`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
            </svg>
            <p>
              Xem truyện{" "}
              {exchangeOffer?.user.id === userId ? (
                "bạn"
              ) : (
                <span className="font-semibold">
                  {chatRoom.secondUser.name}
                </span>
              )}{" "}
              yêu cầu
            </p>
            <span
              className={`${
                (exchangeRequest.user.id !== userId ||
                  exchangeOffer?.status !== "PENDING") &&
                "hidden"
              } p-1 rounded-full bg-red-500 absolute right-0 top-0 translate-x-1/3 translate-y-[-50%]`}
            />
            {exchangeOffer && (
              <ViewExchangeOfferModal
                userId={userId}
                exchangeOffer={exchangeOffer}
                isOpen={isViewingOffer}
                setIsOpen={setIsViewingOffer}
                chatRoomId={chatRoom.id}
                fetchChatRoomList={fetchChatRoomList}
                fetchExchangeOffer={fetchExchangeOffer}
                handleDeleteExchangeOffer={handleDeleteExchangeOffer}
                setIsLoading={setIsLoading}
              />
            )}
          </button>
        </div>
      </div>
    );
  else if (exchangeRequest.status === "DEALING" && exchangeOffer)
    return (
      <ProgressSection
        exchangeOffer={exchangeOffer}
        userId={userId}
        setIsLoading={setIsLoading}
      />
    );
}
