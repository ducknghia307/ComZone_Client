/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { useEffect, useState } from "react";
import CurrencySplitter from "../../../../assistants/Spliter";
import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import { privateAxios } from "../../../../middleware/axiosInstance";
import { Delivery } from "../../../../common/interfaces/delivery.interface";
import moment from "moment/min/moment-with-locales";
import PayButton from "./buttons/PayButton";
import { UserInfo } from "../../../../common/base.interface";

moment.locale("vi");

export default function PlaceDeposit({
  exchangeDetails,
  firstAddress,
  secondAddress,
  firstUser,
  secondUser,
  fetchExchangeDetails,
  setIsLoading,
}: {
  exchangeDetails: ExchangeDetails;
  firstAddress: string;
  secondAddress: string;
  firstUser: UserInfo;
  secondUser: UserInfo;
  fetchExchangeDetails: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [deliveryDetails, setDeliveryDetails] = useState<{
    fee: number;
    estTime: Date;
  }>();
  const [total, setTotal] = useState(0);

  const exchange = exchangeDetails.exchange;

  const fetchDeliveryFeeAndDeliveryTime = async () => {
    setIsLoading(true);

    await privateAxios
      .get(`deliveries/exchange/from-user/${exchange.id}`)
      .then(async (res) => {
        const userDelivery: Delivery = res.data;
        await privateAxios
          .get(`deliveries/details/${userDelivery.id}`)
          .then((res) => {
            setDeliveryDetails({
              fee: res.data.deliveryFee,
              estTime: res.data.estDeliveryTime,
            });

            setTotal(
              exchange.depositAmount! +
                res.data.deliveryFee +
                (exchangeDetails.exchange.compensateUser &&
                exchangeDetails.exchange.compensateUser.id === firstUser.id
                  ? exchange.compensationAmount
                  : 0)
            );
          })
          .catch((err) => console.log(err))
          .finally(() => setIsLoading(false));
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDeliveryFeeAndDeliveryTime();
  }, [exchangeDetails]);

  const formatDate =
    moment(deliveryDetails?.estTime)
      .format("dddd DD/MM")
      .charAt(0)
      .toUpperCase() +
    moment(deliveryDetails?.estTime).format("dddd DD/MM/yyyy").slice(1);

  return (
    <div className="w-ful flex flex-row gap-5 REM px-10">
      <div className="w-1/2 flex flex-col gap-4 mr-2 border-r pr-2">
        <h2 className="text-xl font-semibold">Địa chỉ </h2>
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M10 13H14M19 9V20H5V9M19 9H5M19 9C19.5523 9 20 8.55228 20 8V5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V8C4 8.55228 4.44772 9 5 9"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
            <h2 className="text-base font-semibold">Người gửi:</h2>
          </div>
          <div className="mt-2 flex flex-col gap-2 font-light">
            <p>
              Tên người gửi:{" "}
              <span className="font-medium">{firstUser.name}</span>
            </p>
            <h2>
              Địa chỉ: <span className="font-medium">{firstAddress}</span>
            </h2>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 mt-4">
          <div className="flex flex-row gap-2 items-center">
            <svg
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              height={24}
              width={24}
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path d="M0 0h48v48H0z" fill="none"></path>{" "}
                <g id="Shopicon">
                  {" "}
                  <path d="M40,26.294V8c0-2.2-1.8-4-4-4H12C9.8,4,8,5.8,8,8v16.344C7.44,24.542,6.9,24.826,6.399,25.2 c-2.646,1.984-3.185,5.753-1.199,8.4C5.519,34.025,13.131,44,24,44h20V32C44,29.722,42.498,27.724,40,26.294z M8.4,31.2 c-0.662-0.882-0.482-2.139,0.397-2.8c0.36-0.27,0.783-0.399,1.201-0.399c0.608,0,1.207,0.274,1.596,0.791 C11.647,28.864,17.026,36,24,36h8v-2h0h0v-2h-8c-1.229,0-2.46-0.385-3.61-0.962C21.518,29.573,25.025,28,30,28 c6.104,0,10,2.369,10,4v8h-2H24C15.107,40,8.669,31.559,8.4,31.2z M26,8v4h-4V8H26z M18,8v8h12V8h6v16.728 C34.198,24.263,32.176,24,30,24c-5.952,0-10.813,1.913-12.9,4.777c-1.05-0.914-1.862-1.813-2.3-2.379 c-0.737-0.981-1.72-1.67-2.8-2.05V8H18z"></path>{" "}
                </g>{" "}
              </g>
            </svg>
            <h2 className="text-base font-semibold">Người nhận:</h2>
          </div>
          <div className="mt-2 flex flex-col gap-2 font-light">
            <p>
              Tên người nhận:{" "}
              <span className="font-medium">{secondUser.name}</span>
            </p>
            <h2>
              Địa chỉ: <span className="font-medium">{secondAddress}</span>
            </h2>
          </div>
        </div>
      </div>
      <div className="w-1/2 flex flex-col items-stretch justify-start gap-4 mx-auto">
        <p className="text-lg font-semibold">Tổng số tiền cần thanh toán:</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M16.0503 12.0498L21 16.9996L16.0503 21.9493L14.636 20.5351L17.172 17.9988L4 17.9996V15.9996L17.172 15.9988L14.636 13.464L16.0503 12.0498ZM7.94975 2.0498L9.36396 3.46402L6.828 5.9988L20 5.99955V7.99955L6.828 7.9988L9.36396 10.5351L7.94975 11.9493L3 6.99955L7.94975 2.0498Z"></path>
            </svg>
            <p className="font-semibold text-sm">Trao đổi</p>
          </div>

          <div className="flex items-center justify-between text-xs font-light px-4">
            <p>Tổng tiền cọc:</p>
            <p className="font-semibold">
              {CurrencySplitter(exchangeDetails.exchange.depositAmount || 0)} đ
            </p>
          </div>

          {exchangeDetails.exchange.compensateUser &&
            exchangeDetails.exchange.compensateUser.id === firstUser.id && (
              <div
                className={`relative flex items-center justify-between text-xs font-light px-4 ${
                  exchangeDetails.exchange.compensationAmount === 0 &&
                  "opacity-30"
                }`}
              >
                <p>Tổng tiền bù:</p>
                <p className="font-semibold">
                  {CurrencySplitter(
                    exchangeDetails.exchange.compensationAmount || 0
                  )}{" "}
                  đ
                </p>
              </div>
            )}
        </div>

        <div className="flex flex-col gap-2 pb-2 border-b border-gray-400">
          <div className="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M8.96456 18C8.72194 19.6961 7.26324 21 5.5 21C3.73676 21 2.27806 19.6961 2.03544 18H1V6C1 5.44772 1.44772 5 2 5H16C16.5523 5 17 5.44772 17 6V8H20L23 12.0557V18H20.9646C20.7219 19.6961 19.2632 21 17.5 21C15.7368 21 14.2781 19.6961 14.0354 18H8.96456ZM15 7H3V15.0505C3.63526 14.4022 4.52066 14 5.5 14C6.8962 14 8.10145 14.8175 8.66318 16H14.3368C14.5045 15.647 14.7296 15.3264 15 15.0505V7ZM17 13H21V12.715L18.9917 10H17V13ZM17.5 19C18.1531 19 18.7087 18.5826 18.9146 18C18.9699 17.8436 19 17.6753 19 17.5C19 16.6716 18.3284 16 17.5 16C16.6716 16 16 16.6716 16 17.5C16 17.6753 16.0301 17.8436 16.0854 18C16.2913 18.5826 16.8469 19 17.5 19ZM7 17.5C7 16.6716 6.32843 16 5.5 16C4.67157 16 4 16.6716 4 17.5C4 17.6753 4.03008 17.8436 4.08535 18C4.29127 18.5826 4.84689 19 5.5 19C6.15311 19 6.70873 18.5826 6.91465 18C6.96992 17.8436 7 17.6753 7 17.5Z"></path>
            </svg>
            <p className="font-semibold text-sm">Vận chuyển</p>
          </div>
          <div className="flex items-center justify-between text-xs font-light px-4">
            <p>Phí giao hàng:</p>
            <p className="font-semibold">
              {CurrencySplitter(deliveryDetails?.fee || 0)} đ
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-light px-4 italic">
            <p>Ngày nhận hàng dự kiến:</p>
            <p className="">{formatDate}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4">
          <p className="font-light">Tổng tiền:</p>
          <p className="font-semibold text-red-600">
            {CurrencySplitter(total)} đ
          </p>
        </div>

        <PayButton
          total={total}
          exchangeId={exchangeDetails.exchange.id}
          fetchExchangeDetails={fetchExchangeDetails}
          setIsLoading={setIsLoading}
        />
        <p className="text-[0.65em] font-light italic">
          Chúng tôi chỉ hỗ trợ hình thức thanh toán bằng Ví ComZone để đảm bảo
          quyền lợi cho người tham gia trao đổi.
        </p>
      </div>
    </div>
  );
}
