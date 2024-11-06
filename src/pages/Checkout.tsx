import React, { useEffect, useState } from "react";
import DeliveryAddress from "../components/checkout/DeliveryAddress";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderCheck from "../components/checkout/OrderCheck";
import {
  Address,
  // BaseInterface,
  Comic,
  SellerDetails,
  UserInfo,
  // UserInfo,
} from "../common/base.interface";
import { privateAxios } from "../middleware/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import TotalSummary from "../components/checkout/TotalSummary";
import Loading from "../components/loading/Loading";

interface SellerGroup {
  sellerName: string;
  comics: { comic: Comic; quantity: number }[];
  delivery?: {
    cost: number;
    estDeliveryTime: Date;
  };
  note?: string;
}

interface SellerGroupDetails {
  sellerId: string;
  deliveryFee: number;
  estDeliveryTime: Date;
  address?: Address;
}

const Checkout = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userWalletBalance, setUserWalletBalance] = useState<number>(0);
  const [groupedSelectedComics, setGroupedSelectedComics] = useState<
    Record<string, SellerGroup>
  >({});
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("wallet");
  const [sellerDetailsGroup, setSellerDetailsGroup] = useState<
    SellerDetails[] | []
  >([]);
  const [deliveryDetails, setDeliveryDetails] = useState<SellerGroupDetails[]>(
    []
  );
  const [notes, setNotes] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const countDown = () => {
    let secondsToGo = 3;

    const instance = modal.success({
      title: "Đặt hàng thành công!",
      content: `Chuyển trang trong vòng ${secondsToGo} giây...`,
      okText: "Chuyển ngay",
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
      setIsLoading(true);
      const response = await privateAxios("/users/profile");
      const data = await response.data;

      setUserInfo(data);

      setUserWalletBalance(Number(data.balance));
    } catch {
      setIsLoading(false);
      console.log("...");
    }
  };

  const fetchDeliveryDetails = async () => {
    setIsLoading(true);

    if (!selectedAddress) return;

    const tempDeliveryDetails: SellerGroupDetails[] = [];
    const tempSellerDetailsGroup: SellerDetails[] = [];

    await Promise.all(
      Object.keys(groupedSelectedComics).map(async (sellerId) => {
        const sellerDetails = await privateAxios.get(
          `/seller-details/user/${sellerId}`
        );

        tempSellerDetailsGroup.push(sellerDetails.data);

        const sellerAddress = {
          district: sellerDetails.data.district.id,
          ward: sellerDetails.data.ward.id,
        };

        if (sellerDetails && selectedAddress)
          await privateAxios
            .post("/orders/delivery-details", {
              fromDistrict: sellerAddress.district,
              fromWard: sellerAddress.ward,
              toDistrict: selectedAddress.district.id,
              toWard: selectedAddress.ward.id,
              comicsQuantity: groupedSelectedComics[sellerId].comics.length,
            })
            .then((res) => {
              const newDeliveryDetails = {
                sellerId: sellerId,
                deliveryFee: parseInt(res.data.deliveryFee),
                estDeliveryTime: res.data.estDeliveryTime,
              };
              tempDeliveryDetails.push(newDeliveryDetails);
            })
            .catch((err) => console.log(err));
      })
    ).finally(() => {
      setIsLoading(false);
      setDeliveryDetails(tempDeliveryDetails);
      setSellerDetailsGroup(tempSellerDetailsGroup);
    });
  };

  useEffect(() => {
    fetchDeliveryDetails();
  }, [selectedAddress]);

  const comics = sessionStorage.getItem("selectedComics");
  useEffect(() => {
    if (comics) {
      setGroupedSelectedComics(JSON.parse(comics));
    }
    fetchUserInfo();
  }, []);

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
  const totalDeliveryPrice = deliveryDetails.reduce((total, delivery) => {
    return total + delivery.deliveryFee;
  }, 0);

  const totalQuantity = Object.values(groupedSelectedComics).reduce(
    (total, sellerGroup) =>
      total + sellerGroup.comics.reduce((sum) => sum + 1, 0),
    0
  );

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };
  const handleSubmit = async () => {
    setIsLoading(true);

    console.log("Selected Comics by Seller:", groupedSelectedComics);
    console.log("Selected Address:", selectedAddress);
    console.log("Selected Payment Method:", selectedPaymentMethod);

    try {
      const orderedComicIds: string[] = [];
      for (const sellerId in groupedSelectedComics) {
        const sellerGroup = groupedSelectedComics[sellerId];

        const sellerTotalPrice = sellerGroup.comics.reduce(
          (total, { comic }) => total + Number(comic.price),
          0
        );
        const sellerDeliveryPrice =
          deliveryDetails.find((d) => d.sellerId === sellerId)?.deliveryFee ||
          0;

        const sellerDetails = sellerDetailsGroup.find(
          (details) => details.user.id === sellerId
        );

        const orderResponse = await privateAxios.post("/orders", {
          totalPrice: Number(sellerTotalPrice + sellerDeliveryPrice),
          paymentMethod: selectedPaymentMethod,
          fromName: sellerGroup.sellerName,
          fromPhone: sellerDetails?.verifiedPhone,
          fromAddress: sellerDetails?.fullAddress,
          fromProvinceName: sellerDetails?.province.name,
          fromDistrictId: sellerDetails?.district.id,
          fromDistrictName: sellerDetails?.district.name,
          fromWardId: sellerDetails?.ward.id,
          fromWardName: sellerDetails?.ward.name,
          toName: selectedAddress?.fullName,
          toPhone: selectedAddress?.phone,
          toAddress: selectedAddress?.fullAddress,
          toDistrictId: selectedAddress?.district.id,
          toWardId: selectedAddress?.ward.id,
          deliveryFee: sellerDeliveryPrice,
          addressId: selectedAddress?.id,
          note: notes[sellerId] || "",
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

        if (selectedPaymentMethod === "wallet") {
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
      }

      console.log("All orders are successfully created!");
      const storedCartData = localStorage.getItem("cart");
      if (storedCartData) {
        const parsedCartData = JSON.parse(storedCartData);
        const userId = userInfo?.id;
        console.log(userId);

        if (userId && parsedCartData[userId]) {
          parsedCartData[userId] = parsedCartData[userId].filter(
            (item: any) => !orderedComicIds.includes(item.id)
          );

          localStorage.setItem("cart", JSON.stringify(parsedCartData));
        } else {
          console.error("User cart not found or user ID is missing.");
        }
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
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    console.log("a", selectedAddress);
  }, [selectedAddress]);
  return (
    <>
      {isLoading && <Loading />}
      <div className="w-full flex flex-col items-center px-20 py-8 bg-neutral-100 REM">
        {comics ? (
          <div className="min-w-[60em] max-w-[100em] flex items-start gap-4 relative">
            <div className="w-full flex flex-col gap-4">
              <DeliveryAddress
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />
              <OrderCheck
                groupedSelectedComics={groupedSelectedComics}
                deliveryDetails={deliveryDetails}
                notes={notes}
                setNotes={setNotes}
                // totalPrice={totalPrice}
                // totalQuantity={totalQuantity}
              />
              {/* <DeliveryMethod /> */}
              <PaymentMethod
                onMethodSelect={handlePaymentMethodSelect}
                amount={totalPrice + totalDeliveryPrice}
                balance={userWalletBalance}
              />
            </div>
            <div className="grow min-w-[20em] max-w-[25em] top-4 sticky">
              <TotalSummary
                totalPrice={totalPrice}
                totalDeliveryPrice={totalDeliveryPrice}
                totalQuantity={totalQuantity}
                handleSubmit={handleSubmit}
                navigate={navigate}
                isConfirmDisabled={
                  selectedPaymentMethod === "wallet" &&
                  userWalletBalance < totalPrice + totalDeliveryPrice
                }
              />
            </div>
          </div>
        ) : (
          <div className="w-full bg-white REM">
            <h2>
              Vui lòng quay lại và chọn ít nhất 1 sản phẩm trong giỏ hàng!
            </h2>
            <Link to={"/cart"}>Quay lại</Link>
          </div>
        )}
      </div>
      {contextHolder}
    </>
  );
};

export default Checkout;
