import React from "react";
import CurrencySplitter from "../../assistants/Spliter";
import DeliveryMethod from "./DeliveryMethod";
import { Address, Comic } from "../../common/base.interface";

interface SellerGroup {
  sellerName: string;
  comics: { comic: Comic; quantity: number; currentPrice?: number }[];
  delivery?: {
    cost: number;
    estDeliveryTime: Date;
  };
}

interface SellerGroupDetails {
  sellerId: string;
  deliveryFee: number;
  estDeliveryTime: Date;
  address?: Address;
}

interface OrderCheckProps {
  groupedSelectedComics: Record<string, SellerGroup>;
  deliveryDetails: SellerGroupDetails[];
  notes: Record<string, string>;
  setNotes: (notes: Record<string, string>) => void;
}

const OrderCheck: React.FC<OrderCheckProps> = ({
  groupedSelectedComics,
  deliveryDetails,
  notes,
  setNotes,
}) => {
  const handleNoteChange = (sellerId: string, note: string) => {
    setNotes({ ...notes, [sellerId]: note });
  };
  console.log({ deliveryDetails });
  return (
    <div className="w-full flex flex-col gap-2">
      {Object.keys(groupedSelectedComics).map((sellerId) => {
        const seller = groupedSelectedComics[sellerId];
        const deliveryFee =
          deliveryDetails.find((d) => d.sellerId === sellerId)?.deliveryFee ||
          0;
        const estDeliveryTime =
          deliveryDetails.find((d) => d.sellerId === sellerId)
            ?.estDeliveryTime || new Date();

        const sellerTotalPrice =
          seller.comics.reduce((acc, { comic, currentPrice }) => {
            const price = currentPrice || comic.price; // Use currentPrice if available, otherwise fallback to comic.price
            return acc + Number(price);
          }, 0) + deliveryFee;

        // const orderNote = notes[sellerId] || "";
        return (
          <div key={sellerId} className="bg-white w-full px-8 py-4 rounded-lg">
            <div className="w-full flex items-center gap-8 border-b pb-2 mb-4">
              <div className="flex flex-row items-center">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                </svg>
                <h3 className="font-medium ml-2">{seller.sellerName}</h3>
              </div>
            </div>
            <table className="w-full table-fixed">
              <thead>
                <tr className="text-sm">
                  <th className="text-start">Sản phẩm</th>
                  <th className="text-end hidden lg:table-cell">Số lượng</th>
                  <th className="text-end">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {seller.comics.map(({ comic, currentPrice }) => (
                  <tr key={comic?.id} className="px-2 py-4 text-sm">
                    <td className="flex flex-row items-center justify-start my-2 gap-4 w-full lg:max-w-[35rem]">
                      <img
                        src={comic?.coverImage}
                        alt={comic?.title}
                        className="h-20 lg:h-32 aspect-[2/3] object-cover rounded"
                      />
                      <h4 className="">{comic?.title}</h4>
                    </td>
                    <td className="hidden lg:table-cell lg:max-w-[12rem]">
                      <h4 className="text-end font-light justify-center">
                        {comic?.quantity === 1
                          ? "Truyện lẻ"
                          : `Bộ ${comic?.quantity} cuốn`}
                      </h4>
                    </td>
                    <td className="lg:max-w-[12rem]">
                      <h4 className="text-end font-light">
                        {CurrencySplitter(currentPrice || comic?.price)} &#8363;
                      </h4>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <DeliveryMethod
              deliveryPrice={deliveryFee}
              estDeliveryTime={estDeliveryTime}
              note={notes[sellerId] || ""}
              onNoteChange={(note) => handleNoteChange(sellerId, note)}
            />
            <div className="flex flex-row items-center justify-end w-full py-2 gap-2">
              <h4 className="font-extralight">Tổng tiền:</h4>
              <h4 className="font-semibold text-lg text-cyan-700">
                {CurrencySplitter(sellerTotalPrice)} &#8363;
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderCheck;
