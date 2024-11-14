import { Checkbox, Modal } from "antd";
import { useState } from "react";
import CurrencySplitter from "../../../assistants/Spliter";
import { privateAxios } from "../../../middleware/axiosInstance";
import { ExchangeRequest } from "../../../common/interfaces/exchange-request.interface";

export default function DepositSubmitModal({
  isOpen,
  setIsOpen,
  exchangeRequest,
  handleAccept,
  setIsLoading,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  exchangeRequest: ExchangeRequest;
  handleAccept: Function;
  setIsLoading: Function;
}) {
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [isDeliveryRequired, setIsDeliveryRequired] = useState<boolean>(true);
  const [confirmCheck, setConfirmCheck] = useState<boolean>(false);

  const handleSubmitDeposit = async () => {
    setIsLoading(true);
    if (confirmCheck) {
      console.log(depositAmount);
      await privateAxios
        .patch(`exchange-requests/exchange-settings/${exchangeRequest.id}`, {
          depositAmount,
          isDeliveryRequired,
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }

    await handleAccept();
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setDepositAmount(0);
        setConfirmCheck(false);
        setIsOpen(false);
      }}
      maskClosable={false}
      footer={null}
      centered
    >
      <div className="flex flex-col items-stretch pt-4">
        <p className="text-xl font-semibold mb-4">TÙY CHỈNH CỌC</p>

        <p>Chọn số tiền cọc mà bạn muốn để thực hiện trao đổi:</p>
        <p className="text-[0.7em] font-light italic">
          Yêu cầu tiền cọc sẽ được gửi đến người thực hiện trao đổi với bạn với
          khoản tiền tương đương
        </p>

        <div className="relative">
          <input
            type="text"
            value={CurrencySplitter(depositAmount)}
            onChange={(e) => {
              if (e.target.value.length === 0) setDepositAmount(0);
              if (e.target.value.match("[0-9]+")) {
                const number = parseInt(e.target.value.replace(/,/g, ""));
                if (number < 0) setDepositAmount(0);
                if (number > 999999999) setDepositAmount(999999999);
                else setDepositAmount(number);
              }
            }}
            className="px-8 py-2 w-1/2 my-2 border border-gray-300 rounded-lg"
          />
          <span className="absolute top-1/2 left-3 translate-y-[-50%]">đ</span>
        </div>

        <div className="font-light text-xs text-red-600 mt-4">
          <p className="font-semibold pb-2">Lưu ý:</p>
          <ul className="list-disc px-8">
            <li>
              Số tiền cọc này sẽ phải đảm bảo được HOÀN TOÀN thiệt hại nếu có
              tình huống ngoài mong muốn xảy ra với truyện của bạn trong quá
              trình thực hiện trao đổi.
            </li>
            <li>
              Tiền cọc chỉ được đưa ra từ đầu ngay trước khi bắt đầu trao đổi.
              Mức cọc KHÔNG THỂ thay đổi từ khi quá trình trao đổi bắt đầu diễn
              ra cho đến khi kết thúc.
            </li>
            <li className="font-semibold">
              ComZone sẽ KHÔNG chịu trách nhiệm cho những sự cố xảy ra vì tiền
              cọc không đảm bảo.
            </li>
          </ul>
        </div>

        <div className="flex items-start gap-2 my-4">
          <Checkbox
            checked={confirmCheck}
            onChange={() => setConfirmCheck(!confirmCheck)}
          />
          <p className="font-light text-xs">
            Tôi đã hiểu cách thức hoạt động của quá trình cọc của ComZone, và
            tôi đã xác nhận quyết định cho mức cọc của mình.
          </p>
        </div>

        <div className="flex items-stretch gap-2 mt-4">
          <button
            disabled={!confirmCheck}
            onClick={() => handleSubmitDeposit()}
            className="basis-1/3 min-w-max text-xs border border-gray-300 p-2 rounded-lg duration-200 hover:bg-gray-100 disabled:opacity-50"
          >
            Tiếp tục mà không cần cọc
          </button>
          <button
            disabled={!confirmCheck || depositAmount === 0}
            onClick={() => handleSubmitDeposit()}
            className="grow min-w-max bg-green-600 text-white rounded-lg py-2 duration-200 hover:bg-green-800 disabled:bg-gray-300"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </Modal>
  );
}
