import { ExchangeDetails } from "../../../common/interfaces/exchange.interface";
import { Comic, UserInfo } from "../../../common/base.interface";
import CurrencySplitter from "../../../assistants/Spliter";
import DeliveryProgression from "./progress/DeliveryProgression";

export default function ExchangeInformation({
  exchangeDetails,
  firstUser,
  firstComicsGroup,
  secondComicsGroup,
}: {
  exchangeDetails: ExchangeDetails;
  firstUser: UserInfo | null;
  secondUser: UserInfo | null;
  firstComicsGroup: Comic[];
  secondComicsGroup: Comic[];
}) {
  return (
    <div className="w-full h-full flex flex-col gap-8 py-4 relative">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold uppercase pb-2">
          THÔNG TIN TRAO ĐỔI
        </p>

        <div className="flex items-center justify-between text-sm font-light">
          <p>Tổng số truyện của bạn:</p>
          <p className="font-semibold">{firstComicsGroup?.length}</p>
        </div>
        <div className="flex items-center justify-between text-sm font-light">
          <p>Tổng số truyện bạn có sau trao đổi:</p>
          <p className="font-semibold">{secondComicsGroup?.length}</p>
        </div>

        {exchangeDetails.exchange.depositAmount && (
          <div className="flex items-center justify-between text-sm font-light mt-4">
            <p>Giá trị tiền cọc:</p>
            <p className="font-semibold">
              {CurrencySplitter(exchangeDetails.exchange.depositAmount || 0)} đ
            </p>
          </div>
        )}

        {exchangeDetails.exchange.compensationAmount && (
          <div className="flex items-center justify-between text-sm font-light">
            <p>Giá trị tiền bù:</p>
            <p
              className={`${
                exchangeDetails.exchange.compensateUser?.id === firstUser?.id
                  ? "text-red-600"
                  : "text-green-600"
              } font-semibold`}
            >
              {exchangeDetails.exchange.compensationAmount &&
                exchangeDetails.exchange.compensationAmount > 0 &&
                (exchangeDetails.isRequestUser ? "+ " : "- ")}
              {CurrencySplitter(exchangeDetails.exchange.compensationAmount)} đ
            </p>
          </div>
        )}
      </div>

      {(exchangeDetails.exchange.status === "DELIVERING" ||
        exchangeDetails.exchange.status === "DELIVERED") && (
        <div className="flex flex-col gap-8">
          <p className="text-lg font-semibold uppercase">THÔNG TIN GIAO HÀNG</p>
          
        </div>
      )}

      <div className="w-full absolute bottom-2 flex items-stretch gap-1">
        <button className="grow gap-2 bg-sky-700 text-white py-2 rounded-md duration-200 hover:bg-sky-800">
          XEM TRUYỆN TRAO ĐỔI
        </button>
        <button className="px-4 bg-red-700 text-white rounded-md duration-200 hover:bg-red-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
