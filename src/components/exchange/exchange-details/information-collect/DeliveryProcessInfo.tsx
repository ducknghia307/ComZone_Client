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
import { Avatar, Checkbox, message, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import TimerCountdown from "./TimerCountdown";
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

  const [uploadedImagesFile, setUploadedImagesFile] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [confirmSubmitImages, setConfirmSubmitImages] =
    useState<boolean>(false);

  const exchange = exchangeDetails.exchange;

  const fetchReceiveDelivery = async () => {
    setIsLoading(true);

    await privateAxios
      .get(`deliveries/exchange/to-user/${exchange.id}`)
      .then(async (res) => {
        const delivery: Delivery = res.data;
        setReceiveDelivery(delivery);
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
        setSendDelivery(delivery);

        if (!delivery.deliveryTrackingCode) setIsShowingReceivedDelivery(false);
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

  const handlePackagingImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      fileArray.map((file, index) => {
        if (index + uploadedImagesFile.length < 4) {
          const url = URL.createObjectURL(file);
          setPreviewImages((prev) => [...prev, url]);
          setUploadedImagesFile((prev) => [...prev, file]);
        }
      });
    }
  };

  const handleRemovePreviewChapterImage = (index: number) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
    setUploadedImagesFile(uploadedImagesFile.filter((_, i) => i !== index));
  };

  const handleSubmitPackagingImages = async () => {
    setIsLoading(true);

    const imagesList: string[] = [];
    if (uploadedImagesFile.length > 0) {
      await Promise.all(
        uploadedImagesFile.map(async (file) => {
          await privateAxios
            .post(
              "/file/upload/image",
              {
                image: file,
              },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => imagesList.push(res.data.imageUrl))
            .catch((err) => console.log(err));
        })
      );
    } else return;

    await privateAxios
      .patch(`deliveries/packaging-images/${sendDelivery.id}`, {
        packagingImages: imagesList,
      })
      .then(() => {
        fetchSendDelivery();
        notification.success({
          key: "packaging-images",
          message: <p className="REM">Đơn hàng đã được bắt đầu</p>,
          description: (
            <p className="REM">
              Hệ thống đã liên hệ với bên giao hàng để tiến hành bắt đầu xử lý
              đơn hàng gửi đi của bạn. Bạn sẽ nhận được thông báo trước khi nhân
              viên giao hàng của chúng tôi đến.
            </p>
          ),
          duration: 8,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

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

  if (isShowingReceivedDelivery && !receiveDelivery) return;

  if (!isShowingReceivedDelivery && !sendDelivery) return;

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

        {(isShowingReceivedDelivery && receiveDelivery.deliveryTrackingCode) ||
        (!isShowingReceivedDelivery && sendDelivery.deliveryTrackingCode) ? (
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
        ) : (
          <div className="basis-1/2 flex flex-col">
            <p className="text-xl font-semibold">TIẾN HÀNH ĐÓNG GÓI</p>

            {!isShowingReceivedDelivery && (
              <div className="flex items-center justify-between gap-2 my-2">
                <p className="flex items-center gap-1 font-light text-sm">
                  Thời hạn:&ensp;
                  <span className="text-base font-semibold">72 giờ</span>
                  (sau khi thanh toán)
                </p>
                <span className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <p className="text-sm font-light">Còn lại:</p>
                  <TimerCountdown
                    targetDate={sendDelivery?.expiredAt || new Date()}
                    exchange={exchange}
                    fetchExchangeDetails={fetchExchangeDetails}
                  />
                </span>
              </div>
            )}

            {!isShowingReceivedDelivery ? (
              <div>
                <p className="text-sm font-light">
                  Chụp truyện bạn gửi đi và tình trạng đóng gói của truyện, sau
                  đó tải lên hệ thống để quá trình giao hàng được bắt đầu.{" "}
                  <span className="text-red-600">*</span>
                </p>

                <p className="text-sm text-red-600 font-light italic leading-tight">
                  Ảnh này sẽ được hệ thống sử dụng cho mục đích xử lý yêu cầu
                  hoàn, đền tiền nếu xảy ra.
                </p>

                <div className="grid grid-cols-4 items-stretch gap-2 mt-2">
                  {previewImages.map((imgUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imgUrl}
                        alt={`preview chapter ${index}`}
                        className="aspect-[2/3] object-cover transition-opacity duration-200 ease-in-out group-hover:opacity-80 rounded-md border border-gray-300 p-1"
                      />
                      <button
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => handleRemovePreviewChapterImage(index)}
                      >
                        <DeleteOutlined style={{ fontSize: 16 }} />
                      </button>
                    </div>
                  ))}
                  {uploadedImagesFile.length < 4 && (
                    <button
                      className="aspect-[2/3] p-4 bg-gray-100 border border-gray-300 hover:opacity-75 duration-200 rounded-lg flex flex-col items-center justify-center gap-2"
                      onClick={() =>
                        document.getElementById("previewChapterUpload")?.click()
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="32"
                        height="32"
                        fill="currentColor"
                      >
                        <path d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8284L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z"></path>
                      </svg>
                      <p className="text-nowrap">Thêm ảnh</p>
                      <p className="text-xs font-light">(Tối đa 4 ảnh)</p>
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/png, image/gif, image/jpeg"
                        onChange={handlePackagingImageChange}
                        id="previewChapterUpload"
                      />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 font-light mt-4">
                  <Checkbox
                    checked={confirmSubmitImages}
                    onChange={() => {
                      if (uploadedImagesFile.length === 0) {
                        message.warning({
                          key: "confirm",
                          content: (
                            <p className="REM">
                              Vui lòng tải ảnh lên trước khi xác nhận!
                            </p>
                          ),
                          duration: 5,
                        });
                        return;
                      }
                      setConfirmSubmitImages(!confirmSubmitImages);
                    }}
                  />
                  Xác nhận hình ảnh truyện và trạng thái đóng gói
                </div>

                <p className="text-sm font-light text-red-600 italic">
                  Lưu ý: Hình ảnh đóng gói sẽ không thể được cập nhật hay chỉnh
                  sửa sau khi đã xác nhận bàn giao. Vui lòng kiểm tra trước khi
                  sử dụng ảnh!
                </p>

                <button
                  disabled={
                    uploadedImagesFile.length === 0 || !confirmSubmitImages
                  }
                  onClick={handleSubmitPackagingImages}
                  className="self-stretch w-full bg-sky-800 mt-2 p-2 rounded-md text-white font-semibold duration-200 hover:bg-sky-900 disabled:bg-gray-300"
                >
                  SẴN SÀNG BÀN GIAO
                </button>
              </div>
            ) : (
              <p className="w-full text-center pt-4 font-semibold italic">
                <Avatar src={receiveDelivery.from.user.avatar} alt="" />{" "}
                {receiveDelivery.from.user.name}{" "}
                <span className="font-light">
                  đang tiến hành đóng gói và xác nhận gửi truyện.
                </span>
              </p>
            )}
          </div>
        )}
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
