import { Checkbox, message } from "antd";
import { useState } from "react";
import CurrencySplitter from "../../../../assistants/Spliter";
import ActionConfirm from "../../../actionConfirm/ActionConfirm";
import { privateAxios } from "../../../../middleware/axiosInstance";

export default function SubmitAmounts({
  exchangeId,
  fetchExchangeDetails,
}: {
  exchangeId: string;
  fetchExchangeDetails: Function;
}) {
  const [compensationAmount, setCompensationAmount] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);

  const [confirmCheck, setConfirmCheck] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleSubmit = async () => {
    await privateAxios
      .post("exchange-confirmation/dealing", {
        exchangeId,
        compensationAmount,
        depositAmount,
      })
      .then(() => {
        fetchExchangeDetails();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full flex flex-col items-stretch">
      <div className="flex items-start gap-8">
        <div className="basis-1/2">
          <p className="text-sm font-semibold pb-[2.5em]">Mức tiền cọc:</p>

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
              className="px-8 py-2 w-full my-2 border border-gray-300 rounded-lg"
            />
            <span className="absolute top-1/2 left-3 translate-y-[-50%]">
              đ
            </span>
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
                Mức cọc KHÔNG THỂ thay đổi từ khi quá trình trao đổi bắt đầu
                diễn ra cho đến khi kết thúc.
              </li>
              <li className="font-semibold">
                ComZone sẽ KHÔNG chịu trách nhiệm cho những sự cố xảy ra vì tiền
                cọc không đảm bảo.
              </li>
            </ul>
          </div>
        </div>

        <div className="basis-1/2">
          <p className="text-sm font-semibold">
            Mức tiền bù:
            <p className="text-xs font-light italic">
              Bạn có thể đưa ra một mức tiền để ĐƯỢC bù lại cho chênh lệch giá
              trị của cuộc trao đổi.
              <p className="text-red-500">*Bạn không thể trả tiền để bù.</p>
            </p>
          </p>

          <div className="relative">
            <input
              type="text"
              value={CurrencySplitter(compensationAmount)}
              onChange={(e) => {
                if (e.target.value.length === 0) setCompensationAmount(0);
                if (e.target.value.match("[0-9]+")) {
                  const number = parseInt(e.target.value.replace(/,/g, ""));
                  if (number < 0) setCompensationAmount(0);
                  if (number > 999999999) setCompensationAmount(999999999);
                  else setCompensationAmount(number);
                }
              }}
              className="px-8 py-2 w-full my-2 border border-gray-300 rounded-lg"
            />
            <span className="absolute top-1/2 left-3 translate-y-[-50%]">
              đ
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 my-4">
        <p className="text-sm font-semibold">GIAO HÀNG & NHẬN HÀNG</p>
        <div className="flex items-center gap-2 px-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M14.5998 8.00033H21C22.1046 8.00033 23 8.89576 23 10.0003V12.1047C23 12.3659 22.9488 12.6246 22.8494 12.8662L19.755 20.3811C19.6007 20.7558 19.2355 21.0003 18.8303 21.0003H2C1.44772 21.0003 1 20.5526 1 20.0003V10.0003C1 9.44804 1.44772 9.00033 2 9.00033H5.48184C5.80677 9.00033 6.11143 8.84246 6.29881 8.57701L11.7522 0.851355C11.8947 0.649486 12.1633 0.581978 12.3843 0.692483L14.1984 1.59951C15.25 2.12534 15.7931 3.31292 15.5031 4.45235L14.5998 8.00033ZM7 10.5878V19.0003H18.1606L21 12.1047V10.0003H14.5998C13.2951 10.0003 12.3398 8.77128 12.6616 7.50691L13.5649 3.95894C13.6229 3.73105 13.5143 3.49353 13.3039 3.38837L12.6428 3.0578L7.93275 9.73038C7.68285 10.0844 7.36341 10.3746 7 10.5878ZM5 11.0003H3V19.0003H5V11.0003Z"></path>
          </svg>
          <p className="font-light text-sm">
            Chúng tôi đã áp dụng{" "}
            <span className="font-semibold">Dịch vụ Giao hàng của ComZone</span>{" "}
            để bảo đảm an toàn cho xuyên suốt quá trình trao đổi truyện của bạn.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 my-4">
        <Checkbox
          checked={confirmCheck}
          onChange={() => setConfirmCheck(!confirmCheck)}
        />
        <p className="font-light text-xs">
          Tôi đã hiểu cách thức hoạt động của quá trình bù tiền, cọc tiền và
          giao hàng, nhận hàng của ComZone, và tôi đã xác nhận lựa chọn của
          mình.
        </p>
      </div>

      <button
        disabled={!confirmCheck}
        onClick={() => {
          if (depositAmount < 10000)
            message.warning("Số tiền cọc không thể ít hơn 10,000đ!", 5);
          else setIsConfirming(true);
        }}
        className="basis-1/3 min-w-max py-2 rounded-lg bg-sky-700 text-white hover:opacity-90 duration-200 disabled:bg-gray-300"
      >
        HOÀN TẤT
      </button>
      <ActionConfirm
        isOpen={isConfirming}
        setIsOpen={setIsConfirming}
        title="Xác nhận toàn bộ thông tin?"
        description={
          <p className="text-xs">
            Bạn đã chắn chắn với những thông tin trên?
            <br />
            <span className="text-red-600">
              Lưu ý: Sau khi hoàn tất, số tiền cọc không thể được thay đổi.
            </span>
          </p>
        }
        confirmCallback={() => handleSubmit()}
      />
    </div>
  );
}
