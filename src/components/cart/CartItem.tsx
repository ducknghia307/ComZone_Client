import React, { useState } from "react";
import CurrencySplitter from "../assistants/Spliter";
interface CartItemProps {
  title: string;
  author: string;
  cover_image: string;
  price: number;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({
  title,
  author,
  cover_image,
  price,
  quantity: initialQuantity,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <input type="checkbox" className="mr-4 h-5 w-5" />
      <img src={cover_image} alt={title} className="w-16 h-16 object-cover" />
      <div className="flex-1 ml-4">
        <h4 className="font-medium">{title}</h4>
      </div>
      <div className="flex flex-row items-center border border-gray-300 rounded-xl">
        <button onClick={handleDecrease} className="px-2   text-gray-600">
          -
        </button>
        <div className="px-1.5 py-1 w-8 text-center">{quantity}</div>
        <button onClick={handleIncrease} className="px-2  text-gray-600">
          +
        </button>
      </div>
      <div className="font-medium text-red-500">
        {CurrencySplitter(price)} đ
      </div>
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
    </div>
  );
};

export default CartItem;
