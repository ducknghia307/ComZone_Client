import { Avatar, Modal } from "antd";
import { useState } from "react";
import { RefundRequest } from "../../../../../common/interfaces/refund-request.interface";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../../redux/hooks";

export default function ViewRefundButton({
  refundRequest,
  requestsList,
}: {
  refundRequest: RefundRequest | undefined;
  requestsList: RefundRequest[];
}) {
  const { userId } = useAppSelector((state) => state.auth);

  const [isViewingRequest, setIsViewingRequest] = useState<boolean>(false);
  const [isViewingViolation, setIsViewingViolation] = useState<boolean>(false);

  const navigate = useNavigate();

  const displayStatus = () => {
    if (refundRequest)
      switch (refundRequest.status) {
        case "PENDING":
          return {
            status: (
              <span className="p-2 rounded-md border border-gray-300">
                Đang được phê duyệt
              </span>
            ),
            tilte: (
              <p className="font-light italic">
                Yêu cầu đền bù của bạn đang được phê duyệt...
              </p>
            ),
          };
        case "APPROVED":
          return {
            status: (
              <div className="flex items-center gap-4">
                <span className="p-2 rounded-md bg-green-700 text-white">
                  Đã được chấp thuận
                </span>
                <button
                  onClick={() => {
                    setIsViewingRequest(false);
                    navigate("/accountmanagement/wallet");
                  }}
                  className="text-sm font-light underline text-sky-700"
                >
                  Kiểm tra số dư & giao dịch
                </button>
              </div>
            ),
            tilte: (
              <p className="text-green-700">
                Yêu cầu đền bù trao đổi của bạn đã được chấp thuận.
              </p>
            ),
          };
        case "REJECTED":
          return {
            status: (
              <div>
                <span className="p-2 rounded-md bg-red-700 text-white">
                  Đã bị từ chối
                </span>
                <p>
                  Lí do từ chối:{" "}
                  {refundRequest.rejectedReason || "Không có lí do."}
                </p>
              </div>
            ),
            tilte: (
              <p className="text-red-700">
                Yêu cầu đền bù trao đổi của bạn đã bị từ chối.
              </p>
            ),
          };
      }
  };

  if (requestsList.length === 0) return;

  if (!refundRequest) {
    const otherRequest = requestsList.find((req) => !req.mine);
    if (!otherRequest) return;

    if (otherRequest.status === "PENDING")
      return (
        <div className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-md">
          XEM
        </div>
      );
    else if (otherRequest.status === "APPROVED") {
      return (
        <>
          <button
            onClick={() => setIsViewingViolation(true)}
            className="w-full flex items-center justify-center gap-2 py-2 border border-red-600 rounded-md duration-200 hover:opacity-80"
          >
            <p className="text-red-600">Bạn đã vi phạm trao đổi truyện.</p>
            <p className="text-sm font-light italic text-gray-500">
              Nhấn vào đây để tìm hiểu thêm.
            </p>
          </button>

          <Modal
            open={isViewingViolation}
            onCancel={(e) => {
              e.stopPropagation();
              setIsViewingViolation(false);
            }}
            footer={null}
            centered
            width={window.innerWidth * 0.4}
          >
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold uppercase py-4">
                VI PHẠM TRAO ĐỔI
              </p>
              <p className="text-red-600">
                Hệ thống ghi nhận bạn đã vi phạm trong trao đổi này.
              </p>

              <p>
                Vấn đề:{" "}
                <span className="font-semibold">{otherRequest.reason}</span>
              </p>

              <div>
                <p className="uppercase font-semibold">
                  Hệ thống đã tiến hành:
                </p>
                <ul className="pl-8 list-disc">
                  <li>
                    Giữ lại tiền cọc của bạn để đền bù cho{" "}
                    <span className="font-semibold">
                      <Avatar src={otherRequest.user.avatar} />
                      &ensp;
                      {otherRequest.user.name}
                    </span>
                  </li>
                  {otherRequest.exchange.compensateUser?.id === userId && (
                    <li>Hoàn lại tiền bù của cuộc trao đổi này cho bạn.</li>
                  )}
                  <button
                    onClick={() => {
                      setIsViewingRequest(false);
                      navigate("/accountmanagement/wallet");
                    }}
                    className="text-sky-700 underline hover:text-sky-900 font-light pt-2"
                  >
                    Kiểm tra số dư & giao dịch
                  </button>
                </ul>
              </div>
            </div>
          </Modal>
        </>
      );
    }
  } else
    return (
      <div className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-md">
        {displayStatus() && displayStatus()?.tilte}

        <button
          onClick={() => setIsViewingRequest(true)}
          className="text-sky-700 underline text-sm"
        >
          Xem
        </button>

        <Modal
          open={isViewingRequest}
          onCancel={(e) => {
            e.stopPropagation();
            setIsViewingRequest(false);
          }}
          footer={null}
          centered
          width={window.innerWidth * 0.4}
        >
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold uppercase py-4">
              Yêu cầu đền bù trao đổi
            </p>

            <p className="border-b py-2">
              Lí do:{" "}
              <span className="font-semibold">{refundRequest.reason}</span>
            </p>

            <p className="border-b py-2">
              Mô tả: <p>{refundRequest.description}</p>
            </p>

            <div className="flex items-center gap-2">
              <p>Tình trạng phê duyệt: </p>
              {displayStatus() && displayStatus()?.status}
            </div>

            {refundRequest.attachedImages &&
              refundRequest.attachedImages?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p>Ảnh đính kèm:</p>
                  <div className="flex items-center justify-start gap-1">
                    {refundRequest.attachedImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        className="rounded-lg w-[10em] h-[15em] object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

            <div className="py-2">
              <p className="font-semibold">Lưu ý:</p>
              <ul className="list-disc pl-4">
                <li>
                  Yêu cầu của bạn sẽ được hệ thống phê duyệt sau không quá 72
                  giờ.
                </li>
                <li>
                  Trong trường hợp hệ thống ghi nhận bạn cũng không gửi đi
                  truyện thỏa đáng thì hệ thống sẽ cân nhắc đền tiền cho một bên
                  xứng đáng hơn hoặc không thực hiện đền cho bên nào.
                </li>
                <li>Phí giao hàng sẽ không được hoàn trả.</li>
              </ul>
            </div>

            <button
              onClick={() => setIsViewingRequest(false)}
              className="ml-auto py-1 px-4 border border-gray-300 rounded-md hover:underline"
            >
              Đóng
            </button>
          </div>
        </Modal>
      </div>
    );
}
