/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { useState } from "react";
import ActionConfirm from "../../../../actionConfirm/ActionConfirm";
import { privateAxios } from "../../../../../middleware/axiosInstance";
import { notification } from "antd";

export default function SuccessfulOrFailedButton({
  exchangeId,
  fetchExchangeDetails,
}: {
  exchangeId: string;
  fetchExchangeDetails: Function;
}) {
  const [isConfirmingFailed, setIsConfirmingFailed] = useState<boolean>(false);
  const [isConfirmingSuccessful, setIsConfirmingSuccessful] =
    useState<boolean>(false);

  const handleConfirmSuccessful = async () => {
    await privateAxios
      .patch(`exchange-confirmation/delivery/${exchangeId}`)
      .then(() => {
        fetchExchangeDetails();
        notification.success({
          key: "delivery-success",
          message: "Xác nhận nhận hàng thành công.",
          duration: 5,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleConfirmFailed = async () => {
    await privateAxios.patch(`exchange-confirmation/delivery/${exchangeId}`);
  };

  return (
    <div className="flex items-stretch gap-2">
      <button
        onClick={() => setIsConfirmingFailed(true)}
        className="basis-1/3 min-w-max py-2 rounded-lg text-red-600 border border-red-600 hover:bg-red-50 duration-200"
      >
        Gặp vấn đề khi nhận hàng
      </button>
      <ActionConfirm
        isOpen={isConfirmingFailed}
        setIsOpen={setIsConfirmingFailed}
        title="Bạn không nhận được hàng?"
        description={
          <p className="text-sm">
            Bằng việc xác nhận bạn không nhận được hàng, cuộc trao đổi này sẽ bị
            hủy bỏ và số tiền cọc sẽ được chuyển đều cho hai bên.
            <br />
            <span className="text-xs text-red-600">
              Thao tác này không thể hoàn tác.
            </span>
          </p>
        }
        confirmCallback={() => handleConfirmFailed()}
      />

      <button
        onClick={() => setIsConfirmingSuccessful(true)}
        className="grow py-2 rounded-lg bg-green-700  text-white hover:bg-green-800 duration-200"
      >
        Nhận hàng thành công
      </button>
      <ActionConfirm
        isOpen={isConfirmingSuccessful}
        setIsOpen={setIsConfirmingSuccessful}
        title="Xác nhận nhận hàng thành công?"
        description={
          <span className="text-xs text-red-600">
            Lưu ý: Bạn chỉ nên xác nhận đã nhận hàng thành công khi bạn không
            gặp bất kỳ vấn đề nào với truyện bạn nhận được.
          </span>
        }
        confirmCallback={() => handleConfirmSuccessful()}
      />
    </div>
  );
}
