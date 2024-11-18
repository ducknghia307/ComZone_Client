import { Collapse } from "antd";
import { useState } from "react";
import { ChatRoom } from "../../common/interfaces/chat-room.interface";
import { useAppSelector } from "../../redux/hooks";
import ViewExchangeOfferModal from "./extraModals/ViewExchangeOfferModal";
import ProgressSection from "./exchangeComponents/ProgressSection";

export default function ExchangeSectionInChat({
  chatRoom,
  setIsLoading,
  fetchChatRoomList,
}: {
  chatRoom: ChatRoom;
  setIsLoading: Function;
  fetchChatRoomList: Function;
}) {
  const { userId } = useAppSelector((state) => state.auth);
  const [isViewingOffer, setIsViewingOffer] = useState<boolean>(false);

  const { exchange } = chatRoom;

  if (!exchange) return;

  return <div>{exchange.id}</div>;
}
