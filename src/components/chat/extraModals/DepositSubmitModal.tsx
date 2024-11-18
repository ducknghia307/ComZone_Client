import { Checkbox, Modal } from "antd";
import { useState } from "react";
import CurrencySplitter from "../../../assistants/Spliter";
import { privateAxios } from "../../../middleware/axiosInstance";
import { ExchangeRequest } from "../../../common/interfaces/exchange.interface";
import ActionConfirm from "../../actionConfirm/ActionConfirm";

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
  const [isConfirmingNotRequired, setIsConfirmingNotRequired] =
    useState<boolean>(false);
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

        <div className="font-light text-xs text-red-600 my-4">
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

        <div className="flex flex-col items-start gap-2 my-4">
          <p className="text-xl font-semibold">GIAO HÀNG & NHẬN HÀNG</p>
          <p className="font-light text-sm">
            Chúng tôi khuyến khích bạn sử dụng dịch vụ giao hàng của ComZone để
            tránh những điều không mong đợi xảy ra xuyên suốt quá trình trao đổi
            truyện của bạn.
          </p>

          <div className="w-full flex items-stretch justify-center gap-2 pt-4 pb-2">
            <button
              onClick={() => {
                setIsDeliveryRequired(true);
              }}
              className={`grow flex items-center justify-center gap-2 border ${
                isDeliveryRequired
                  ? "border-black border-2"
                  : "border-gray-300 opacity-50 hover:bg-gray-100"
              } px-4 py-4 rounded-lg duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M14.5998 8.00033H21C22.1046 8.00033 23 8.89576 23 10.0003V12.1047C23 12.3659 22.9488 12.6246 22.8494 12.8662L19.755 20.3811C19.6007 20.7558 19.2355 21.0003 18.8303 21.0003H2C1.44772 21.0003 1 20.5526 1 20.0003V10.0003C1 9.44804 1.44772 9.00033 2 9.00033H5.48184C5.80677 9.00033 6.11143 8.84246 6.29881 8.57701L11.7522 0.851355C11.8947 0.649486 12.1633 0.581978 12.3843 0.692483L14.1984 1.59951C15.25 2.12534 15.7931 3.31292 15.5031 4.45235L14.5998 8.00033ZM7 10.5878V19.0003H18.1606L21 12.1047V10.0003H14.5998C13.2951 10.0003 12.3398 8.77128 12.6616 7.50691L13.5649 3.95894C13.6229 3.73105 13.5143 3.49353 13.3039 3.38837L12.6428 3.0578L7.93275 9.73038C7.68285 10.0844 7.36341 10.3746 7 10.5878ZM5 11.0003H3V19.0003H5V11.0003Z"></path>
              </svg>
              <p>Áp dụng giao hàng</p>
            </button>
            <button
              onClick={() => setIsConfirmingNotRequired(true)}
              className={`grow flex items-center justify-center rounded-lg gap-2 border ${
                !isDeliveryRequired
                  ? "border-black border-2"
                  : "border-gray-300 text-gray-300"
              } px-4 py-4`}
            >
              <p className="text-xs font-light">Không áp dụng giao hàng</p>
            </button>
            <ActionConfirm
              isOpen={isConfirmingNotRequired}
              setIsOpen={setIsConfirmingNotRequired}
              title="Xác nhận không lựa chọn áp dụng giao hàng?"
              description={
                <p className="text-red-500 font-light text-xs">
                  Nếu không áp dụng giao hàng, ComZone sẽ hoàn toàn không chịu
                  trách nhiệm cho những sự cố xảy ra trong quá trình giao và
                  nhận truyện của bạn.
                </p>
              }
              confirmCallback={() => {
                setIsDeliveryRequired(false);
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 my-4">
          <Checkbox
            checked={confirmCheck}
            onChange={() => setConfirmCheck(!confirmCheck)}
          />
          <p className="font-light text-xs">
            Tôi đã hiểu cách thức hoạt động của quá trình cọc và giao hàng, nhận
            hàng của ComZone, và tôi đã xác nhận lựa chọn của mình.
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
