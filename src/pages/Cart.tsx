import { useEffect, useState } from "react";

import CurrencySplitter from "../assistants/Spliter";
import { Link, useNavigate } from "react-router-dom";
import { privateAxios } from "../middleware/axiosInstance";
import { Comic, UserInfo } from "../common/base.interface";
import { Checkbox, Popconfirm, Skeleton, Tooltip } from "antd";
import Loading from "../components/loading/Loading";

interface CartComic extends Comic {
  selected?: boolean;
}

interface CartData {
  comics: CartComic[];
}
//?????????????????????????????????????wuavan5076

const Cart = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const [sellerSelectAll, setSellerSelectAll] = useState<
    Record<string, boolean>
  >({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const res = await privateAxios("/users/profile");
      setUserInfo(res.data);
    } catch (error) {
      console.log("Error to fetch user information:", error);
    }
  };

  const fetchCartData = async () => {
    setIsLoading(true);
    const storedCartData = localStorage.getItem("cart");

    if (storedCartData && userInfo?.id) {
      try {
        const parsedCartData = JSON.parse(storedCartData);

        const userCartEntry = parsedCartData[userInfo.id];

        if (userCartEntry) {
          const comicIds = userCartEntry.map((item: any) => item.id);

          const fetchedComics = await Promise.all(
            comicIds.map(async (comicId: string) => {
              try {
                const response = await privateAxios(`/comics/${comicId}`);
                return response.data;
              } catch (error) {
                console.error(
                  `Error fetching comic with ID ${comicId}:`,
                  error
                );
                return null;
              }
            })
          );

          const validComics = fetchedComics.filter((comic) => comic !== null);
          setCartData({ comics: validComics });
        } else {
          setCartData({ comics: [] });
        }
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
        groups: Record<
          string,
          { sellerName: string; sellerAvt: string; comics: CartComic[] }
        >,
        comic: Comic
      ) => {
        const sellerId = comic.sellerId || null;
        const sellerName = comic.sellerId.name || "Unknown Seller";
        const sellerAvt = comic.sellerId.avatar || "";
        if (!groups[sellerId.id]) {
          groups[sellerId.id] = { sellerName, sellerAvt, comics: [] };
        }
        groups[sellerId.id].comics.push(comic);
        return groups;
      },
      {}
    );
  };
  const handleCheckboxChange = (comicId: string) => {
    if (!cartData) return;

    const updatedComics = cartData.comics.map((comic) =>
      comic.id === comicId ? { ...comic, selected: !comic.selected } : comic
    );

    const sellerId = cartData.comics.find((comic) => comic.id === comicId)
      ?.sellerId?.id;

    const comicsForSeller = updatedComics.filter(
      (comic) => comic.sellerId?.id === sellerId
    );
    const allComicsSelectedForSeller =
      comicsForSeller.length > 0 &&
      comicsForSeller.every((comic) => comic.selected);

    setCartData({ ...cartData, comics: updatedComics });
    updateGlobalSelectState(updatedComics);

    setSellerSelectAll((prev) => ({
      ...prev,
      [sellerId || ""]: allComicsSelectedForSeller,
    }));
  };

  const updateGlobalSelectState = (comics: CartComic[]) => {
    const availableComics = comics.filter(
      (comic) => comic.status === "AVAILABLE"
    );
    const allSelected =
      availableComics.length > 0 &&
      availableComics.every((comic) => comic.selected);
    setIsAllSelected(allSelected);
  };

  const handleSelectAll = () => {
    if (!cartData) return;

    const newIsAllSelected = !isAllSelected;

    // Update all available comics
    const updatedComics = cartData.comics.map((comic) => ({
      ...comic,
      selected: comic.status === "AVAILABLE" ? newIsAllSelected : false,
    }));

    // Update seller select all states
    const newSellerSelectAll: Record<string, boolean> = {};
    Object.keys(groupComicsBySeller(updatedComics)).forEach((sellerId) => {
      const sellerComics = updatedComics.filter(
        (comic) => comic.sellerId?.id === sellerId
      );
      newSellerSelectAll[sellerId] = sellerComics.every(
        (comic) => comic.selected
      );
    });

    setCartData({ comics: updatedComics });
    setSellerSelectAll(newSellerSelectAll);
    setIsAllSelected(newIsAllSelected);
  };
  const handleSellerSelectAll = (sellerId: string) => {
    if (!cartData) return;

    const isCurrentlySelected = sellerSelectAll[sellerId] || false;
    const updatedComics = cartData.comics.map((comic) =>
      comic.sellerId?.id === sellerId && comic.status === "AVAILABLE"
        ? { ...comic, selected: !isCurrentlySelected }
        : comic
    );

    setCartData({ comics: updatedComics });
    updateGlobalSelectState(updatedComics);

    setSellerSelectAll((prev) => ({
      ...prev,
      [sellerId]: !isCurrentlySelected,
    }));
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
        const sellerId = comic.sellerId.id || null;
        const sellerName = comic.sellerId.name || "Unknown Seller";

        if (!groups[sellerId]) {
          groups[sellerId] = { sellerName, comics: [] };
        }
        groups[sellerId].comics.push({ comic });
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
        const userId = userInfo?.id;

        if (userId && parsedCartData[userId]) {
          const updatedCartData = {
            ...parsedCartData,
            [userId]: parsedCartData[userId].filter(
              (item: any) => item.id !== comicId
            ),
          };

          localStorage.setItem("cart", JSON.stringify(updatedCartData));

          setCartData((prevData) => {
            const currentComics = prevData?.comics || [];
            return {
              ...prevData,
              comics: currentComics.filter((comic) => comic.id !== comicId),
            };
          });

          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch (error) {
        console.error("Error updating cart in localStorage:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    fetchCartData();
  }, [userInfo]);

  console.log("cart data:", cartData);

  const groupedComics = cartData ? groupComicsBySeller(cartData.comics) : {};

  return (
    <>
      {isLoading && <Loading />}
      <div className="w-full lg:px-6 px-12 bg-neutral-100 py-8 REM">
        {cartData && cartData.comics.length > 0 ? (
          <>
            <div className="flex flex-row gap-2 items-center">
              <h2 className="text-2xl font-bold mb-4">GIỎ HÀNG</h2>
              <h2 className="text-2xl font-normal mb-4">
                ({cartData ? cartData.comics.length : 0} sản phẩm)
              </h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2">
              <Checkbox checked={isAllSelected} onChange={handleSelectAll}>
                <span className="text-sm">Chọn tất cả</span>
              </Checkbox>
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
                                <div className="flex flex-row gap-2 items-center justify-start py-2">
                                  <Checkbox
                                    checked={sellerSelectAll[sellerId] || false}
                                    onChange={() =>
                                      handleSellerSelectAll(sellerId)
                                    }
                                    disabled={groupedComics[
                                      sellerId
                                    ].comics.some(
                                      (comics) => comics.status !== "AVAILABLE"
                                    )}
                                  />
                                  <img
                                    src={groupedComics[sellerId].sellerAvt}
                                    alt={groupedComics[sellerId].sellerName}
                                    className="h-8 w-8 rounded-full"
                                  />
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
                                  comic.status === "UNAVAILABLE" ||
                                  comic.status === "SOLD"
                                    ? "opacity-30"
                                    : ""
                                }`}
                              >
                                <td className="flex items-center gap-2 py-6">
                                  <Checkbox
                                    checked={comic.selected || false}
                                    onChange={() =>
                                      handleCheckboxChange(comic.id)
                                    }
                                    disabled={
                                      comic.status === "UNAVAILABLE" ||
                                      comic.status === "SOLD"
                                    }
                                  />
                                  <img
                                    src={comic.coverImage}
                                    alt={comic.title}
                                    className="w-16 h-24 object-cover"
                                  />
                                  <div className="flex flex-col items-start ml-4 max-w-screen-phone">
                                    <Tooltip
                                      title={
                                        <span className="font-light text-nowrap">
                                          {comic.title}
                                        </span>
                                      }
                                      color="#ccc"
                                      placement="bottom"
                                    >
                                      <Link
                                        to={`/detail/${comic.id}`}
                                        className="font-light"
                                      >
                                        {comic.title}
                                      </Link>
                                    </Tooltip>
                                    <div className="flex flex-row gap-1 font-extralight text-sm italic">
                                      <p>Tác giả:</p>
                                      <p>{comic.author}</p>
                                    </div>
                                    <div className="flex flex-row gap-1 mt-2">
                                      {comic?.edition.isSpecial && (
                                        <span
                                          className={`flex items-center gap-1 px-2 py-1 rounded-2xl bg-red-800 text-white text-xs font-light`}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="10"
                                            height="10"
                                            fill="currentColor"
                                          >
                                            <path d="M10.6144 17.7956C10.277 18.5682 9.20776 18.5682 8.8704 17.7956L7.99275 15.7854C7.21171 13.9966 5.80589 12.5726 4.0523 11.7942L1.63658 10.7219C.868536 10.381.868537 9.26368 1.63658 8.92276L3.97685 7.88394C5.77553 7.08552 7.20657 5.60881 7.97427 3.75892L8.8633 1.61673C9.19319.821767 10.2916.821765 10.6215 1.61673L11.5105 3.75894C12.2782 5.60881 13.7092 7.08552 15.5079 7.88394L17.8482 8.92276C18.6162 9.26368 18.6162 10.381 17.8482 10.7219L15.4325 11.7942C13.6789 12.5726 12.2731 13.9966 11.492 15.7854L10.6144 17.7956ZM4.53956 9.82234C6.8254 10.837 8.68402 12.5048 9.74238 14.7996 10.8008 12.5048 12.6594 10.837 14.9452 9.82234 12.6321 8.79557 10.7676 7.04647 9.74239 4.71088 8.71719 7.04648 6.85267 8.79557 4.53956 9.82234ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899ZM18.3745 19.0469 18.937 18.4883 19.4878 19.0469 18.937 19.5898 18.3745 19.0469Z"></path>
                                          </svg>
                                          {comic?.edition.name}
                                        </span>
                                      )}
                                      {(comic.status === "UNAVAILABLE" ||
                                        comic.status === "SOLD") && (
                                        <span className="text-xs text-red-500">
                                          Truyện này hiện không còn trên hệ
                                          thống chúng tôi
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="text-center">
                                  {comic.price && (
                                    <p className=" flex items-start font-semibold text-red-500 gap-1 justify-center">
                                      {comic.status === "AVAILABLE" ? (
                                        <p>
                                          {CurrencySplitter(comic.price)}{" "}
                                          <span className="text-[0.8em] underline">
                                            đ
                                          </span>
                                        </p>
                                      ) : (
                                        ""
                                      )}
                                    </p>
                                  )}
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
                      className={`w-full mt-4 py-2 bg-black text-white font-semibold rounded-md ${
                        totalPrice === 0 && "cursor-not-allowed opacity-50"
                      }`}
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
    </>
  );
};

export default Cart;
