import React, { useEffect, useState } from "react";
import DeliveryAddress from "../components/checkout/DeliveryAddress";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderCheck from "../components/checkout/OrderCheck";
import {
  Address,
  BaseInterface,
  Comic,
  UserInfo,
} from "../common/base.interface";
import CurrencySplitter from "../assistants/Spliter";
import { privateAxios } from "../middleware/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "antd";
// import { privateAxios } from "../middleware/axiosInstance";
interface SellerGroup {
  sellerName: string;
  comics: { comic: Comic; quantity: number }[];
}

interface Wallet extends BaseInterface {
  balance: number;
  nonWithdrawableAmount: number;
  status: number;
}

const Checkout = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [userWallet, setUserWallet] = useState<Wallet | null>(null);
  const [groupedSelectedComics, setGroupedSelectedComics] = useState<
    Record<string, SellerGroup>
  >({});
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("wallet");
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const countDown = () => {
    let secondsToGo = 3;

    const instance = modal.success({
      title: "Đặt hàng thành công!",
      content: `Chuyển trang trong vòng ${secondsToGo} giây...`,
      okText: "Go to Order Completion",
      onOk: () => {
        navigate("/order/complete");
      },
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      instance.update({
        content: `Chuyển trang trong vòng ${secondsToGo} giây...`,
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
      navigate("/order/complete");
    }, secondsToGo * 1000);
  };

  const fetchUserInfo = async () => {
    try {
      const response = await privateAxios("/users/profile");
      const data = await response.data;

      setUserInfo(data);
    } catch {
      console.log("...");
    }
  };

  const fetchUserWallet = async () => {
    try {
      const response = await privateAxios("/wallets/user");
      const data = await response.data;
      setUserWallet(data); // Set user wallet
    } catch {
      console.log("...");
    }
  };

  const comics = sessionStorage.getItem("selectedComics");
  useEffect(() => {
    if (comics) {
      setGroupedSelectedComics(JSON.parse(comics));
    }
    fetchUserInfo();
    fetchUserWallet();
  }, []);

  const totalPrice = Object.values(groupedSelectedComics).reduce(
    (total, sellerGroup) => {
      return (
        total +
        sellerGroup.comics.reduce(
          (sellerTotal, { comic, quantity }) =>
            sellerTotal + comic.price * quantity,
          0
        )
      );
    },
    0
  );
  const totalQuantity = Object.values(groupedSelectedComics).reduce(
    (total, sellerGroup) =>
      total +
      sellerGroup.comics.reduce((sum, { quantity }) => sum + quantity, 0),
    0
  );
  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };
  const handleSubmit = async () => {
    console.log("Selected Comics by Seller:", groupedSelectedComics);
    console.log("Selected Address:", selectedAddress);
    console.log("Selected Payment Method:", selectedPaymentMethod);

    try {
      for (const sellerId in groupedSelectedComics) {
        const sellerGroup = groupedSelectedComics[sellerId];
        console.log(sellerGroup);

        const sellerTotalPrice = sellerGroup.comics.reduce(
          (total, { comic, quantity }) =>
            total + Number(comic.price) * Number(quantity),
          0
        );
        console.log(sellerTotalPrice);

        const orderResponse = await privateAxios.post("/orders", {
          seller: sellerId,
          buyer: userInfo?.id,
          total_price: sellerTotalPrice,
          order_type: "NON_AUCTION",
          payment_method: selectedPaymentMethod,
        });

        const orderId = orderResponse.data.id;

        for (const { comic, quantity } of sellerGroup.comics) {
          const orderItemPayload = {
            comics: comic.id,
            order: orderId,
            quantity: Number(quantity),
            price: Number(comic.price),
            total_price: Number(comic.price * quantity),
          };

          console.log("Order Item Payload:", orderItemPayload);

          await privateAxios.post("/order-items", orderItemPayload);
          const comicResponse = await privateAxios.get(`/comics/${comic.id}`);
          const currentComicData = comicResponse.data;

          const newQuantity = currentComicData.quantity - quantity;

          await privateAxios.put(`/comics/${comic.id}`, {
            quantity: newQuantity,
          });
          await privateAxios.delete(`/cart/comic/${comic.id}`);
          console.log(
            `Updated comic ${comic.id} with new quantity: ${newQuantity}`
          );
        }
        await privateAxios.patch("/wallets/pay", {
          amount: sellerTotalPrice,
        });
      }
      console.log("All orders successfully created!");
      sessionStorage.removeItem("selectedComics");
      countDown();
      // navigate("/order/complete");
    } catch (error: any) {
      if (error.response) {
        console.error("Server responded with:", error.response.data); // Log detailed server error
      } else {
        console.error("Error submitting order:", error);
      }
    }
  };

  return (
    <>
      <div className="w-full flex flex-col px-20 py-8 bg-neutral-100 REM">
        {comics ? (
          <>
            <DeliveryAddress
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
            <OrderCheck
              groupedSelectedComics={groupedSelectedComics}
              // totalPrice={totalPrice}
              // totalQuantity={totalQuantity}
            />
            <PaymentMethod
              onMethodSelect={handlePaymentMethodSelect}
              amount={totalPrice}
              wallet={userWallet}
            />
            <div className="flex flex-col items-center w-full bg-white rounded-b-lg">
              <div className="flex flex-row items-center justify-end w-full py-4 gap-2 border-t-2 pr-8 border-dashed">
                <h4 className="font-light">Tổng số tiền({totalQuantity}):</h4>
                <h4 className="font-semibold text-2xl text-cyan-900">
                  {CurrencySplitter(totalPrice)}đ
                </h4>
              </div>
              <div className="flex flex-row justify-between w-full px-8 items-center   py-4">
                <div className="flex">
                  <input type="checkbox" className="mr-2" />
                  <span>
                    Nhấn "Đặt hàng" đồng nghĩa với việc bạn đã đồng ý với{" "}
                    <a href="#" className="text-blue-500">
                      Điều khoản của ComZone
                    </a>
                  </span>
                </div>
                <button
                  className="px-8 py-2 font-bold text-white bg-black rounded-md duration-200 hover:opacity-80"
                  onClick={handleSubmit}
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full bg-white REM">
            <h2>Vui lòng quay lại và chọn 1 sản phẩm trong giỏ hàng!</h2>
            <Link to={"/cart"}>Quay lại</Link>
          </div>
        )}
      </div>
      {contextHolder}
    </>
  );
};

export default Checkout;
