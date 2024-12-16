/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import moment from "moment/min/moment-with-locales";
import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import { privateAxios } from "../../../../middleware/axiosInstance";
import {
  Delivery,
  DeliveryOverallStatus,
} from "../../../../common/interfaces/delivery.interface";
import SuccessfulOrFailedButton from "./buttons/SuccessfulOrFailedButton";
import { UserInfo } from "../../../../common/base.interface";
import FailedDeliveryButton from "./buttons/FailedDeliveryButton";
import { RefundRequest } from "../../../../common/interfaces/refund-request.interface";
import ViewRefundButton from "./buttons/ViewRefundButton";
import { notification } from "antd";
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
  const [isShowingReceivedDelivery, setIsShowingReceivedDelivery] =
    useState(true);
  const [receiveDelivery, setReceiveDelivery] = useState<Delivery>();
  const [sendDelivery, setSendDelivery] = useState<Delivery>();
  const [refundRequestsList, setRefundRequestsList] = useState<RefundRequest[]>(
    []
  );
  const [userRefundRequest, setUserRefundRequest] = useState<RefundRequest>();

  const exchange = exchangeDetails.exchange;

  const fetchReceiveDelivery = async () => {
    setIsLoading(true);

    await privateAxios
      .get(`deliveries/exchange/to-user/${exchange.id}`)
      .then(async (res) => {
        const delivery: Delivery = res.data;
        if (delivery.deliveryTrackingCode) setReceiveDelivery(delivery);
        else await attemptToRegisterGHN(delivery.id);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const fetchSendDelivery = async () => {
    setIsLoading(true);

    await privateAxios
      .get(`deliveries/exchange/from-user/${exchange.id}`)
      .then(async (res) => {
        const delivery: Delivery = res.data;
        if (delivery.deliveryTrackingCode) setSendDelivery(delivery);
        else await attemptToRegisterGHN(delivery.id);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const attemptToRegisterGHN = async (deliveryId: string) => {
    await privateAxios
      .post(`deliveries/attempt/register/${deliveryId}`)
      .then(() => {
        fetchExchangeDetails();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.code === 400)
          notification.error({
            key: "error",
            message: err.response.data.code_message_value,
            description: err.response.data.message,
            duration: 5,
          });
      });
  };

  const fetchUserRefundRequest = async () => {
    setIsLoading(true);

    await privateAxios
      .get(`refund-requests/user/exchange/${exchange.id}`)
      .then((res) => {
        setRefundRequestsList(res.data);
        setUserRefundRequest(res.data.find((req: RefundRequest) => req.mine));
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReceiveDelivery();
    fetchSendDelivery();
    fetchUserRefundRequest();
  }, [exchangeDetails]);

  const getDeliveryStatus = (delivery: Delivery) => {
    if (delivery && delivery.overallStatus) {
      switch (delivery.overallStatus) {
        case "PICKING":
          return (
            <p className="text-yellow-500 font-medium p-2 border border-yellow-500 w-fit rounded-md">
              {isShowingReceivedDelivery
                ? "Đang nhận hàng từ người gửi"
                : "Đang nhận hàng từ bạn"}
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

  const formatDate = (delivery: Delivery) => {
    return (
      moment(delivery.estimatedDeliveryTime)
        .format("dddd DD/MM")
        .charAt(0)
        .toUpperCase() +
      moment(delivery.estimatedDeliveryTime).format("dddd, DD/MM/yyyy").slice(1)
    );
  };

  const isDeliveryCompleted = (delivery: Delivery) => {
    return [
      DeliveryOverallStatus.DELIVERED,
      DeliveryOverallStatus.FAILED,
      DeliveryOverallStatus.RETURN,
    ].includes(delivery.overallStatus);
  };

  if (
    (isShowingReceivedDelivery && !receiveDelivery) ||
    (!isDeliveryCompleted && !sendDelivery)
  )
    return;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg REM overflow-hidden border">
      <div className="flex items-center justify-between gap-4 pr-4 mb-4">
        <h2 className="text-xl text-gray-700 font-bold uppercase">
          Thông tin giao hàng (
          {isShowingReceivedDelivery ? "Đơn nhận" : "Đơn gửi"})
        </h2>

        <button
          onClick={() =>
            setIsShowingReceivedDelivery(!isShowingReceivedDelivery)
          }
          className="underline rounded-md text-sm px-4 py-2 uppercase duration-200 hover:font-semibold"
        >
          {isShowingReceivedDelivery ? "Xem đơn gửi" : "Xem đơn nhận"}
        </button>
      </div>

      <div className="w-full flex flex-row gap-4">
        <div className="grow flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">
              Người gửi {!isShowingReceivedDelivery && "(Bạn)"}:
            </h3>
            <p className="font-light">
              {isShowingReceivedDelivery ? secondUser.name : firstUser.name}
            </p>
            <p className="font-light">
              {isShowingReceivedDelivery ? secondAddress : firstAddress}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">
              Người nhận {isShowingReceivedDelivery && "(Bạn)"}:
            </h3>
            <p className="font-light">
              {isShowingReceivedDelivery ? firstUser.name : secondUser.name}
            </p>
            <p className="font-light">
              {isShowingReceivedDelivery ? firstAddress : secondAddress}
            </p>
          </div>
        </div>

        <div className="basis-1/2 min-w-max flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-800">
              Mã vận đơn: &emsp;{" "}
              <span className="font-light">
                {isShowingReceivedDelivery
                  ? receiveDelivery.deliveryTrackingCode
                  : sendDelivery.deliveryTrackingCode}
              </span>
            </h3>
            <button
              onClick={() =>
                window
                  .open(
                    `https://tracking.ghn.dev/?order_code=${
                      isShowingReceivedDelivery
                        ? receiveDelivery.deliveryTrackingCode
                        : sendDelivery.deliveryTrackingCode
                    }`,
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

            {getDeliveryStatus(
              isShowingReceivedDelivery ? receiveDelivery : sendDelivery
            )}
          </div>

          {!isDeliveryCompleted(
            isShowingReceivedDelivery ? receiveDelivery : sendDelivery
          ) && (
            <div className={`flex items-center gap-4`}>
              <h3 className="font-semibold text-gray-800">
                Thời gian dự kiến:
              </h3>
              <p className="font-light">
                {formatDate(
                  isShowingReceivedDelivery ? receiveDelivery : sendDelivery
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {isShowingReceivedDelivery &&
        (receiveDelivery.overallStatus === "DELIVERED" ? (
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
        ) : receiveDelivery.overallStatus === "FAILED" ? (
          <FailedDeliveryButton />
        ) : (
          <div
            className={`${
              (!receiveDelivery || !receiveDelivery.deliveryTrackingCode) &&
              "hidden"
            } mt-5 r`}
          >
            <p className="w-full text-center text-sm font-light italic pb-4">
              Trên đường giao hàng đến bạn...
            </p>
            <LinearProgress />
          </div>
        ))}
    </div>
  );
}
