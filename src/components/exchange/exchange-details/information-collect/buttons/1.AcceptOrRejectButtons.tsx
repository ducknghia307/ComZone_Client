import React, { useState } from "react";
import ActionConfirm from "../../../../actionConfirm/ActionConfirm";
import { privateAxios } from "../../../../../middleware/axiosInstance";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

export default function AcceptOrRejectButtons({
  exchangeId,
  fetchExchangeDetails,
}: {
  exchangeId: string;
  fetchExchangeDetails: Function;
}) {
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleConfirm = async (type: "accept" | "reject") => {
    await privateAxios
      .patch(`exchanges/${type}/${exchangeId}`)
      .then(() => {
        if (type === "accept") {
          fetchExchangeDetails();
          notification.success({
            key: "accept-success",
            message: "Yêu cầu đã được chấp nhận thành công.",
            description: (
              <p className="text-xs font-light REM">
                Bạn có thể bắt đầu thực hiện những thao tác còn lại để hoàn
                thành quá trình trao đổi truyện của mình.
              </p>
            ),
            duration: 8,
          });
        } else {
          navigate("/exchange/all");
          notification.info({
            key: "reject-info",
            message: "Bạn đã từ chối yêu cầu trao đổi này.",
            duration: 5,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex items-stretch gap-2">
      <button
        onClick={() => setIsRejecting(true)}
        className="basis-1/3 min-w-max py-2 rounded-lg bg-red-700 text-white hover:opacity-80 duration-200"
      >
        Từ chối
      </button>
      <ActionConfirm
        isOpen={isRejecting}
        setIsOpen={setIsRejecting}
        title="Xác nhận từ chối trao đổi?"
        description={
          <p className="text-xs text-red-600">
            Bạn có chắc chắn muốn từ chối yêu cầu trao đổi này không?
            <br />
            <span>Thao tác này không thể hoàn tác.</span>
          </p>
        }
        confirmCallback={() => handleConfirm("reject")}
      />

      <button
        onClick={() => setIsAccepting(true)}
        className="grow py-2 rounded-lg bg-green-600  text-white hover:opacity-80 duration-200"
      >
        Chấp nhận trao đổi
      </button>
      <ActionConfirm
        isOpen={isAccepting}
        setIsOpen={setIsAccepting}
        title="Xác nhận chấp nhận trao đổi?"
        description={
          <p className="text-xs">
            Bạn có chắc chắn muốn từ chối yêu cầu trao đổi này không?
            <br />
            <span className="text-red-600">
              Lưu ý: Sau khi chấp nhận, hệ thống sẽ tự động từ chốt tất cả những
              yêu cầu của bạn từ bài viết này.
            </span>
          </p>
        }
        confirmCallback={() => handleConfirm("accept")}
      />
    </div>
  );
}
