import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { Comic } from "../../common/base.interface";
import { useEffect, useState } from "react";
import SelectOfferComicsModal from "../exchange/SelectOfferComicsModal";
import { ChatRoom } from "../../common/interfaces/chat-room.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import { ExchangeOffer } from "../../common/interfaces/exchange-offer.interface";

export default function ExchangeSectionInChat({
  chatRoom,
  isLoading,
}: {
  chatRoom: ChatRoom;
  isLoading: boolean;
}) {
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [exchangeOffer, setExchangeOffer] = useState<ExchangeOffer>();

  const { firstUser, exchangeRequest } = chatRoom;

  const containerItem: CollapseProps["items"] = [
    {
      key: 0,
      label: (
        <p>
          Danh sách truyện được yêu cầu (
          {exchangeRequest?.requestComics.length || 0})
        </p>
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

  const fetchExchangeOffer = async () => {
    if (!exchangeRequest) return;

    await privateAxios
      .get(`exchange-offers/exchange-request/${exchangeRequest.id}`)
      .then((res) => {
        const offer = res.data;
        setExchangeOffer(offer);
        if (!offer.offerComics || offer.offerComics.length === 0) return;
        containerItem.push({
          key: 2,
          label: (
            <p>
              Danh sách truyện được dùng để trao đổi (
              {offer?.offerComics.length || 0})
            </p>
          ),
          children: (
            <div className="flex flex-col items-stretch justify-start gap-2">
              {offer
                ? offer.offerComics.map((comics: Comic) => {
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
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchExchangeOffer();
  }, [chatRoom]);

  if (!exchangeRequest) return;

  return (
    <div className="w-full flex flex-col items-stretch justify-between gap-1 px-2">
      <Collapse items={containerItem} size="large" className="w-full mt-4" />

      <div className="flex flex-col items-stretch pt-2">
        <button
          disabled={exchangeOffer !== null}
          onClick={() => setIsSelectModalOpen(true)}
          className={`${
            firstUser.id === exchangeRequest?.user.id && "hidden"
          } ${
            exchangeOffer
              ? "disabled:bg-gray-300"
              : "bg-sky-700 hover:bg-sky-800 duration-200"
          } text-white py-2 rounded-lg`}
        >
          {exchangeOffer ? `Đang chờ phản hồi...` : "Chọn truyện để trao đổi"}
        </button>

        <div
          className={`${
            (firstUser.id !== exchangeRequest?.user.id || !exchangeOffer) &&
            "hidden"
          } flex flex-col gap-2`}
        >
          <button
            onClick={() => handleAcceptOrReject("accept")}
            className={`bg-green-600 hover:bg-green-800 duration-200 text-white text-lg py-2 rounded-lg`}
          >
            Chấp nhận trao đổi
          </button>

          <button
            onClick={() => handleAcceptOrReject("reject")}
            className={`${
              firstUser.id !== exchangeRequest?.user.id && "hidden"
            } bg-red-600 hover:bg-red-800 duration-200 text-white text-lg py-2 rounded-lg`}
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
}
