/* eslint-disable react-hooks/exhaustive-deps */
import { SetStateAction, useEffect, useState } from "react";
import { ChatRoom } from "../../common/interfaces/chat-room.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import { ExchangeResponse } from "../../common/interfaces/exchange.interface";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";

export default function ExchangeSectionInChat({
  chatRoom,
  setIsChatOpen,
}: {
  chatRoom: ChatRoom;
  setIsChatOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [exchangeResponse, setExchangeResponse] = useState<ExchangeResponse>();

  const navigate = useNavigate();

  const exchange = chatRoom.exchange;

  const fetchExchangeDetails = async () => {
    if (!exchange) return;
    await privateAxios
      .get(`exchange-comics/exchange/${exchange.id}`)
      .then((res) => {
        setExchangeResponse(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchExchangeDetails();
  }, [chatRoom]);

  const redirectToExchange = () => {
    if (exchange) {
      setIsChatOpen(false);
      navigate(`/exchange/detail/${exchange.id}`);
    }
  };

  if (!exchange) return;

  const currentBadgeColor = () => {
    switch (exchange.status) {
      case "PENDING":
        return "bg-orange-600";

      case "DEALING":
      case "DELIVERING":
      case "DELIVERED":
        return "bg-sky-800";

      case "SUCCESSFUL":
        return "bg-green-600";

      case "FAILED":
      case "CANCELED":
      case "REJECTED":
        return "bg-red-600";
      default:
        return "bg-black";
    }
  };

  const getByStatus = () => {
    switch (exchange.status) {
      case "PENDING": {
        return (
          <div className="w-full flex items-center justify-between gap-4">
            {exchangeResponse?.isRequestUser ? (
              <div className="flex items-center gap-8">
                Đang chờ yêu cầu được chấp nhận{" "}
                <div className={`${styles.smallDotTyping} opacity-50`}></div>
              </div>
            ) : (
              <p>Bạn có yêu cầu trao đổi mới.</p>
            )}

            <button
              onClick={() => redirectToExchange()}
              className="relative min-w-fit whitespace-nowrap px-4 py-1 rounded-md border border-gray-500 duration-200 hover:bg-gray-100"
            >
              Xem thông tin yêu cầu
              {!exchangeResponse?.isRequestUser && (
                <span className="absolute top-0 right-0 translate-x-1 translate-y-[-0.25em] p-1 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        );
      }
      case "DEALING": {
        return (
          <div className="flex items-center gap-8">
            Đang tiến hành trao đổi{" "}
            <div className={`${styles.smallDotTyping} opacity-50`}></div>
          </div>
        );
      }
      case "DELIVERING":
      case "DELIVERED": {
        return (
          <div className="flex items-center gap-8">
            Đang giao hàng{" "}
            <div className={`${styles.smallDotTyping} opacity-50`}></div>
          </div>
        );
      }
      case "SUCCESSFUL": {
        return <p className="font-light">Trao đổi thành công.</p>;
      }
      case "FAILED": {
        return <p className="font-light">Trao đổi thất bại.</p>;
      }

      case "REJECTED": {
        return (
          <p className="font-light">
            Yêu cầu trao đổi đã bị từ chối hoặc người nhận đã chấp nhận cuộc
            trao đổi khác.
          </p>
        );
      }
    }
  };

  return (
    <div className="relative w-full h-16 flex items-center border-b border-gray-300">
      <div className="w-full flex items-center justify-between gap-4 px-8">
        {getByStatus()}

        {exchange.status && exchange.status !== "PENDING" && (
          <button
            onClick={() => redirectToExchange()}
            className="relative min-w-fit whitespace-nowrap px-4 py-1 rounded-md border border-gray-500"
          >
            Xem cuộc trao đổi
          </button>
        )}
      </div>
      <span
        className={`absolute top-0 left-0 w-2 h-full ${currentBadgeColor()}`}
      />
    </div>
  );
}
