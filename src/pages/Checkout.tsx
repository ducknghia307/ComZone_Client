import React, { useCallback, useEffect, useState } from "react";
import DeliveryAddress from "../components/checkout/DeliveryAddress";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderCheck from "../components/checkout/OrderCheck";
import {
  Address,
  Comic,
  SellerDetails,
  UserInfo,
} from "../common/base.interface";
import { privateAxios } from "../middleware/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import TotalSummary from "../components/checkout/TotalSummary";
import Loading from "../components/loading/Loading";
import socket from "../services/socket";

interface SellerGroup {
  sellerName: string;
  comics: {
    comic: Comic;
    quantity: number;
    currentPrice?: number;
    auctionId?: string;
  }[];
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
  const [user, setUser] = useState<UserInfo>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userWalletBalance, setUserWalletBalance] = useState<number>(0);
  const [groupedSelectedComics, setGroupedSelectedComics] = useState<
    Record<string, SellerGroup>
  >({});
  const [addresses, setAddresses] = useState<Address[]>([]);
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

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await privateAxios("/users/profile");
      const data = await response.data;
      setUser(data);

      setUserWalletBalance(Number(data.balance));
    } catch {
      setIsLoading(false);
    }
  };

  const fetchUserAddress = async () => {
    try {
      const response = await privateAxios("/user-addresses/user");

      const data = response.data;

      const sortedAddresses = data.sort((a: Address, b: Address) => {
        return (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0);
      });
      console.log(sortedAddresses);

      setSelectedAddress(sortedAddresses[0] || null);
      setAddresses(sortedAddresses);
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
    fetchUserAddress();
  }, []);

  const fetchDeliveryDetails = async () => {
    if (!selectedAddress) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setDeliveryDetails([]);
      setSellerDetailsGroup([]);

      await Promise.all(
        Object.keys(groupedSelectedComics).map(async (sellerId) => {
          const sellerDetails = await privateAxios.get(
            `/seller-details/user/${sellerId}`
          );

          setSellerDetailsGroup((prev) => [...prev, sellerDetails.data]);

          const sellerAddress = {
            district: sellerDetails.data.district.id,
            ward: sellerDetails.data.ward.id,
          };

          if (sellerDetails && selectedAddress)
            await privateAxios
              .post("/deliveries/details", {
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
                setDeliveryDetails((prev) => [...prev, newDeliveryDetails]);
              })
              .catch((err) => console.log(err));
        })
      )
        .catch((err) => console.log(err))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchDeliveryDetails();
  }, [selectedAddress]);

  const totalPrice = Object.values(groupedSelectedComics).reduce(
    (total, sellerGroup) => {
      return (
        total +
        sellerGroup.comics.reduce((sellerTotal, { comic, currentPrice }) => {
          const price = currentPrice || comic?.price; // Use auction price if available
          return sellerTotal + Number(price);
        }, 0)
      );
    },
    0
  );

  const totalDeliveryPrice = deliveryDetails.reduce((prev, current) => {
    return prev + current.deliveryFee;
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
          (total, { comic, currentPrice }) => {
            const price = currentPrice || comic?.price; // Use currentPrice if available, otherwise fallback to regular price
            return total + Number(price);
          },
          0
        );

        const sellerDeliveryPrice =
          deliveryDetails.find((d) => d.sellerId === sellerId)?.deliveryFee ||
          0;

        const sellerDetails = sellerDetailsGroup.find(
          (details) => details.user.id === sellerId
        );

        const newUserDeliveryInfo = await privateAxios
          .post("delivery-information", {
            name: selectedAddress?.fullName,
            phone: selectedAddress?.phone,
            provinceId: selectedAddress?.province.id,
            districtId: selectedAddress?.district.id,
            wardId: selectedAddress?.ward.id,
            address: selectedAddress?.detailedAddress,
          })
          .then((res) => {
            return res.data;
          })
          .catch((err) => console.log(err));

        const newSellerDeliveryInfo = await privateAxios
          .post("delivery-information", {
            name: sellerDetails?.user.name,
            phone: sellerDetails?.verifiedPhone,
            provinceId: sellerDetails?.province.id,
            districtId: sellerDetails?.district.id,
            wardId: sellerDetails?.ward.id,
            address: sellerDetails?.detailedAddress,
          })
          .then((res) => {
            return res.data;
          })
          .catch((err) => console.log(err));

        const newDelivery = await privateAxios
          .post("deliveries/order", {
            fromAddressId: newSellerDeliveryInfo.id,
            toAddressId: newUserDeliveryInfo.id,
          })
          .then((res) => {
            return res.data;
          })
          .catch((err) => console.log(err));

        const orderType = sellerGroup.comics.some(({ auctionId }) => auctionId)
          ? "AUCTION"
          : "TRADITIONAL";

        const orderResponse = await privateAxios.post("/orders", {
          sellerId: sellerId,
          deliveryId: newDelivery.id,
          totalPrice: Number(sellerTotalPrice + sellerDeliveryPrice),
          paymentMethod: selectedPaymentMethod.toUpperCase(),
          addressId: selectedAddress?.id,
          note: notes[sellerId] || "",
          type: orderType,
        });

        const orderId = orderResponse.data.id;

        for (const { comic, currentPrice, auctionId } of sellerGroup.comics) {
          const price = currentPrice || comic?.price;
          const orderItemPayload = {
            comics: comic.id,
            order: orderId,
            price,
          };

          console.log("Order Item Payload:", orderItemPayload);

          await privateAxios.post("/order-items", orderItemPayload);
          orderedComicIds.push(comic.id);
          if (auctionId) {
            socket.emit("updateAuctionStatus", {
              auctionId,
              currentPrice,
              user,
            });
          }
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
      navigate("/order/complete");
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
                addresses={addresses}
                setAddresses={setAddresses}
                fetchUserAddress={fetchUserAddress}
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
                  !selectedAddress ||
                  (selectedPaymentMethod === "wallet" &&
                    userWalletBalance < totalPrice + totalDeliveryPrice)
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
