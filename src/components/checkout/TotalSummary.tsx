import { useState } from "react";
import CurrencySplitter from "../../assistants/Spliter";
import ActionConfirm from "../actionConfirm/ActionConfirm";

export default function TotalSummary({
  totalQuantity,
  totalPrice,
  totalDeliveryPrice,
  handleSubmit,
  isConfirmDisabled,
  navigate,
  depositAmount,
}: {
  totalQuantity: number;
  totalPrice: number;
  totalDeliveryPrice: number | undefined;
  handleSubmit: () => Promise<void>;
  isConfirmDisabled: boolean;
  navigate: any;
  depositAmount?: number;
}) {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-start gap-2 w-full bg-white rounded-lg px-4 py-4 drop-shadow-lg">
      <div className="w-full flex flex-col gap-2 pb-2 border-b border-black">
        <div className="w-full flex items-end justify-between">
          <p className="text-xl font-bold">ĐƠN HÀNG</p>
          <button
            onClick={() => navigate("/cart")}
            className="text-xs text-sky-700 underline hover:opacity-70"
          >
            Quay lại giỏ hàng
          </button>
        </div>
        <p className="text-xs font-light">{totalQuantity} sản phẩm</p>
      </div>

      <div className="w-full flex flex-col gap-2 text-xs pb-2 border-b">
        <div className="w-full flex items-center justify-between">
          <p>Tổng tiền hàng:</p>
          <p>{CurrencySplitter(totalPrice)} &#8363;</p>
        </div>

        <div className="w-full flex items-center justify-between">
          <p>Tổng tiền giao hàng:</p>
          <p>{CurrencySplitter(totalDeliveryPrice || 0)} &#8363;</p>
        </div>

        {depositAmount && (
          <div className="w-full flex items-center justify-between">
            <p>Tổng cọc đấu giá:</p>
            <p>- {CurrencySplitter(depositAmount || 0)} &#8363;</p>
          </div>
        )}

        {/* Calculate the remaining or refundable amount */}
        {depositAmount >= totalPrice + totalDeliveryPrice ? (
          <div className="w-full flex flex-col gap-1 text-green-600">
            <div className="w-full flex items-center justify-between">
              <p>Số tiền dư hoàn lại:</p>
              <p>
                {CurrencySplitter(
                  depositAmount - totalPrice - totalDeliveryPrice
                )}{" "}
                &#8363;
              </p>
            </div>
          </div>
        ) : (
          depositAmount && (
            <div className="w-full flex items-center justify-between text-black">
              <p>Tổng tiền thanh toán:</p>
              <p>
                {CurrencySplitter(
                  totalPrice + totalDeliveryPrice - (depositAmount || 0)
                )}{" "}
                &#8363;
              </p>
            </div>
          )
        )}
      </div>

      <div className="w-full flex items-center justify-between">
        <p className="text-xs">Tổng tiền thanh toán:</p>
        <p
          className={`font-semibold text-red-500
          }`}
        >
          {CurrencySplitter(
            Math.max(
              (totalDeliveryPrice &&
                totalPrice + totalDeliveryPrice - depositAmount) ||
                totalPrice,
              0
            )
          )}{" "}
          &#8363;
        </p>
      </div>

      {/* Nếu có dư tiền cọc, hiển thị thêm thông báo */}
      {depositAmount > totalPrice + totalDeliveryPrice && (
        <div className="text-xs text-gray-500">
          Số tiền dư sẽ được hoàn lại vào ví của bạn sau khi đơn hàng hoàn
          thành.
        </div>
      )}

      <div className="w-full flex flex-col gap-2 pt-4">
        <p className="text-[0.7em]">
          Nhấn "Đặt hàng" đồng nghĩa với việc bạn đã đồng ý với{" "}
          <a href="#" className="text-blue-500">
            Điều khoản của ComZone
          </a>
        </p>

        <button
          className="w-full py-2 font-bold text-white bg-gray-950 rounded-md border border-black duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:bg-gray-300 disabled:border-none disabled:hover:text-white"
          onClick={() => setIsConfirming(true)}
          disabled={isConfirmDisabled}
        >
          ĐẶT HÀNG
        </button>

        <ActionConfirm
          isOpen={isConfirming}
          setIsOpen={setIsConfirming}
          title="XÁC NHẬN ĐẶT HÀNG"
          description={
            <p className="text-sm">
              Bạn sẽ nhận thông báo khi người bán xác nhận đơn hàng của bạn.
            </p>
          }
          confirmCallback={() => handleSubmit()}
        />
      </div>
    </div>
  );
}
