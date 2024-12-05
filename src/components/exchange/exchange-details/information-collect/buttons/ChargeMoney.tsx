import { useState } from "react";
import CurrencySplitter from "../../../../../assistants/Spliter";

export default function ChargeMoney({
  userBalance,
  total,
  paymentGateway,
  setPaymentGateway,
  amount,
  setAmount,
}: {
  userBalance: number;
  total: number;
  paymentGateway: "vnpay" | "zalopay";
  setPaymentGateway: React.Dispatch<React.SetStateAction<"vnpay" | "zalopay">>;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isHidingBalance, setIsHidingBalance] = useState<boolean>(true);

  return (
    <div className="w-full min-w-fit flex flex-col gap-4 mt-4">
      {userBalance && (
        <div className="px-4">
          {userBalance >= total ? (
            <div className="flex items-center gap-2">
              <p>Số dư sau thanh toán:</p>
              <p className="font-semibold">
                {isHidingBalance
                  ? "*********"
                  : `${CurrencySplitter(userBalance - total)} đ`}
              </p>
              <button onClick={() => setIsHidingBalance(!isHidingBalance)}>
                {isHidingBalance ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                    <path d="m2 2 20 20" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="uppercase text-lg font-semibold">Nạp tiền vào ví</p>

              {amount + userBalance < total && (
                <p className="text-red-500 italic">Số dư hiện tại không đủ.</p>
              )}

              {userBalance > 0 && (
                <div className="flex justify-start items-center gap-4">
                  <h3 className="text-sm">Số dư hiện tại:</h3>
                  <div className="font-semibold">
                    {isHidingBalance
                      ? "*********"
                      : `${CurrencySplitter(userBalance)} đ`}
                  </div>

                  <button onClick={() => setIsHidingBalance(!isHidingBalance)}>
                    {isHidingBalance ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                        <path d="m2 2 20 20" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-light text-sm mb-2">Nhập số tiền nạp:</h3>
                <input
                  type="text"
                  placeholder="Nhập số tiền nạp"
                  className="w-full border p-2 rounded mb-2"
                  value={CurrencySplitter(Number(amount)) || 0}
                  onChange={(e) => {
                    if (
                      /^[0-9]*$/.test(
                        e.target.value.replace(/[^0-9.-]+/g, "")
                      ) &&
                      e.target.value.replace(/[^0-9.-]+/g, "").length < 10
                    )
                      setAmount(
                        Number(e.target.value.replace(/[^0-9.-]+/g, ""))
                      );
                  }}
                />
                {amount + userBalance < total && (
                  <p className="text-red-500 text-xs italic">
                    Cần phải nạp thêm: {CurrencySplitter(total - userBalance)} đ
                  </p>
                )}
              </div>

              <div className="grid grid-cols-4 justify-start gap-2 mb-4 w-full max-w-lg mx-auto">
                {[
                  20000, 50000, 100000, 200000, 500000, 1000000, 1500000,
                  2000000,
                ].map((value) => (
                  <button
                    key={value}
                    className=" px-2 bg-white border border-gray-500 hover:bg-gray-200 duration-200 rounded text-black"
                    onClick={() => setAmount(amount + value)}
                  >
                    {CurrencySplitter(value)}
                  </button>
                ))}
              </div>

              <p>Chọn cổng thanh toán:</p>
              <div className="flex items-stretch gap-2">
                <button
                  onClick={() => setPaymentGateway("zalopay")}
                  className={`grow flex items-center gap-2 ${
                    paymentGateway === "zalopay"
                      ? "bg-gray-900 text-white font-semibold"
                      : "border border-gray-400 hover:bg-gray-100"
                  } p-2 rounded-md duration-200`}
                >
                  <img
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
                    alt=""
                    className="w-[3em] h-[3em]"
                  />
                  Nạp qua ZALOPAY
                </button>
                <button
                  onClick={() => setPaymentGateway("vnpay")}
                  className={`grow flex items-center gap-2 ${
                    paymentGateway === "vnpay"
                      ? "bg-gray-900 text-white font-semibold"
                      : "border border-gray-400 hover:bg-gray-100"
                  } p-2 rounded-md duration-200`}
                >
                  <img
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                    alt=""
                    className="w-[3em] h-[3em]"
                  />
                  Nạp qua VNPAY
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
