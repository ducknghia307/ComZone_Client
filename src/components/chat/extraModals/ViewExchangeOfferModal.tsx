import { Collapse, Modal } from "antd";
import { ExchangeOffer } from "../../../common/interfaces/exchange-offer.interface";
import { Comic } from "../../../common/base.interface";
import styles from "../../exchange/style.module.css";
import { useState } from "react";
import ActionConfirm from "../../actionConfirm/ActionConfirm";
import { privateAxios } from "../../../middleware/axiosInstance";
export default function ViewExchangeOfferModal({
  isOpen,
  setIsOpen,
  exchangeOffer,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  exchangeOffer: ExchangeOffer | undefined;
}) {
  const [isConfirmingAccept, setIsConfirmingAccept] = useState<boolean>(false);
  const [isConfirmingReject, setIsConfirmingReject] = useState<boolean>(false);

  const handleAcceptOrReject = async (type: "accept" | "reject") => {
    await privateAxios
      .patch(
        `exchange-offers/status/${
          type === "accept" ? "accepted" : "rejected"
        }/${exchangeOffer?.id}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  return (
    <Modal
      title={
        <>
          <p className="text-xl font-bold px-2 pt-4">
            Danh sách truyện được yêu cầu
          </p>
          <p className="font-light italic  text-sm text-gray-700 mt-1 px-2">
            Bạn có thể thay đổi hoặc thêm truyện vào để tạo danh sách hoàn chỉnh
            theo ý muốn.{" "}
          </p>
        </>
      }
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setIsOpen(false);
      }}
      footer={null}
      centered
      width={700}
    >
      <div className="pt-4">
        <div
          className={`max-h-[20em] overflow-y-auto ${styles.exchangeRequest} px-2`}
        >
          {exchangeOffer?.offerComics.map((comics: Comic) => {
            return (
              <>
                <div
                  key={comics.id}
                  className={`${
                    exchangeOffer.offerComics.length > 1 ? "border-b" : ""
                  } p-4 flex flex-row gap-8 mb-4 rounded-xl border bg-white drop-shadow-md`}
                >
                  <img
                    src={comics.coverImage}
                    alt={comics.title}
                    className="w-16 h-16 object-cover rounded-xl m-2"
                  />
                  <div className="flex flex-col w-full gap-1 min-h-16 p-2 justify-center">
                    <h3 className="font-bold text-lg">{comics.title}</h3>
                    {comics?.edition !== "REGULAR" && (
                      <span className="rounded-2xl text-black text-xs font-light">
                        {comics?.edition === "SPECIAL"
                          ? "Bản đặc biệt"
                          : "Bản giới hạn"}
                      </span>
                    )}
                    <p className="text-gray-600 font-light text-md">
                      {comics.author}
                    </p>
                    <Collapse
                      size="small"
                      items={[
                        {
                          key: "1",
                          label: "Mô tả truyện tranh",
                          children: <p>{comics.description}</p>,
                        },
                      ]}
                    />
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <div className="w-full flex flex-row gap-4 mt-6 justify-end px-4">
          <button
            className=" py-2 border-none w-1/3 rounded-md text-white font-semibold hover:opacity-70 duration-200 bg-red-600"
            onClick={() => setIsConfirmingReject(true)}
          >
            TỪ CHỐI
          </button>
          <button
            className=" py-2 w-2/3 rounded-md text-white font-bold hover:opacity-70 duration-200 bg-green-600"
            onClick={() => setIsConfirmingAccept(true)}
          >
            CHẤP NHẬN
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
        </div>
      </div>
    </Modal>
  );
}
