import React, { useEffect, useState } from "react";
import Car from "../../../../assets/car.png";
import { LinearProgress } from "@mui/material";
import moment from "moment/min/moment-with-locales";
import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import { privateAxios } from "../../../../middleware/axiosInstance";
import { Delivery } from "../../../../common/interfaces/delivery.interface";
moment.locale("vi");
export default function DeliveryProcessInfo({
  firstUserName,
  exchangeDetails,
  secondUserName,
  firstAddress,
  secondAddress,
}: {
  exchangeDetails: ExchangeDetails;
  firstUserName: string;
  secondUserName: string;
  firstAddress: string;
  secondAddress: string;
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
  const deliveryStatus = "Đang giao hàng"; // Thay đổi trạng thái tại đây
  const [status, setStatus] = useState<string>("DELIVERED");
  const formatDate =
    moment(deliveryDetails?.estTime)
      .format("dddd DD/MM")
      .charAt(0)
      .toUpperCase() +
    moment(deliveryDetails?.estTime).format("dddd DD/MM/yyyy").slice(1);
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg REM overflow-hidden">
      <h2 className="text-lg font-bold text-gray-700 mb-4">
        Thông tin giao hàng
      </h2>
      <div className="w-full flex flex-row">
        <div className="w-1/2 flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Người gửi:</h3>
            <p className="font-light">{firstUserName}</p>
            <p className="font-light">{firstAddress}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Người nhận:</h3>
            <p className="font-light">{secondUserName}</p>
            <p className="font-light">{secondAddress}</p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-4">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Trạng thái:</h3>
            <p className="text-blue-600 font-medium p-2 bg-blue-200 w-fit rounded-md">
              {deliveryStatus}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Thời gian dự kiến:</h3>
            <p className="font-light">{formatDate}</p>
          </div>
        </div>
      </div>
      {status === "DELIVERED" ? (
        <button className="w-full bg-sky-700 text-white font-semibold py-2 rounded-md hover:opacity-70 duration-200">
          Đã giao hàng
        </button>
      ) : (
        <div className="mt-5 r">
          <p className="w-full text-center text-sm font-light italic pb-4">
            Trên đường giao hàng đến bạn...
          </p>
          <LinearProgress />
        </div>
      )}
    </div>
  );
}
