import React, { useEffect, useState } from "react";
import DeliveryAddress from "../components/checkout/DeliveryAddress";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderCheck from "../components/checkout/OrderCheck";
import {
  Address,
  // BaseInterface,
  Comic,
  // UserInfo,
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

const Checkout = () => {
  // const [userInfo, setUserInfo] = useState<UserInfo>();
  const [userWalletBalance, setUserWalletBalance] = useState<number>(0);
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

      // setUserInfo(data);

      setUserWalletBalance(Number(data.balance));
    } catch {
      console.log("...");
    }
  };

  // const fetchDeliveryDetails = async () => {
  //   try {
  //     const response = await privateAxios.post('/orders/delivery-details', {
  //       fromDistrict: selectedAddress?.district.id,
  //             })
  //   } catch (error) {
  //     console.log("Error to post delivery details:", error);
  //   }
  // }

  const comics = sessionStorage.getItem("selectedComics");
  useEffect(() => {
    if (comics) {
      setGroupedSelectedComics(JSON.parse(comics));
    }
    fetchUserInfo();
    // fetchUserWallet();
  }, []);
  console.log(groupedSelectedComics);

  const totalPrice = Object.values(groupedSelectedComics).reduce(
    (total, sellerGroup) => {
      return (
        total +
        sellerGroup.comics.reduce(
          (sellerTotal, { comic }) => Number(sellerTotal) + Number(comic.price),
          0
        )
      );
    },
    0
  );
  const totalQuantity = Object.values(groupedSelectedComics).reduce(
    (total, sellerGroup) =>
      total + sellerGroup.comics.reduce((sum) => sum + 1, 0),
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
      const orderedComicIds: string[] = [];
      for (const sellerId in groupedSelectedComics) {
        const sellerGroup = groupedSelectedComics[sellerId];
        console.log(sellerGroup);

        const sellerTotalPrice = sellerGroup.comics.reduce(
          (total, { comic }) => total + Number(comic.price),
          0
        );
        console.log("sellertotalprice:", sellerTotalPrice);

        const orderResponse = await privateAxios.post("/orders", {
          totalPrice: Number(sellerTotalPrice),
          paymentMethod: selectedPaymentMethod,
        });

        const orderId = orderResponse.data.id;

        for (const { comic } of sellerGroup.comics) {
          const orderItemPayload = {
            comics: comic.id,
            order: orderId,
          };

          console.log("Order Item Payload:", orderItemPayload);

          await privateAxios.post("/order-items", orderItemPayload);
          orderedComicIds.push(comic.id);
        }
        const resOrderDelivery = await privateAxios.post("/order-deliveries", {
          orderId: orderId,
          phone: selectedAddress?.phone,
          province: selectedAddress?.province,
          district: selectedAddress?.district,
          ward: selectedAddress?.ward,
          detailedAddress: selectedAddress?.detailedAddress,
        });
        console.log(resOrderDelivery.data);

        const resTransactions = await privateAxios.post("/transactions", {
          order: orderId,
          amount: sellerTotalPrice,
        });
        console.log(resTransactions.data);
        const resResult = await privateAxios.patch(
          `/transactions/post/${resTransactions.data.id}`
        );
        console.log(resResult.data);
      }
      console.log("All orders successfully created!");
      const storedCartData = localStorage.getItem("cart");
      if (storedCartData) {
        const parsedCartData = JSON.parse(storedCartData);
        const updatedCartData = parsedCartData.filter(
          (item: any) => !orderedComicIds.includes(item.comics.id)
        );
        localStorage.setItem("cart", JSON.stringify(updatedCartData));
      }

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
  useEffect(() => {
    console.log("a", selectedAddress);
  }, [selectedAddress]);
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
            {/* <DeliveryMethod /> */}
            <PaymentMethod
              onMethodSelect={handlePaymentMethodSelect}
              amount={totalPrice}
              balance={userWalletBalance}
            />
            <div className="flex flex-col items-center w-full bg-white rounded-b-lg">
              <div className="flex flex-row items-center justify-end w-full py-4 gap-2 border-t-2 pr-8 border-dashed">
                <h4 className="font-light">
                  Tổng số tiền ({totalQuantity} truyện):
                </h4>
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
