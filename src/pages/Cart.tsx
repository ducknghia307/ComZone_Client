import React, { useEffect, useState } from "react";

import CurrencySplitter from "../assistants/Spliter";
import { Link, useNavigate } from "react-router-dom";
import { privateAxios } from "../middleware/axiosInstance";
import { Comic } from "../common/base.interface";
import { Popconfirm, Skeleton } from "antd";

interface CartData {
  comics: Comic[];
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
    const storedCartData = localStorage.getItem("cart");
    if (storedCartData) {
      try {
        const parsedCartData = JSON.parse(storedCartData);
        const comicIds = parsedCartData.map((item: any) => item.comics.id);
        const existingComics = await Promise.all(
          comicIds.map(async (comicId: string) => {
            try {
              const response = await privateAxios(`/comics/${comicId}`);
              return response.data;
            } catch (error) {
              console.error(`Error fetching comic with ID ${comicId}:`, error);
              return null;
            }
          })
        );

        const validComics = existingComics.filter((comic) => comic !== null);

        setCartData({
          comics: validComics,
        });
      } catch (error) {
        console.error("Error parsing stored cart data:", error);
        setCartData(null);
      }
    } else {
      setCartData(null);
    }
    setIsLoading(false);
  };

  const groupComicsBySeller = (comics: Comic[]) => {
    return comics.reduce(
      (
        groups: Record<string, { sellerName: string; comics: Comic[] }>,
        comic: Comic
      ) => {
        const sellerId = comic.sellerId || "unknown";
        const sellerName = comic.sellerId.name || "Unknown Seller";

        if (!groups[sellerId.id]) {
          groups[sellerId.id] = { sellerName, comics: [] };
        }
        groups[sellerId.id].comics.push(comic);
        return groups;
      },
      {}
    );
  };

  const handleCheckboxChange = (comicId: string) => {
    if (!cartData) return;
    setCartData((prevData) => {
      if (!prevData) return prevData;
      const updatedComics = prevData.comics.map((comic) =>
        comic.id === comicId ? { ...comic, selected: !comic.selected } : comic
      );
      return { ...prevData, comics: updatedComics };
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

    const selectedComics = cartData.comics.filter(
      (comic) => comic.selected && comic.status === "AVAILABLE"
    );

    if (selectedComics.length === 0) {
      setShowWarning(true);
      return;
    }

    const groupedSelectedComics = selectedComics.reduce(
      (
        groups: Record<
          string,
          { sellerName: string; comics: { comic: Comic }[] }
        >,
        comic
      ) => {
        const sellerId = comic.sellerId || "unknown";
        const sellerName = comic.sellerId.name || "Unknown Seller";

        if (!groups[sellerId.id]) {
          groups[sellerId.id] = { sellerName, comics: [] };
        }
        groups[sellerId.id].comics.push({ comic });
        return groups;
      },
      {}
    );
    console.log(groupedSelectedComics);

    sessionStorage.removeItem("selectedComics");
    sessionStorage.setItem(
      "selectedComics",
      JSON.stringify(groupedSelectedComics)
    );

    navigate("/checkout");
  };
  const totalPrice = cartData
    ? cartData.comics
        .filter((comic) => comic.selected && comic.status === "AVAILABLE")
        .reduce((total, comic) => total + Number(comic.price), 0)
    : 0;

  const confirm = (comicId: string) => {
    const storedCartData = localStorage.getItem("cart");

    if (storedCartData) {
      try {
        const parsedCartData = JSON.parse(storedCartData);
        const updatedCartData = parsedCartData.filter(
          (item: any) => item.comics.id !== comicId
        );

        // Update localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCartData));

        // Update cartData state to reflect the removed comic
        setCartData((prevData) => ({
          comics: prevData
            ? prevData.comics.filter((comic) => comic.id !== comicId)
            : [],
        }));
      } catch (error) {
        console.error("Error updating cart in localStorage:", error);
      }
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);
  console.log("cart data:", cartData);

  const groupedComics = cartData ? groupComicsBySeller(cartData.comics) : {};

  return (
    <div className="w-full lg:px-6 px-12 bg-neutral-100 py-8 REM">
      {cartData && cartData.comics.length > 0 ? (
        <>
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
                                  onChange={() =>
                                    handleSellerSelectAll(sellerId)
                                  }
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
                            <th className="text-center">Thành tiền</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedComics[sellerId].comics.map((comic) => (
                            <tr
                              key={comic.id}
                              className={`border-b ${
                                comic.status === "UNAVAILABLE"
                                  ? "opacity-30 "
                                  : ""
                              }`}
                            >
                              <td className="flex items-center gap-2 py-6">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 border-2 rounded-sm"
                                  checked={comic.selected || false}
                                  onChange={() =>
                                    handleCheckboxChange(comic.id)
                                  }
                                  disabled={comic.status === "UNAVAILABLE"}
                                />
                                <img
                                  src={comic.coverImage}
                                  alt={comic.title}
                                  className="w-auto h-24 object-cover"
                                />
                                <div className="flex flex-col items-center ml-4">
                                  <span className="font-light">
                                    {comic.title}
                                  </span>
                                  {comic.status === "UNAVAILABLE" && (
                                    <span className="text-xs text-red-500">
                                      Truyện này hiện không còn trên hệ thống
                                      chúng tôi
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="text-red-500 font-semibold text-center">
                                {comic.status === "AVAILABLE"
                                  ? CurrencySplitter(comic.price)
                                  : "N/A"}{" "}
                                đ
                              </td>
                              <td>
                                <Popconfirm
                                  title="Xóa truyện"
                                  description="Bạn có muốn xóa truyện đang chọn?"
                                  onConfirm={() => confirm(comic.id)}
                                  cancelText="Hủy"
                                  okText="Xác nhận"
                                >
                                  <button className="flex items-center">
                                    <svg
                                      width="20px"
                                      height="20px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                                        stroke="#000000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                </Popconfirm>
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
                  {showWarning && totalPrice === 0 && (
                    <p className="text-red-500 mt-2 italic text-xs">
                      Vui lòng chọn ít nhất một sản phẩm.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 flex items-center justify-center flex-col min-h-[50vh]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            width="100"
            height="100"
          >
            <rect width="256" height="256" fill="none" />
            <circle cx="80" cy="216" r="20" />
            <circle cx="184" cy="216" r="20" />
            <path
              d="M42.3,72H221.7l-24.1,84.4A16,16,0,0,1,182.2,168H81.8a16,16,0,0,1-15.4-11.6L32.5,37.8A8,8,0,0,0,24.8,32H12"
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            />
          </svg>
          <h2 className="text-4xl font-semibold text-gray-500 mt-4">
            Giỏ hàng trống
          </h2>
          <Link to={"/genres"}>Tiếp tục mua truyện</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
