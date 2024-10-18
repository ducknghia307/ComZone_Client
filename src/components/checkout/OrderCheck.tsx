import React from "react";
import CurrencySplitter from "../assistants/Spliter";

interface Comic {
  id: string;
  title: string;
  price: number; // Assuming price is a number
  quantity: number;
  coverImage: string[];
}

interface OrderCheckProps {
  selectedComics: Comic[];
  totalPrice: number;
}

const OrderCheck: React.FC<OrderCheckProps> = ({
  selectedComics,
  totalPrice,
}) => {
  return (
    <div className="w-full px-8 py-4 bg-white">
      <div className="w-full flex flex-col">
        <h2 className="font-bold">KIỂM TRA LẠI ĐƠN HÀNG</h2>
        <table className="w-full mt-4">
          <tbody>
            {selectedComics.map((comic) => (
              <tr key={comic.id} className="border-t px-2 py-4">
                <td>
                  <img
                    src={comic.coverImage[0]}
                    alt={comic.title}
                    className="h-40 w-auto my-2"
                  />
                </td>
                <td>
                  <h4 className="max-w-full">{comic.title}</h4>
                </td>
                <td>
                  <h4 className="text-center">{comic.price}đ</h4>
                </td>
                <td>
                  <h4 className="text-center">{comic.quantity}</h4>
                </td>
                <td>
                  <h4 className="text-yellow-400 text-center">
                    {CurrencySplitter(comic.price * comic.quantity)}đ
                  </h4>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-end w-full py-4 gap-2 border-b-2">
        <h4 className="font-bold">Tổng số tiền:</h4>
        <h4 className="font-light">{CurrencySplitter(totalPrice)}đ</h4>
      </div>
    </div>
  );
};

export default OrderCheck;
