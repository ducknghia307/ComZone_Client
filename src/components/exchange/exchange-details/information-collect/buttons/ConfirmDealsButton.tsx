/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { useState } from "react";
import ActionConfirm from "../../../../actionConfirm/ActionConfirm";
import { privateAxios } from "../../../../../middleware/axiosInstance";
import { notification } from "antd";
import { ExchangeDetails } from "../../../../../common/interfaces/exchange.interface";

export default function ConfirmDealsButton({
  exchangeDetail,
  fetchExchangeDetails,
}: {
  exchangeDetail: ExchangeDetails;
  fetchExchangeDetails: Function;
}) {
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);

  const handleConfirm = async (type: "accept" | "reject") => {
    try {
      if (type === "accept") {
        await privateAxios.post("exchange-confirmation/dealing", {
          exchangeId: exchangeDetail.exchange.id,
          compensationAmount: exchangeDetail.exchange.compensationAmount,
          depositAmount: exchangeDetail.exchange.depositAmount,
        });

        notification.success({
          message: "Thành công",
          description: "Mức tiền đã được chấp nhận thành công.",
          duration: 5,
        });
      } else if (type === "reject") {
        await privateAxios.patch(
          `exchange-confirmation/reject/deals/${exchangeDetail.exchange.id}`
        );

        notification.info({
          message: "Đã từ chối",
          description: `Mức tiền đã bị từ chối.\nBạn có thể thử giao tiếp với nhau để thống nhất được mức tiền vừa ý cho cả hai bên.`,
          duration: 8,
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại.",
        duration: 5,
      });
    } finally {
      fetchExchangeDetails();
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
        title="Xác nhận từ chối mức tiền?"
        description={
          <p className="text-xs text-red-600">
            Bạn có chắc chắn muốn từ chối mức tiền này không?
            <br />
            <span>Thao tác này không thể hoàn tác.</span>
          </p>
        }
        confirmCallback={() => handleConfirm("reject")}
      />

      <button
        onClick={() => setIsAccepting(true)}
        className="grow py-2 rounded-lg bg-green-700 text-white hover:bg-green-900 duration-200"
      >
        Chấp nhận mức tiền
      </button>
      <ActionConfirm
        isOpen={isAccepting}
        setIsOpen={setIsAccepting}
        title="Xác nhận mức tiền này?"
        description={
          <p className="text-xs">
            Bạn có chắc chắn muốn xác nhận mức tiền này không?
            <br />
            Mức tiền sẽ không thể thay đổi sau khi được xác nhận.
          </p>
        }
        confirmCallback={() => handleConfirm("accept")}
      />
    </div>
  );
}
