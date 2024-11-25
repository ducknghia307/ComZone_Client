/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import moment from "moment/min/moment-with-locales";
import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import { privateAxios } from "../../../../middleware/axiosInstance";
import { Delivery } from "../../../../common/interfaces/delivery.interface";
import SuccessfulOrFailedButton from "./buttons/SuccessfulOrFailedButton";
import { UserInfo } from "../../../../common/base.interface";
import FailedDeliveryButton from "./buttons/FailedDeliveryButton";
import { ExchangeRefundRequest } from "../../../../common/interfaces/refund-request.interface";
import ViewRefundButton from "./buttons/ViewRefundButton";
moment.locale("vi");

export default function DeliveryProcessInfo({
  exchangeDetails,
  firstUser,
  secondUser,
  firstAddress,
  secondAddress,
  fetchExchangeDetails,
  setIsLoading,
}: {
  exchangeDetails: ExchangeDetails;
  firstUser: UserInfo;
  secondUser: UserInfo;
  firstAddress: string;
  secondAddress: string;
  fetchExchangeDetails: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [userDelivery, setUserDelivery] = useState<Delivery>();
  const [refundRequestsList, setRefundRequestsList] = useState<
    ExchangeRefundRequest[]
  >([]);
  const [userRefundRequest, setUserRefundRequest] =
    useState<ExchangeRefundRequest>();

  const exchange = exchangeDetails.exchange;

  const fetchUserDelivery = async () => {
    setIsLoading(true);

    await privateAxios
      .get(`deliveries/exchange/from-user/${exchange.id}`)
      .then((res) => {
        console.log("RES: ", res.data);
        setUserDelivery(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const fetchUserRefundRequest = async () => {
    setIsLoading(true);

    await privateAxios
      .get(`refund-requests/user/exchange/${exchange.id}`)
      .then((res) => {
        setRefundRequestsList(res.data);
        setUserRefundRequest(
          res.data.find((req: ExchangeRefundRequest) => req.mine)
        );
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUserDelivery();
    fetchUserRefundRequest();
  }, [exchangeDetails]);

  const getDeliveryStatus = () => {
    if (userDelivery && userDelivery.overallStatus) {
      switch (userDelivery?.overallStatus) {
        case "PICKING":
          return (
            <p className="text-yellow-500 font-medium p-2 border border-yellow-500 w-fit rounded-md">
              Đang nhận hàng từ người gửi
            </p>
          );
        case "DELIVERING":
          return (
            <p className="text-sky-600 font-medium p-2 border border-sky-600 w-fit rounded-md">
              Đang giao hàng
            </p>
          );
        case "DELIVERED":
          return (
            <p className="text-green-600 font-medium p-2 border border-green-600 w-fit rounded-md">
              Đã giao hàng thành công
            </p>
          );
        case "FAILED":
          return (
            <p className="text-red-600 font-medium p-2 border border-red-600 w-fit rounded-md">
              Giao hàng thất bại
            </p>
          );
      }
    }
  };

  const formatDate =
    moment(userDelivery?.estimatedDeliveryTime)
      .format("dddd DD/MM")
      .charAt(0)
      .toUpperCase() +
    moment(userDelivery?.estimatedDeliveryTime)
      .format("dddd, DD/MM/yyyy")
      .slice(1);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg REM overflow-hidden">
      <h2 className="text-lg font-bold text-gray-700 mb-4">
        Thông tin giao hàng
      </h2>
      <div className="w-full flex flex-row gap-4">
        <div className="grow flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Người gửi:</h3>
            <p className="font-light">{firstUser.name}</p>
            <p className="font-light">{firstAddress}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Người nhận:</h3>
            <p className="font-light">{secondUser.name}</p>
            <p className="font-light">{secondAddress}</p>
          </div>
        </div>

        <div className="basis-1/2 min-w-max flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-800">
              Mã vận đơn: &emsp;{" "}
              <span className="font-light">
                {userDelivery?.deliveryTrackingCode}
              </span>
            </h3>
            <button
              onClick={() =>
                window
                  .open(
                    `https://tracking.ghn.dev/?order_code=${userDelivery?.deliveryTrackingCode}`,
                    "_blank"
                  )
                  ?.focus()
              }
              className="flex items-center gap-2 px-2 py-1 rounded-md border border-gray-400 text-xs duration-200 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
              </svg>
              Theo dõi giao hàng
            </button>
          </div>

          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-800">Trạng thái:</h3>

            {getDeliveryStatus()}
          </div>

          <div
            className={`${
              (userDelivery?.overallStatus === "DELIVERED" ||
                userDelivery?.overallStatus === "FAILED") &&
              "hidden"
            } flex items-center gap-4`}
          >
            <h3 className="font-semibold text-gray-800">Thời gian dự kiến:</h3>
            <p className="font-light">{formatDate}</p>
          </div>
        </div>
      </div>

      {userDelivery?.overallStatus === "DELIVERED" ? (
        !userRefundRequest ? (
          <SuccessfulOrFailedButton
            exchange={exchangeDetails.exchange}
            fetchExchangeDetails={fetchExchangeDetails}
            setIsLoading={setIsLoading}
          />
        ) : (
          <ViewRefundButton
            refundRequest={userRefundRequest}
            requestsList={refundRequestsList}
          />
        )
      ) : userDelivery?.overallStatus === "FAILED" ? (
        <FailedDeliveryButton />
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
