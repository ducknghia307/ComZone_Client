import { useEffect, useState } from "react";
import { Comic } from "../../../common/base.interface";
import CurrencySplitter from "../../../assistants/Spliter";

interface ComicsBillingSectionProps {
  currentComics: Comic | undefined;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  isInCart: boolean;
}

export default function ComicsBillingSection({
  currentComics,
  handleAddToCart,
  handleBuyNow,
  isInCart,
}: ComicsBillingSectionProps) {
  const [addedToCart, toggleAddedToCart] = useState<boolean>(isInCart);
  useEffect(() => {
    toggleAddedToCart(isInCart);
  }, [isInCart]);
  return (
    <div>
      <div className="w-full flex flex-col gap-2 py-4">
        <div className="w-full flex items-center justify-between">
          <p>Số lượng:</p>
          <p className="font-semibold">{currentComics?.quantity}</p>
        </div>
        <div className="w-full flex flex-col items-start justify-between">
          <p>Tạm tính:</p>
          <p className="font-semibold text-[2em] flex items-start gap-1">
            {currentComics?.price ? CurrencySplitter(currentComics?.price) : ""}
            <span className="font-light text-[0.5em] underline">đ</span>
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <button
          className="w-full px-4 py-2 bg-red-500 rounded-md text-white text-[1.2em] duration-200 hover:bg-red-600"
          onClick={() => handleBuyNow()}
        >
          MUA NGAY
        </button>
        <button
          className={`w-full flex items-center justify-center gap-4 px-4 py-2 border ${
            addedToCart
              ? "bg-green-600 text-white hover:bg-green-700 duration-200"
              : "border-gray-400 hover:bg-gray-100 duration-500"
          }  rounded-md text-[1.2em]`}
          onClick={() => {
            handleAddToCart();
            toggleAddedToCart(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            {addedToCart ? (
              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z"></path>
            ) : (
              <path d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"></path>
            )}
          </svg>
          {!addedToCart && "THÊM VÀO GIỎ HÀNG"}
        </button>
      </div>
    </div>
  );
}
