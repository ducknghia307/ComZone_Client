import React, { useState } from "react";
import ActionConfirm from "../../../../actionConfirm/ActionConfirm";
import { privateAxios } from "../../../../../middleware/axiosInstance";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { ExchangeDetails } from "../../../../../common/interfaces/exchange.interface";

export default function ConfirmActionButton({
  exchangeDetail,
  fetchExchangeDetails,
}: {
  exchangeDetail: ExchangeDetails;
  fetchExchangeDetails: Function;
}) {
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleConfirm = async (type: "accept" | "reject") => {
    try {
      if (type === "accept") {
        const resDealing = await privateAxios.post(
          "/exchange-confirmation/dealing",
          {
            exchangeId: exchangeDetail.exchange.id,
            compensationAmount: exchangeDetail.exchange.compensationAmount,
            depositAmount: exchangeDetail.exchange.depositAmount,
          }
        );
        console.log(resDealing);

        notification.success({
          message: "Thành công",
          description: "Thương lượng đã được chấp nhận.",
        });
        fetchExchangeDetails();
      } else if (type === "reject") {
        await privateAxios.post("/exchange-confirmation/reject", {
          exchangeId: exchangeDetail.exchange.id,
        });
        notification.warning({
          message: "Đã từ chối",
          description: "Thương lượng đã bị từ chối.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại.",
      });
    }
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
        title="Xác nhận từ chối thương lượn?"
        description={
          <p className="text-xs text-red-600">
            Bạn có chắc chắn muốn từ chối thương lượng này không?
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
        Chấp nhận mức tiền
      </button>
      <ActionConfirm
        isOpen={isAccepting}
        setIsOpen={setIsAccepting}
        title="Xác nhận thương lượng"
        description={
          <p className="text-xs">
            Bạn có chắc chắn muốn từ chối thương lượng này không?
            <br />
            <span className="text-red-600">
              Lưu ý: Sau khi chấp nhận, hệ thống sẽ ghi nhận từ chối thương
              lượng của bạn.
            </span>
          </p>
        }
        confirmCallback={() => handleConfirm("accept")}
      />
    </div>
  );
}
