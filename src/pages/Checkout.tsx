import React, { useEffect, useState } from "react";
import DeliveryAddress from "../components/checkout/DeliveryAddress";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderCheck from "../components/checkout/OrderCheck";

const Checkout = () => {
  const [selectedComics, setSelectedComics] = useState([]);

  useEffect(() => {
    const comics = sessionStorage.getItem("selectedComics");
    if (comics) {
      setSelectedComics(JSON.parse(comics));
    }
  }, []);

  // Calculate the total price based on selected comics and their quantities
  const totalPrice = selectedComics.reduce((total, comic) => {
    return total + comic.price * comic.quantity; // Assuming comic.price exists
  }, 0);

  return (
    <div className="w-full flex flex-col px-20 py-8 bg-neutral-100 REM gap-6">
      <DeliveryAddress />
      <PaymentMethod />
      <OrderCheck selectedComics={selectedComics} totalPrice={totalPrice} />
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
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
};

export default Checkout;
