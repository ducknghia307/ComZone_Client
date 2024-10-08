import React from "react";
import CurrencySplitter from "../assistants/Spliter";

interface TotalPriceProps {
  totalPrice: number;
}

const TotalPrice: React.FC<TotalPriceProps> = ({ totalPrice }) => {
  return (
    <div className="p-4 bg-white rounded-md">
      <div className="flex justify-between mb-4">
        <span>Thành tiền</span>
        <span>{CurrencySplitter(totalPrice)} đ</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Tổng Số Tiền</span>
        <span className="text-red-500">{CurrencySplitter(totalPrice)} đ</span>
      </div>
      <button className="w-full mt-4 py-2 bg-black text-white font-semibold rounded-md">
        THANH TOÁN
      </button>
    </div>
  );
};

export default TotalPrice;
