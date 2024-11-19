import { useEffect, useState } from "react";
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
  setIsChatOpen: Function;
}) {
  const [exchangeResponse, setExchangeResponse] = useState<ExchangeResponse>();

  const navigate = useNavigate();
  const { exchange } = chatRoom;

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
  }, [chatRoom.id]);

  const redirectToExchange = () => {
    sessionStorage.setItem(
      "connectedExchange",
      exchangeResponse?.exchange.id || ""
    );
    setIsChatOpen(false);
    navigate("/exchange/all");
  };

  if (!exchange) return;

  const currentBadgeColor = () => {
    switch (exchange.status) {
      case "PENDING":
        return "sky-500";

      case "DEALING":
      case "DELIVERING":
      case "DELIVERED":
        return "sky-800";

      case "SUCCESSFUL":
        return "green-600";

      case "FAILED":
      case "CANCELED":
      case "REJECTED":
        return "red-600";
      default:
        return "black";
    }
  };

  const getByStatus = () => {
    switch (exchange.status) {
      case "PENDING": {
        return (
          <div className="w-full flex items-center justify-between gap-4 px-8">
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
          <div className="w-full flex items-center justify-between gap-4 px-8">
            <div className="flex items-center gap-8">
              Đang tiến hành trao đổi{" "}
              <div className={`${styles.smallDotTyping} opacity-50`}></div>
            </div>

            <button
              onClick={() => redirectToExchange()}
              className="relative min-w-fit whitespace-nowrap px-4 py-1 rounded-md border border-gray-500"
            >
              Xem cuộc trao đổi
            </button>
          </div>
        );
      }
      case "DELIVERING":
      case "DELIVERED": {
        return (
          <div className="w-full flex items-center justify-between gap-4 px-8">
            <div className="flex items-center gap-8">
              Đang chờ giao hàng{" "}
              <div className={`${styles.smallDotTyping} opacity-50`}></div>
            </div>

            <button className="relative min-w-fit whitespace-nowrap px-4 py-1 rounded-md border border-gray-500">
              Xem cuộc trao đổi
            </button>
          </div>
        );
      }
      case "SUCCESSFUL": {
        return (
          <div className="w-full flex items-center justify-between gap-4 px-8">
            <p className="font-light">Trao đổi thành công.</p>

            <button className="relative min-w-fit whitespace-nowrap px-4 py-1 rounded-md border border-gray-500">
              Xem cuộc trao đổi
            </button>
          </div>
        );
      }
      case "FAILED": {
        return (
          <div className="w-full flex items-center justify-between gap-4 px-8">
            <p className="font-light">Trao đổi thất bại.</p>

            <button className="relative min-w-fit whitespace-nowrap px-4 py-1 rounded-md border border-gray-500">
              Xem cuộc trao đổi
            </button>
          </div>
        );
      }
      case "CANCELED": {
        return (
          <div className="w-full flex items-center justify-between gap-4 px-8">
            <p className="font-light">Trao đổi đã bị hủy.</p>

            <button className="relative min-w-fit whitespace-nowrap px-4 py-1 rounded-md border border-gray-500">
              Xem cuộc trao đổi
            </button>
          </div>
        );
      }
      case "REJECTED": {
        return (
          <div className="w-full flex items-center justify-between gap-4 px-8">
            <p className="font-light">
              Yêu cầu trao đổi đã bị từ chối hoặc người nhận đã chấp nhận cuộc
              trao đổi khác.
            </p>

            <button className="relative min-w-fit whitespace-nowrap px-4 py-1 rounded-md border border-gray-500">
              Xem cuộc trao đổi
            </button>
          </div>
        );
      }
    }
  };

  return (
    <div className="relative w-full h-16 flex items-center border-b border-gray-300">
      {getByStatus()}
      <span
        className={`absolute top-0 left-0 w-2 h-full bg-${currentBadgeColor()}`}
      />
    </div>
  );
}
