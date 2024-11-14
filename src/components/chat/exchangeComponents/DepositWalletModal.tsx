import React, { Dispatch, SetStateAction, useState } from "react";
import CurrencySplitter from "../../../assistants/Spliter";
import { Modal } from "antd";
import TickCircle from "../../../assets/tick-circle.png";
import ZaloPay from "../../../assets/zalopay.png";
import VNPay from "../../../assets/vnpay.png";
import { privateAxios } from "../../../middleware/axiosInstance";
interface DepositModalProp {
  isDepositModal: boolean;
  setIsDepositModal: Dispatch<SetStateAction<boolean>>;
  balance: number;
  amount: number;
}

const DepositWalletModal: React.FC<DepositModalProp> = ({
  isDepositModal,
  setIsDepositModal,
  balance,
  amount,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedWalletMethod, setSelectedWalletMethod] = useState<string>("");
  const handleCancel = () => {
    setIsDepositModal(false);
  };
  const handleOk = () => {
    setIsDepositModal(false);
  };

  const handlePayment = async () => {
    if (!selectedAmount) {
      // Make sure an amount is selected
      return;
    }

    try {
      if (selectedWalletMethod === "ZaloPay") {
        const resWalletDes = await privateAxios.post("/wallet-deposits", {
          amount: selectedAmount,
        });
        const resTransactions = await privateAxios.post("/transactions", {
          walletDeposit: resWalletDes.data.id,
        });
        const resZalopay = await privateAxios.post("/zalopay/checkout", {
          transaction: resTransactions.data.id,
        });
        // const response = await privateAxios.post("/zalopay/checkout", {
        //   type: "DEPOSIT",
        // });
        console.log(resZalopay);
        window.location.href = resZalopay.data.orderurl;
      } else if (selectedWalletMethod === "VNPay") {
        const resWalletDes = await privateAxios.post("/wallet-deposits", {
          amount: selectedAmount,
        });
        const resTransactions = await privateAxios.post("/transactions", {
          walletDeposit: resWalletDes.data.id,
        });
        const resVNpay = await privateAxios.post("/vnpay/checkout", {
          transaction: resTransactions.data.id,
        });
        console.log(resVNpay);

        window.location.href = resVNpay.data.url;
      } else {
        console.error("No valid payment method selected");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <>
      <Modal
        className="REM "
        open={isDepositModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4 w-full text-center">
            NẠP TIỀN VÀO VÍ
          </h2>

          <div className="flex justify-between mb-4">
            <h3 className="text-base">Số dư hiện tại:</h3>
            <div className="font-semibold">{CurrencySplitter(balance)} đ</div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2 text-base">Nhập số tiền nạp:</h3>
            <input
              type="text"
              placeholder="Nhập số tiền nạp"
              className="w-full border p-2 rounded mb-2"
              value={CurrencySplitter(Number(selectedAmount)) || 0}
              onChange={(e) => {
                setSelectedAmount(
                  Number(e.target.value.replace(/[^0-9.-]+/g, ""))
                );
              }}
            />
            <p className="text-red-500 text-xs italic">
              Cần phải nạp thêm: {CurrencySplitter(amount - balance)} đ
            </p>
          </div>

          <div className="flex flex-wrap justify-start gap-2 mb-4 w-full max-w-lg mx-auto">
            {[20000, 50000, 100000, 200000, 500000, 1000000, 1500000, 2000000]
              .filter((value) => value >= Math.max(0, amount - balance))
              .map((value) => (
                <button
                  key={value}
                  className=" px-2 bg-white border border-gray-500 hover:bg-gray-200 duration-200 rounded text-black"
                  onClick={() => setSelectedAmount(value)}
                >
                  {CurrencySplitter(value)}
                </button>
              ))}
          </div>

          <h3 className="font-bold mb-2 mt-8">Chọn hình thức nạp:</h3>
          <div className="flex justify-center gap-4 mb-4">
            <button
              className={`relative p-2 rounded-lg border-2 ${
                selectedWalletMethod === "ZaloPay"
                  ? "border-black"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedWalletMethod("ZaloPay")}
            >
              <div className="flex items-center ">
                {selectedWalletMethod === "ZaloPay" && (
                  <img
                    src={TickCircle}
                    alt="tick"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6"
                  />
                )}
                <img
                  src={ZaloPay}
                  alt="ZaloPay"
                  className="w-auto h-8 cursor-pointer hover:opacity-80 duration-200"
                />
              </div>
            </button>

            <button
              className={`relative p-2 rounded-lg border-2 ${
                selectedWalletMethod === "VNPay"
                  ? "border-black"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedWalletMethod("VNPay")}
            >
              <div className="flex items-center ">
                {selectedWalletMethod === "VNPay" && (
                  <img
                    src={TickCircle}
                    alt="tick"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6"
                  />
                )}
                <img
                  src={VNPay}
                  alt="VNPay"
                  className="w-auto h-8 cursor-pointer hover:opacity-80 duration-200"
                />
              </div>
            </button>
          </div>
          <div className="w-full flex items-center justify-center mt-8">
            <button
              className="bg-black text-white py-2 px-8 rounded-lg font-bold hover:opacity-90"
              onClick={handlePayment}
            >
              TIẾN HÀNH THANH TOÁN
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DepositWalletModal;
