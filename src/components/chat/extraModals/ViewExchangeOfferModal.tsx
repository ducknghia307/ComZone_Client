import { Modal } from "antd";
import { ExchangeOffer } from "../../../common/interfaces/exchange-offer.interface";
import { Comic } from "../../../common/base.interface";

export default function ViewExchangeOfferModal({
  isOpen,
  setIsOpen,
  exchangeOffer,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  exchangeOffer: ExchangeOffer | undefined;
}) {
  return (
    <Modal
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setIsOpen(false);
      }}
      footer={null}
      centered
    >
      <div>
        {exchangeOffer?.offerComics.map((comics: Comic) => {
          return <div>{comics.title}</div>;
        })}
      </div>
    </Modal>
  );
}
