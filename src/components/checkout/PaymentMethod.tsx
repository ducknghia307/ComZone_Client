import { useEffect, useState } from "react";
// import { BaseInterface } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import CurrencySplitter from "../../assistants/Spliter";
import { Modal } from "antd";
import ZaloPay from "../../assets/zalopay.png";
import VNPay from "../../assets/vnpay.png";
import TickCircle from "../../assets/tick-circle.png";

const PaymentMethod = ({
  amount,
  balance,
  onMethodSelect,
}: {
  amount: number;
  balance: number;
  onMethodSelect: (method: string) => void;
}) => {
  const [selectedMethod, setSelectedMethod] = useState("wallet");
  const [hideBalance, setHideBalance] = useState(true);
  const [selectedWalletMethod, setSelectedWalletMethod] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(amount);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setSelectedWalletMethod("");
    setSelectedAmount(0);
    setIsModalOpen(false);
  };

  useEffect(() => {
    onMethodSelect(selectedMethod);
  }, [selectedMethod]);
  const handlePayment = async () => {
    if (!selectedAmount) {
      return;
    }

    try {
      if (selectedWalletMethod === "ZaloPay") {
        const resWalletDes = await privateAxios.post("/wallet-deposits", {
          amount: selectedAmount,
        });
        const resZalopay = await privateAxios.post("/zalopay/checkout", {
          walletDeposit: resWalletDes.data.id,
        });
        console.log(resZalopay);
        window.location.href = resZalopay.data.orderurl;
      } else if (selectedWalletMethod === "VNPay") {
        const resWalletDes = await privateAxios.post("/wallet-deposits", {
          amount: selectedAmount,
        });
        const resVNpay = await privateAxios.post("/vnpay/checkout", {
          walletDeposit: resWalletDes.data.id,
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
    <div className="w-full bg-white px-8 py-4 flex flex-col rounded-lg">
      <h2 className="font-bold mb-4">PHƯƠNG THỨC THANH TOÁN</h2>

      {/* Option 1: Thanh Toán Bằng Ví Comzone */}
      <div
        className={`w-full px-10 py-4 mb-4 rounded-lg border h-28 ${
          selectedMethod === "wallet"
            ? "border-black border-2"
            : "border-gray-300 opacity-60 hover:opacity-100 hover:border-black cursor-pointer"
        } flex items-center justify-between duration-200`}
        onClick={() => setSelectedMethod("wallet")}
      >
        <div className="flex items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2 items-center">
              <img
                src="https://images-ext-1.discordapp.net/external/m1iq6Vi9sJIxPZYtk5n9CCfmi2A43Dbqt4RObJjKT7Y/https/cdn-icons-png.flaticon.com/512/6020/6020687.png?format=webp&quality=lossless&width=460&height=460"
                alt=""
                className="w-[2em] h-[2em]"
              />

              <p className="font-bold">THANH TOÁN BẰNG VÍ COMZONE</p>
              <span className="ml-2 py-1 px-2 bg-cyan-900 rounded-lg text-white text-xs whitespace-nowrap hidden xl:inline">
                Khuyên dùng
              </span>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <h3 className="text-sm text-gray-500 ml-12">
                Số dư ví:{" "}
                {hideBalance ? "******" : <>{CurrencySplitter(balance || 0)}</>}{" "}
                đ
              </h3>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="flex w-fit ml-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  className="fill-gray-600 hover:fill-black cursor-pointer"
                >
                  {hideBalance ? (
                    <path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path>
                  ) : (
                    <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                  )}
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                ></svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col xl:flex-row items-center justify-center xl:gap-2 text-right ${
            (!amount || balance >= amount || selectedMethod === "cod") &&
            "hidden"
          }`}
        >
          <p className="text-red-500 font-light text-xs">
            Số dư hiện không đủ.
          </p>
          <button
            className="text-sky-800 text-sm duration-200 hover:text-sky-600"
            onClick={showModal}
          >
            Nạp thêm
          </button>
          <Modal
            className="REM "
            open={isModalOpen}
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
                <div className="font-semibold">
                  {CurrencySplitter(balance)} đ
                </div>
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
                {[
                  20000, 50000, 100000, 200000, 500000, 1000000, 1500000,
                  2000000,
                ]
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
                    selectedMethod === "VNPay"
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
        </div>
      </div>

      {/* Option 2: Thanh Toán Khi Nhận Hàng */}
      <div
        className={`w-full px-10 py-4 rounded-lg border h-28 ${
          selectedMethod === "cod"
            ? "border-black border-2"
            : "border-gray-300 opacity-60 hover:opacity-100 hover:border-black cursor-pointer"
        } flex items-center duration-200`}
        onClick={() => setSelectedMethod("cod")}
      >
        <div className="flex items-center">
          <img
            src="https://images-ext-1.discordapp.net/external/8HO1TdE688wNSIPu1fBpZhwFmNdyGN_T5DHPy_KFu5w/https/cdn-icons-png.flaticon.com/512/5163/5163782.png?format=webp&quality=lossless&width=576&height=576"
            alt=""
            className="w-[2em] h-[2em]"
          />
          <h4 className="font-bold ml-2">THANH TOÁN KHI NHẬN HÀNG</h4>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
