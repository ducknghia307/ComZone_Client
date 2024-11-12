import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { Comic } from "../../common/base.interface";
import { useCallback, useEffect, useMemo, useState } from "react";
import SelectOfferComicsModal from "../exchange/SelectOfferComicsModal";
import { ChatRoom } from "../../common/interfaces/chat-room.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import { ExchangeOffer } from "../../common/interfaces/exchange-offer.interface";
import ActionConfirm from "../actionConfirm/ActionConfirm";
import { useAppSelector } from "../../redux/hooks";
import ViewExchangeOfferModal from "./extraModals/ViewExchangeOfferModal";

export default function ExchangeSectionInChat({
  chatRoom,
  isLoading,
}: {
  chatRoom: ChatRoom;
  isLoading: boolean;
}) {
  const { userId } = useAppSelector((state) => state.auth);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [exchangeOffer, setExchangeOffer] = useState<ExchangeOffer>();
  const [isViewingOffer, setIsViewingOffer] = useState<boolean>(false);

  const { firstUser, exchangeRequest } = chatRoom;

  const requestItems: CollapseProps["items"] = [
    {
      key: 0,
      label: (
        <span className="flex flex-row gap-1">
          Danh sách{" "}
          <p className="font-semibold">{exchangeRequest?.user.name}</p> đang tìm
          kiếm trao đổi ({exchangeRequest?.requestComics.length || 0})
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
    if (!exchangeRequest || exchangeRequest.user.id === userId) return;

    await privateAxios
      .get(
        `exchange-offers/exchange-request/${exchangeRequest.id}/offer-user/${userId}`
      )
      .then((res) => {
        const offer = res.data;
        console.log("OFFER: ", offer);
        setExchangeOffer(offer);
        if (!offer.offerComics || offer.offerComics.length === 0) return;
      })
      .catch((err) => console.log(err));
  }, [chatRoom]);

  useEffect(() => {
    fetchExchangeOffer();
  }, [chatRoom]);

  const handleAcceptOrReject = async (type: "accept" | "reject") => {
    await privateAxios
      .patch(
        `exchange-offers/status/${
          type === "accept" ? "accepted" : "rejected"
        }/${exchangeOffer?.id}`
      )
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  if (!exchangeRequest) return;

  return (
    <div className="w-full flex flex-col items-stretch justify-between gap-1 px-2">
      <Collapse items={requestItems} size="large" className="w-full mt-1" />

      <div className="flex flex-col items-stretch pt-1">
        <button
          disabled={exchangeOffer !== null}
          onClick={() => setIsSelectModalOpen(true)}
          className={`${
            (userId === exchangeRequest?.user.id || exchangeOffer) && "hidden"
          } disabled:bg-gray-300 text-white py-2 rounded-lg`}
        >
          Đang chờ phản hồi...
        </button>

        <button
          onClick={() => setIsViewingOffer(true)}
          className={`${
            !exchangeOffer && "hidden"
          } relative py-2 rounded-lg border border-black`}
        >
          Xem truyện <span>{chatRoom.secondUser.name}</span> yêu cầu
          <span className="p-1 rounded-full bg-red-500 absolute right-0 top-0 translate-x-1/3 translate-y-[-50%]" />
          {exchangeOffer && (
            <ViewExchangeOfferModal
              exchangeOffer={exchangeOffer}
              isOpen={isViewingOffer}
              setIsOpen={setIsViewingOffer}
            />
          )}
        </button>

        {/* <div
          className={`${
            (firstUser.id !== exchangeRequest?.user.id || !exchangeOffer) &&
            "hidden"
          } w-full flex items-stretch gap-2`}
        >
          <button
            onClick={() => setIsConfirmingReject(true)}
            className={`${
              firstUser.id !== exchangeRequest?.user.id && "hidden"
            } grow bg-red-600 hover:bg-red-800 duration-200 text-white text-lg py-2 rounded-lg`}
          >
            Từ chối
          </button>
          <button
            onClick={() => setIsConfirmingAccept(true)}
            className={`basis-2/3 bg-green-600 hover:bg-green-800 duration-200 text-white text-lg font-semibold py-2 rounded-lg`}
          >
            Chấp nhận trao đổi
          </button>

          <ActionConfirm
            isOpen={isConfirmingAccept}
            setIsOpen={setIsConfirmingAccept}
            cancelCallback={() => {}}
            confirmCallback={() => handleAcceptOrReject("accept")}
            title="Xác nhận chấp nhận trao đổi?"
            description={
              <p className="text-xs font-light italic">
                Nếu bạn chấp nhận trao đổi, những yêu cầu trao đổi từ những
                người khác cho bộ truyện mà bạn tìm kiếm để trao đổi này sẽ bị
                từ chối.
              </p>
            }
          />
          <ActionConfirm
            isOpen={isConfirmingReject}
            setIsOpen={setIsConfirmingReject}
            cancelCallback={() => {}}
            confirmCallback={() => handleAcceptOrReject("reject")}
            title="Xác nhận từ chối yêu cầu trao đổi này?"
          />
        </div> */}
      </div>
    </div>
  );
}
