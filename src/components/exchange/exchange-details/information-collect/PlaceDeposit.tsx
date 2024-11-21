import { useEffect, useState } from "react";
import CurrencySplitter from "../../../../assistants/Spliter";
import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import { privateAxios } from "../../../../middleware/axiosInstance";
import { Delivery } from "../../../../common/interfaces/delivery.interface";
import moment from "moment/min/moment-with-locales";
import PayButton from "./buttons/PayButton";

moment.locale("vi");

export default function PlaceDeposit({
  exchangeDetails,
}: {
  exchangeDetails: ExchangeDetails;
}) {
  const [deliveryDetails, setDeliveryDetails] = useState<{
    fee: number;
    estTime: Date;
  }>();
  const [total, setTotal] = useState(0);

  const exchange = exchangeDetails.exchange;

  const fetchDeliveryFeeAndDeliveryTime = async () => {
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
                (exchangeDetails.isRequestUser
                  ? 0
                  : exchange.compensationAmount)
            );
          })
          .catch((err) => console.log(err));
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
    <div className="w-1/3 flex flex-col items-stretch justify-start gap-4 mx-auto">
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

        <div
          className={`flex items-center justify-between text-xs font-light px-4 ${
            exchangeDetails.exchange.compensationAmount === 0 && "opacity-30"
          }`}
        >
          <p>Tổng tiền bù:</p>
          <p className={`font-semibold`}>
            {CurrencySplitter(exchangeDetails.exchange.compensationAmount || 0)}{" "}
            đ
          </p>
        </div>
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

      <PayButton total={total} />
      <p className="text-[0.65em] font-light italic">
        Chúng tôi chỉ hỗ trợ hình thức thanh toán bằng Ví ComZone để đảm bảo
        quyền lợi cho người tham gia trao đổi.
      </p>
    </div>
  );
}
