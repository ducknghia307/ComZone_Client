import React, { useEffect, useState } from "react";

import CurrencySplitter from "../components/assistants/Spliter";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../middleware/axiosInstance";
import { Comic, Role } from "../common/base.interface";
import { Skeleton } from "antd";

interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  email: string;
  password: string;
  name: string;
  phone: string | null;
  status: string;
  is_verified: boolean;
  refresh_token: string;
  role: Role;
}

interface CartData {
  id: string;
  quantities: Record<string, number | null>; // mapping comic IDs to quantities
  totalPrice: string; // total price as string
  comics: Comic[];
  user: User;
}

const Cart = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sellerSelectAll, setSellerSelectAll] = useState<
    Record<string, boolean>
  >({});
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  const fetchCartData = async () => {
    setIsLoading(true);
    try {
      const response = await privateAxios.get("/cart");
      setCartData(response.data); // Set the fetched cart data
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupComicsBySeller = (comics: Comic[]) => {
    return comics.reduce(
      (
        groups: Record<string, { sellerName: string; comics: Comic[] }>,
        comic: Comic
      ) => {
        const sellerId = comic.sellerId || "unknown";
        const sellerName = comic.sellerId.name || "Unknown Seller"; // Assuming comic includes sellerName

        if (!groups[sellerId.id]) {
          groups[sellerId.id] = { sellerName, comics: [] };
        }
        groups[sellerId.id].comics.push(comic);
        return groups;
      },
      {}
    );
  };

  const handleDecrease = (comicId: string) => {
    if (!cartData) return;
    setCartData((prevData) => {
      if (!prevData) return prevData;
      const updatedQuantities = { ...prevData.quantities };
      if (updatedQuantities[comicId] && updatedQuantities[comicId] > 1) {
        updatedQuantities[comicId] -= 1;
      }
      return { ...prevData, quantities: updatedQuantities };
    });
  };

  const handleIncrease = (comicId: string) => {
    if (!cartData) return;
    setCartData((prevData) => {
      if (!prevData) return prevData;
      const updatedQuantities = { ...prevData.quantities };
      updatedQuantities[comicId] = (updatedQuantities[comicId] || 0) + 1;
      return { ...prevData, quantities: updatedQuantities };
    });
  };

  const handleCheckboxChange = (comicId: string) => {
    if (!cartData) return;
    setCartData((prevData) => {
      if (!prevData) return prevData;
      const updatedComics = prevData.comics.map((comic) =>
        comic.id === comicId ? { ...comic, selected: !comic.selected } : comic
      );
      return { ...prevData, comics: updatedComics }; // Return the full CartData structure
    });
  };

  const handleSellerSelectAll = (sellerId: string) => {
    setSellerSelectAll((prev) => ({ ...prev, [sellerId]: !prev[sellerId] }));
    if (cartData) {
      setCartData((prevData) => {
        if (!prevData) return prevData; // Ensure prevData is not null
        return {
          ...prevData,
          comics: prevData.comics.map((comic) =>
            comic.sellerId.id === sellerId
              ? { ...comic, selected: !sellerSelectAll[sellerId] }
              : comic
          ),
        };
      });
    }
  };

  const handleCheckout = () => {
    if (!cartData) return;

    const selectedComics = cartData.comics.filter((comic) => comic.selected);

    if (selectedComics.length === 0) {
      setShowWarning(true);
      return;
    }

    const groupedSelectedComics = selectedComics.reduce(
      (
        groups: Record<
          string,
          { sellerName: string; comics: { comic: Comic; quantity: number }[] }
        >,
        comic
      ) => {
        const sellerId = comic.sellerId || "unknown";
        const sellerName = comic.sellerId.name || "Unknown Seller";
        const quantity = cartData.quantities[comic.id] || 0;

        if (!groups[sellerId.id]) {
          groups[sellerId.id] = { sellerName, comics: [] };
        }
        groups[sellerId.id].comics.push({ comic, quantity });
        return groups;
      },
      {}
    );
    sessionStorage.removeItem("selectedComics");
    sessionStorage.setItem(
      "selectedComics",
      JSON.stringify(groupedSelectedComics)
    );

    navigate("/checkout");
  };

  const totalPrice = cartData
    ? cartData.comics
        .filter((comic) => comic.selected)
        .reduce((total, comic) => {
          const comicQuantity = cartData.quantities[comic.id] || 0;

          console.log("quantity:", comicQuantity);

          return total + comic.price * comicQuantity;
        }, 0)
    : 0;

  useEffect(() => {
    fetchCartData();
  }, []);
  console.log("cart data:", cartData);

  const groupedComics = cartData ? groupComicsBySeller(cartData.comics) : {};

  return (
    <div className="w-full lg:px-24 px-12 bg-neutral-100 py-8 REM">
      <div className="flex flex-row gap-2 items-center">
        <h2 className="text-2xl font-bold mb-4">GIỎ HÀNG</h2>
        <h2 className="text-2xl font-normal mb-4">
          ({cartData ? cartData.comics.length : 0} sản phẩm)
        </h2>
      </div>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <div className="flex justify-between gap-6 lg:flex-row flex-col">
          <div className="lg:w-3/4 w-full">
            {Object.keys(groupedComics).map((sellerId) => (
              <div key={sellerId} className="mb-8">
                <div className="flex flex-col bg-white p-4 rounded-md shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th>
                          <div className="flex flex-row gap-2 items-center py-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 border-2 rounded-sm"
                              checked={sellerSelectAll[sellerId] || false}
                              onChange={() => handleSellerSelectAll(sellerId)}
                            />
                            <svg
                              width="24px"
                              height="24px"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.5 21.5V18.5C9.5 17.5654 9.5 17.0981 9.70096 16.75C9.83261 16.522 10.022 16.3326 10.25 16.201C10.5981 16 11.0654 16 12 16C12.9346 16 13.4019 16 13.75 16.201C13.978 16.3326 14.1674 16.522 14.299 16.75C14.5 17.0981 14.5 17.5654 14.5 18.5V21.5"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M21 22H9M3 22H5.5"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M19 22V15"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M5 22V15"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M11.9999 2H7.47214C6.26932 2 5.66791 2 5.18461 2.2987C4.7013 2.5974 4.43234 3.13531 3.89443 4.21114L2.49081 7.75929C2.16652 8.57905 1.88279 9.54525 2.42867 10.2375C2.79489 10.7019 3.36257 11 3.99991 11C5.10448 11 5.99991 10.1046 5.99991 9C5.99991 10.1046 6.89534 11 7.99991 11C9.10448 11 9.99991 10.1046 9.99991 9C9.99991 10.1046 10.8953 11 11.9999 11C13.1045 11 13.9999 10.1046 13.9999 9C13.9999 10.1046 14.8953 11 15.9999 11C17.1045 11 17.9999 10.1046 17.9999 9C17.9999 10.1046 18.8953 11 19.9999 11C20.6373 11 21.205 10.7019 21.5712 10.2375C22.1171 9.54525 21.8334 8.57905 21.5091 7.75929L20.1055 4.21114C19.5676 3.13531 19.2986 2.5974 18.8153 2.2987C18.332 2 17.7306 2 16.5278 2H16"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <h3 className="text-xl font-bold ">
                              {groupedComics[sellerId].sellerName}
                            </h3>
                          </div>
                        </th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-center">Thành tiền</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedComics[sellerId].comics.map((comic) => (
                        <tr key={comic.id} className="border-b">
                          <td className="flex items-center gap-2 py-6">
                            <input
                              type="checkbox"
                              className="h-4 w-4 border-2 rounded-sm"
                              checked={comic.selected || false}
                              onChange={() => handleCheckboxChange(comic.id)}
                            />
                            <img
                              src={comic.coverImage[0]}
                              alt={comic.title}
                              className="w-32 h-32 object-cover"
                            />
                            <div className="flex flex-col h-32 justify-between ml-4">
                              <span className="font-light">{comic.title}</span>
                              <span className="font-semibold">
                                {CurrencySplitter(comic.price)} đ
                              </span>
                            </div>
                          </td>
                          <td className="">
                            <div className="flex items-center justify-center">
                              <div className="gap-2 border flex flex-row text-center rounded-lg">
                                <button
                                  className="pl-2"
                                  onClick={() => handleDecrease(comic.id)}
                                >
                                  -
                                </button>
                                <span className="min-w-6">
                                  {cartData?.quantities[comic.id]}
                                </span>
                                <button
                                  className="pr-2"
                                  onClick={() => handleIncrease(comic.id)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="text-red-500 font-semibold text-center">
                            {CurrencySplitter(
                              comic.price *
                                (cartData?.quantities[comic.id] || 0)
                            )}{" "}
                            đ
                          </td>
                          <td>
                            <button className="flex items-center">
                              {/* Delete button (can be improved) */}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/4 w-full bg-white p-4 rounded-md shadow-sm h-full">
            <div className="p-4 bg-white rounded-md">
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng Số Tiền</span>
                <span className="text-red-500">
                  {CurrencySplitter(totalPrice)} đ
                </span>
              </div>
              <button
                className="w-full mt-4 py-2 bg-black text-white font-semibold rounded-md"
                onClick={handleCheckout}
              >
                THANH TOÁN
              </button>
              {showWarning && (
                <p className="text-red-500 mt-2 italic text-xs">
                  Vui lòng chọn ít nhất một sản phẩm.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
