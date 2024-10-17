import React, { useState } from "react";

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState("comzone");

  return (
    <div className="w-full bg-white px-8 py-4 flex flex-col rounded-lg">
      <h2 className="font-bold mb-4">PHƯƠNG THỨC THANH TOÁN</h2>

      {/* Option 1: Thanh Toán Bằng Ví Comzone */}
      <div
        className={`w-full p-4 mb-4 rounded-lg border h-28 ${
          selectedMethod === "comzone"
            ? "border-black border-2"
            : "border-gray-300"
        } flex items-center justify-between`}
        onClick={() => setSelectedMethod("comzone")}
      >
        <div className="flex items-center">
          <input
            type="radio"
            id="comzone"
            name="payment"
            checked={selectedMethod === "comzone"}
            onChange={() => setSelectedMethod("comzone")}
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
              <h3 className="text-sm text-gray-500">Số dư ví: ******đ</h3>
            </div>
          </div>
        </div>

        {/* Balance Error and Recharge Button */}
        <div className="text-right">
          <p className="text-red-500 font-thin mb-1">Số dư hiện không đủ</p>
          <button className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:opacity-75">
            NẠP TIỀN VÀO VÍ
          </button>
        </div>
      </div>

      {/* Option 2: Thanh Toán Khi Nhận Hàng */}
      <div
        className={`w-full p-4 rounded-lg border h-28 ${
          selectedMethod === "cod" ? "border-black border-2" : "border-gray-300"
        } flex items-center`}
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
