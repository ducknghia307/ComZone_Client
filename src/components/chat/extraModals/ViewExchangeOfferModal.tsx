import { Collapse, Modal, notification, Tooltip } from "antd";
import { ExchangeOffer } from "../../../common/interfaces/exchange-offer.interface";
import { Comic } from "../../../common/base.interface";
import styles from "../../exchange/style.module.css";
import { useState } from "react";
import ActionConfirm from "../../actionConfirm/ActionConfirm";
import { privateAxios } from "../../../middleware/axiosInstance";
export default function ViewExchangeOfferModal({
  isOpen,
  setIsOpen,
  userId,
  exchangeOffer,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  userId: string;
  exchangeOffer: ExchangeOffer | undefined;
}) {
  const [isConfirmingAccept, setIsConfirmingAccept] = useState<boolean>(false);
  const [isConfirmingReject, setIsConfirmingReject] = useState<boolean>(false);

  const isRequestUser = userId === exchangeOffer?.exchangeRequest.user.id;

  const handleAcceptOrReject = async (type: "accept" | "reject") => {
    await privateAxios
      .patch(
        `exchange-offers/status/${
          type === "accept" ? "accepted" : "rejected"
        }/${exchangeOffer?.id}`
      )
      .then((res) => {
        console.log(res.data);
        setIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Lỗi hệ thống",
          description: "Vui lòng thử lại sau!",
          duration: 5,
        });
      });
  };
  return (
    <Modal
      title={
        <>
          <p className="text-xl font-semibold px-2 pt-4">
            Danh sách truyện được yêu cầu{" "}
            <span className="font-light text-sm italic">
              (Tổng {exchangeOffer?.offerComics.length} truyện)
            </span>
          </p>
          <p
            className={`${
              isRequestUser && "hidden"
            } font-light italic  text-sm text-gray-700 mt-1 px-2`}
          >
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
        {isRequestUser && (
          <p className="px-2 py-2 font-light italic">
            Đây là truyện được{" "}
            <span className="font-semibold">{exchangeOffer?.user.name}</span> đề
            xuất trao đổi với truyện của bạn:
          </p>
        )}
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
                  } flex flex-row gap-2 mb-4 rounded-xl border`}
                >
                  <img
                    src={comics.coverImage}
                    alt={comics.title}
                    className="w-[5em] object-cover rounded-md m-1"
                  />
                  <div className="flex flex-col w-full gap-1 min-h-16 p-2 justify-center">
                    <p className="font-bold text-lg line-clamp-2 leading-5">
                      {comics.title}
                    </p>
                    <p className="text-gray-600 font-light text-md">
                      {comics.author}
                      <span className="flex items-center gap-8 text-[0.8rem] italic">
                        {comics.edition && (
                          <p>
                            Phiên bản{" "}
                            {comics.edition === "REGULAR"
                              ? "thường"
                              : comics.edition === "SPECIAL"
                              ? "đặc biệt"
                              : "giới hạn"}
                          </p>
                        )}
                        {comics.condition && (
                          <p>
                            Tình trạng:{" "}
                            {comics.condition === "SEALED"
                              ? "Nguyện seal"
                              : "Đã qua sử dụng"}
                          </p>
                        )}
                      </span>
                    </p>

                    <div className="font-light text-sky-700 text-xs cursor-default">
                      <Tooltip
                        title={
                          <p className="text-black text-xs font-light">
                            {comics.description}
                          </p>
                        }
                        trigger={"hover"}
                        placement="bottomRight"
                        color="white"
                        mouseLeaveDelay={0.5}
                      >
                        Xem mô tả
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>

        {exchangeOffer?.exchangeRequest.user.id === userId ? (
          <div className="w-full flex flex-row gap-4 mt-6 justify-end px-4">
            <button
              className=" py-2 border-none w-1/3 flex items-center justify-center gap-2 rounded-md text-white font-semibold bg-red-600 duration-200 hover:bg-red-700"
              onClick={() => setIsConfirmingReject(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="currentColor"
              >
                <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
              </svg>
              TỪ CHỐI
            </button>
            <button
              className=" py-2 w-2/3 flex items-center justify-center gap-2 rounded-md text-white font-bold bg-green-600 duration-200 hover:bg-green-800"
              onClick={() => setIsConfirmingAccept(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z"></path>
              </svg>
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
        ) : (
          <div className="w-full flex flex-row gap-4 mt-6 justify-end px-4">
            <button className="basis-1/3 flex items-center justify-center gap-2 py-2 rounded-md font-semibold border border-gray-400 duration-200 hover:border-black">
              <Tooltip
                title={
                  <p className="text-black">
                    Đây là khoản tiền bạn dùng để cân bằng giá trị cho truyện
                    của bạn để thực hiện trao đổi.
                    <br />
                    Bạn có thể trò chuyện và thương lượng với người trao đổi để
                    có được số tiền bù chính xác nhất.
                  </p>
                }
                color="white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z"></path>
                </svg>
              </Tooltip>
              CẬP NHẬT TIỀN BÙ
            </button>
            <button className="basis-2/3 flex items-center justify-center gap-2 py-2 rounded-md text-white font-bold bg-sky-600 duration-200 hover:bg-sky-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
              </svg>
              CHỈNH SỬA
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
