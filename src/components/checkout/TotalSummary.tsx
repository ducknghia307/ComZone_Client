import React from "react";
import CurrencySplitter from "../../assistants/Spliter";

export default function TotalSummary({
  totalQuantity,
  totalPrice,
  totalDeliveryPrice,
  handleSubmit,
  isConfirmDisabled,
  navigate,
}: {
  totalQuantity: number;
  totalPrice: number;
  totalDeliveryPrice: number | undefined;
  handleSubmit: () => Promise<void>;
  isConfirmDisabled: boolean;
  navigate: any;
}) {
  return (
    <div className="flex flex-col items-start gap-2 w-full bg-white rounded-lg px-4 py-4 drop-shadow-lg">
      <div className="w-full flex flex-col gap-2 pb-2 border-b border-black">
        <div className="w-full flex items-center justify-between">
          <p className="text-xl font-bold">ĐƠN HÀNG</p>
          <button
            onClick={() => navigate("/cart")}
            className="text-sm text-sky-700 duration-100 hover:text-sky-800"
          >
            Thay đổi
          </button>
        </div>
        <p className="text-xs font-light">{totalQuantity} sản phẩm</p>
      </div>

      <div className="w-full flex flex-col gap-2 text-xs pb-2 border-b">
        <div className="w-full flex items-center justify-between">
          <p>Tổng tiền hàng:</p>
          <p>{CurrencySplitter(totalPrice)} đ</p>
        </div>

        <div className="w-full flex items-center justify-between">
          <p>Tổng tiền giao hàng:</p>
          <p>{CurrencySplitter(totalDeliveryPrice || 0)} đ</p>
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <p className="text-xs">Tổng tiền thanh toán:</p>
        <p className="font-semibold text-red-500">
          {CurrencySplitter(
            (totalDeliveryPrice && totalPrice + totalDeliveryPrice) ||
              totalPrice
          )}{" "}
          đ
        </p>
      </div>

      <div className="w-full flex flex-col gap-2 pt-4">
        <p className="text-[0.7em]">
          Nhấn "Đặt hàng" đồng nghĩa với việc bạn đã đồng ý với{" "}
          <a href="#" className="text-blue-500">
            Điều khoản của ComZone
          </a>
        </p>

        <button
          className="w-full py-2 font-bold text-white bg-gray-950 rounded-md border border-black duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:bg-gray-300 disabled:border-none disabled:hover:text-white"
          onClick={handleSubmit}
          disabled={isConfirmDisabled}
        >
          ĐẶT HÀNG
        </button>
      </div>
    </div>
  );
}
