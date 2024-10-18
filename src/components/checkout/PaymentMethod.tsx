import { useEffect, useState } from "react";
import { BaseInterface } from "../../common/base.interface";
import axios from "axios";

interface Wallet extends BaseInterface {
  balance: number;
  nonWithdrawableAmount: number;
  status: number;
}

const PaymentMethod = (amount: { total: number }) => {
  const token = sessionStorage.getItem("accessToken");

  const [wallet, setWallet] = useState<Wallet>();
  const [selectedMethod, setSelectedMethod] = useState("wallet");
  const [hideBalance, setHideBalance] = useState(true);

  const fetchUserWallet = async () => {
    await axios
      .get("http://localhost:3000/wallets/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setWallet(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchUserWallet();
  }, []);

  return (
    <div className="w-full bg-white px-8 py-4 flex flex-col rounded-lg">
      <h2 className="font-bold mb-4">PHƯƠNG THỨC THANH TOÁN</h2>

      {/* Option 1: Thanh Toán Bằng Ví Comzone */}
      <div
        className={`w-full p-4 mb-4 rounded-lg border h-28 ${
          selectedMethod === "wallet"
            ? "border-black border-2"
            : "border-gray-300 hover:bg-gray-100 hover:border-black cursor-pointer"
        } flex items-center justify-between duration-200`}
        onClick={() => setSelectedMethod("wallet")}
      >
        <div className="flex items-center">
          <input
            type="radio"
            id="wallet"
            name="payment"
            checked={selectedMethod === "wallet"}
            onChange={() => setSelectedMethod("wallet")}
            className="mr-4"
          />
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1 items-center">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M12 14.0005L8 14M21 12V11.2C21 10.0799 21 9.51984 20.782 9.09202C20.5903 8.71569 20.2843 8.40973 19.908 8.21799C19.4802 8 18.9201 8 17.8 8H3M21 12V16M21 12H19C17.8954 12 17 12.8954 17 14C17 15.1046 17.8954 16 19 16H21M21 16V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8V8M18 8V7.2C18 6.0799 18 5.51984 17.782 5.09202C17.5903 4.71569 17.2843 4.40973 16.908 4.21799C16.4802 4 15.9201 4 14.8 4H6.2C5.07989 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.0799 3 7.2V8"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="font-bold">THANH TOÁN BẰNG VÍ COMZONE</p>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M6 9.5V14.5M18 9.5V14.5M3.11111 6H20.8889C21.5025 6 22 6.53726 22 7.2V16.8C22 17.4627 21.5025 18 20.8889 18H3.11111C2.49746 18 2 17.4627 2 16.8V7.2C2 6.53726 2.49746 6 3.11111 6ZM14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12Z"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-sm text-gray-500">
                Số dư ví: {hideBalance ? "******" : wallet?.balance} đ
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

        {/* Balance Error and Recharge Button */}
        <div
          className={`text-right ${
            (!amount.total || wallet?.balance! >= amount.total) && "hidden"
          }`}
        >
          <p className="text-red-500 font-thin mb-1">Số dư hiện không đủ</p>
          <button className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:opacity-75">
            NẠP TIỀN VÀO VÍ
          </button>
        </div>
      </div>

      {/* Option 2: Thanh Toán Khi Nhận Hàng */}
      <div
        className={`w-full p-4 rounded-lg border h-28 ${
          selectedMethod === "cod"
            ? "border-black border-2"
            : "border-gray-300 hover:bg-gray-100 hover:border-black cursor-pointer"
        } flex items-center duration-200`}
        onClick={() => setSelectedMethod("cod")}
      >
        <input
          type="radio"
          id="cod"
          name="payment"
          checked={selectedMethod === "cod"}
          onChange={() => setSelectedMethod("cod")}
          className="mr-4"
        />
        <div className="flex items-center">
          {/* Cash on Delivery Icon */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M12 14.0005L8 14M21 12V11.2C21 10.0799 21 9.51984 20.782 9.09202C20.5903 8.71569 20.2843 8.40973 19.908 8.21799C19.4802 8 18.9201 8 17.8 8H3M21 12V16M21 12H19C17.8954 12 17 12.8954 17 14C17 15.1046 17.8954 16 19 16H21M21 16V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8V8M18 8V7.2C18 6.0799 18 5.51984 17.782 5.09202C17.5903 4.71569 17.2843 4.40973 16.908 4.21799C16.4802 4 15.9201 4 14.8 4H6.2C5.07989 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.0799 3 7.2V8"
              stroke="#000000"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h4 className="font-bold">THANH TOÁN KHI NHẬN HÀNG</h4>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
