import React, { useEffect, useState } from "react";
import TotalPrice from "../components/cart/TotalPrice";
import axios from "axios";
import CurrencySplitter from "../components/assistants/Spliter";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../middleware/axiosInstance";

interface Comic {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  author: string;
  description: string;
  coverImage: string[];
  publishedDate: string;
  price: number;
  status: string;
  quantity: number;
  previewChapter: string[];
  isAuction: boolean;
  isExchange: boolean;
  comicCommission: number;
  selected?: boolean;
}

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
  role: {
    id: number;
    role_name: string;
  };
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
  const [selectAll, setSelectAll] = useState(false);
  const token = sessionStorage.getItem("accessToken");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const fetchCartData = async () => {
    if (!userId) return; // Only fetch if userId is available
    setIsLoading(true);
    try {
      const response = await privateAxios.get("/cart");
      setCartData(response.data); // Set the fetched cart data
      console.log(response);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    if (token) {
      try {
        const response = await fetch("http://localhost:3000/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }
        const data = await response.json();
        setUserId(data.id);
      } catch {
        console.log("...");
      }
    } else {
      console.log("...");
    }
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

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (cartData) {
      setCartData((prevData) => {
        if (!prevData) return prevData; // Ensure prevData is not null
        return {
          ...prevData,
          comics: prevData.comics.map((comic) => ({
            ...comic,
            selected: !selectAll,
          })),
        };
      });
    }
  };

  const totalPrice = cartData
    ? cartData.comics
        .filter((comic) => comic.selected) // only sum up selected comics
        .reduce(
          (total, comic) =>
            total + comic.price * (cartData.quantities[comic.id] || 0),
          0
        )
    : 0;

  useEffect(() => {
    fetchUserInfo();
  }, [token]);

  useEffect(() => {
    fetchCartData();
  }, [userId]);
  console.log("cart data:", cartData);

  return (
    <div className="w-full lg:px-24 px-12 bg-neutral-100 py-8 REM">
      <div className="flex flex-row gap-2 items-center">
        <h2 className="text-2xl font-bold mb-4">GIỎ HÀNG</h2>
        <h2 className="text-2xl font-normal mb-4">
          ({cartData ? cartData.comics.length : 0} sản phẩm)
        </h2>
      </div>

      <div className="flex justify-between gap-6 lg:flex-row flex-col">
        <div className="lg:w-3/4 w-full">
          <div className="flex flex-col bg-white p-4 rounded-md shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th>
                    <div className="flex flex-row gap-2 items-center py-2 ">
                      <input
                        type="checkbox"
                        className="h-4 w-4 border-2 rounded-sm"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                      <span className="font-bold">Chọn tất cả</span>
                    </div>
                  </th>
                  {/* <th className="text-left">Sản phẩm</th> */}
                  <th className="text-center">Số lượng</th>
                  <th className="text-center">Thành tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  cartData?.comics.map((comic) => (
                    <tr key={comic.id} className="border-b">
                      {/* <td></td> */}
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
                          <div className="gap-2 border flex flex-row  text-center rounded-lg">
                            <button
                              className="pl-2"
                              onClick={() => handleDecrease(comic.id)}
                            >
                              -
                            </button>
                            <span className="min-w-6">
                              {cartData.quantities[comic.id]}
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
                          comic.price * (cartData?.quantities[comic.id] || 0)
                        )}{" "}
                        đ
                      </td>
                      <td>
                        <button className="flex items-center">
                          <svg
                            width="25px"
                            height="25px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                              stroke="#ccc"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:w-1/4 w-full bg-white p-4 rounded-md shadow-sm h-full">
          <div className="p-4 bg-white rounded-md">
            <div className="flex justify-between mb-4">
              <span>Thành tiền</span>
              <span>{CurrencySplitter(totalPrice)} đ</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng Số Tiền</span>
              <span className="text-red-500">
                {CurrencySplitter(totalPrice)} đ
              </span>
            </div>
            <button
              className="w-full mt-4 py-2 bg-black text-white font-semibold rounded-md"
              onClick={() => navigate("/checkout")}
            >
              THANH TOÁN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
