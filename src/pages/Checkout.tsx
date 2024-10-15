import React from "react";
import DeliveryAddress from "../components/checkout/DeliveryAddress";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderCheck from "../components/checkout/OrderCheck";

const Checkout = () => {
  return (
    <div className="w-full flex flex-col px-20 py-8 bg-neutral-100 REM gap-6">
      <DeliveryAddress />
      <PaymentMethod />
      <OrderCheck />
      <div className="flex flex-row justify-between w-full px-8 items-center">
        <div className="flex">
          <input type="checkbox" className="mr-2" />
          <span>
            Bằng việc tiến hành Mua hàng, Bạn đã đồng ý với{" "}
            <a href="#" className="text-blue-500">
              Điều khoản & Điều kiện của ComZone
            </a>
          </span>
        </div>
        <button className="px-8 py-2 font-bold text-white bg-black rounded-md">
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  );
};

export default Checkout;
