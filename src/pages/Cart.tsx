import React, { useEffect, useState } from "react";
import TotalPrice from "../components/cart/TotalPrice";
import axios from "axios";
import CurrencySplitter from "../components/assistants/Spliter";

interface ComicData {
  title: string;
  author: string;
  cover_image: string;
  price: number;
  quantity: number;
  selected: boolean; // new property for checkbox state
}

const Cart = () => {
  const [comicData, setComicData] = useState<ComicData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const fetchComicData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://669355fcc6be000fa07adfe4.mockapi.io/comic"
      );
      const updatedData = response.data.map((item: ComicData) => ({
        ...item,
        selected: false,
      }));
      setComicData(updatedData);
    } catch (error) {
      console.error("Error fetching comic data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quantity changes
  const handleDecrease = (index: number) => {
    setComicData((prevData) =>
      prevData.map((item, i) =>
        i === index && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleIncrease = (index: number) => {
    setComicData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handle selecting/deselecting individual items
  const handleCheckboxChange = (index: number) => {
    setComicData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Handle "Select All" checkbox change
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setComicData((prevData) =>
      prevData.map((item) => ({ ...item, selected: !selectAll }))
    );
  };

  const totalPrice = comicData
    .filter((item) => item.selected) // only sum up selected items
    .reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    fetchComicData();
  }, []);

  return (
    <div className="w-full lg:px-24 px-12 bg-neutral-100 py-8 REM">
      <div className="flex flex-row gap-2 items-center">
        <h2 className="text-2xl font-bold mb-4">GIỎ HÀNG</h2>
        <h2 className="text-2xl font-normal mb-4">
          ({comicData.length} sản phẩm)
        </h2>
      </div>

      <div className="flex justify-between gap-6 lg:flex-row flex-col">
        <div className="lg:w-3/4 w-full">
          <div className="flex flex-col bg-white p-4 rounded-md shadow-sm">
            <div className="flex flex-row gap-2 items-center py-2 ml-6">
              <svg
                width="25px"
                height="25px"
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
              <span className="font-semibold text-2xl">Wuan Sọp pe</span>
            </div>

            <div className="flex flex-row gap-2 mt-4">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="mr-4 h-5 w-5 checked:bg-black"
              />
              <span className="font-semibold">
                Chọn tất cả ({comicData.length} sản phẩm)
              </span>
            </div>

            <table className="min-w-full mt-4">
              <thead>
                <tr className="border-b">
                  <th></th>
                  <th className=""></th>
                  <th className=""></th>
                  <th className="text-center p-2 font-light">Số lượng</th>
                  <th className="text-center p-2 font-light">Thành tiền</th>
                  <th className=""></th>
                </tr>
              </thead>
              <tbody>
                {comicData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleCheckboxChange(index)}
                        className="h-5 w-5 checked:bg-black"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        className="h-32 w-auto object-cover"
                      />
                    </td>

                    <td className="p-2 align-top">
                      <div className="flex flex-col justify-between h-32">
                        <span className="font-extralight">{item.title}</span>
                        <span className="font-semibold">
                          {CurrencySplitter(item.price)} đ
                        </span>
                      </div>
                    </td>
                    {/* <td className="p-2">{item.author}</td> */}
                    {/* <td className="p-2">{item.price} đ</td> */}
                    <td className="p-2 h-32">
                      <div className="flex flex-row items-center justify-center border border-gray-300 rounded-xl ">
                        <button
                          onClick={() => handleDecrease(index)}
                          className="px-2 text-gray-600"
                        >
                          -
                        </button>
                        <span className="px-1.5 py-1 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(index)}
                          className="px-2  text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center text-rose-600 font-semibold">
                      {CurrencySplitter(item.price * item.quantity)} đ
                    </td>
                    <td className="p-2">
                      <button className="ml-4 text-gray-500 hover:text-red-500">
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                            stroke="#000000"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:w-1/4 w-full">
          <TotalPrice totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
