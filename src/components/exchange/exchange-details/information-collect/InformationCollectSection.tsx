/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from "antd";
import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import ViewBothComicsLists from "./ViewBothComicsLists";
import SubmitAmounts from "./SubmitAmounts";
import SubmitDeliveryInfo from "./SubmitDeliveryInfo";
import PlaceDeposit from "./PlaceDeposit";
import DeliveryProcessInfo from "./DeliveryProcessInfo";
import SuccessfulExchange from "./SuccessfulExchange";
import { Address } from "../../../../common/base.interface";
import DealsInformation from "./DealsInformation";
import { ExchangeRefundRequest } from "../../../../common/interfaces/refund-request.interface";
import { useEffect, useState } from "react";
import { privateAxios } from "../../../../middleware/axiosInstance";
import ViewRefundButton from "./buttons/ViewRefundButton";

export default function InformationCollectSection({
  exchangeDetails,
  firstCurrentStage,
  secondCurrentStage,
  fetchExchangeDetails,
  selectedAddress,
  setSelectedAddress,
  addresses,
  setAddresses,
  fetchUserAddress,
  firstAddress,
  secondAddress,
  setIsLoading,
}: {
  exchangeDetails: ExchangeDetails;
  firstCurrentStage: number;
  secondCurrentStage: number;
  fetchExchangeDetails: () => void;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  addresses: Address[];
  setAddresses: (list: Address[]) => void;
  fetchUserAddress: () => void;
  firstAddress: string;
  secondAddress: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  console.log(firstCurrentStage);
  const [refundRequestsList, setRefundRequestsList] = useState<
    ExchangeRefundRequest[]
  >([]);
  const [userRefundRequest, setUserRefundRequest] =
    useState<ExchangeRefundRequest>();

  const self = exchangeDetails.isRequestUser
    ? exchangeDetails.exchange.requestUser
    : exchangeDetails.exchange.post.user;

  const theOther = exchangeDetails.isRequestUser
    ? exchangeDetails.exchange.post.user
    : exchangeDetails.exchange.requestUser;

  const caughtProgress =
    firstCurrentStage <= secondCurrentStage &&
    exchangeDetails.exchange.status !== "FAILED";

  const firstUser = exchangeDetails.isRequestUser
    ? exchangeDetails.exchange.requestUser
    : exchangeDetails.exchange.post.user;

  const secondUser = !exchangeDetails.isRequestUser
    ? exchangeDetails.exchange.requestUser
    : exchangeDetails.exchange.post.user;

  const isFailed = ["FAILED", "REJECTED"].some(
    (status) => status === exchangeDetails.exchange.status
  );

  const fetchUserRefundRequest = async () => {
    setIsLoading(true);

    await privateAxios
      .get(`refund-requests/user/exchange/${exchangeDetails.exchange.id}`)
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
    if (isFailed) fetchUserRefundRequest();
  }, [exchangeDetails]);

  const getTitle = () => {
    if (isFailed)
      return {
        title: `Trao đổi ${
          exchangeDetails.exchange.status === "FAILED"
            ? "thất bại"
            : "đã bị từ chối"
        }`,
        subTitle: (
          <p className="text-red-600">
            {exchangeDetails.exchange.status === "FAILED"
              ? "Trao đổi được hệ thống ghi nhận là thất bại khi một trong hai người trao đổi dừng trao đổi hoặc xảy ra vấn đề trong lúc trao đổi."
              : "Trao đổi được hệ thống ghi nhận là bị từ chối khi yêu cầu của bạn không được người đăng bài chấp thuận."}
          </p>
        ),
      };
    switch (firstCurrentStage) {
      case 0:
        return {
          title: "Xác nhận danh sách truyện hai bên dùng để trao đổi",
          subTitle: (
            <p>
              Sử dụng tiền bù có thể áp dụng cho cuộc trao đổi này sau khi xác
              nhận xong danh sách truyện dùng để trao đổi.
            </p>
          ),
        };
      case 1:
        return {
          title: "Xác nhận tiền bù và tiền cọc",
          subTitle: exchangeDetails.isRequestUser ? (
            <p className="leading-relaxed">
              Bạn sẽ tiến hành xác nhận tiền bù và tiền cọc cho cuộc trao đổi
              này, dựa trên những truyện mà bạn đã chọn để trao đổi.
              <br />
              Mức tiền sẽ được gửi đến và xác nhận bởi{" "}
              <span className="font-semibold">{theOther.name}</span>.
            </p>
          ) : (
            <p>
              Mức tiền bù và tiền cọc sẽ được đưa ra từ người yêu cầu trao đổi,
              sau đó sẽ được xác nhận bởi chính bạn để hoàn tất quá trình xác
              nhận.
            </p>
          ),
        };
      case 2:
        return {
          title: "Điền thông tin giao hàng",
          subTitle: (
            <p className="leading-relaxed">
              Điền thông tin địa điểm bạn sẽ bàn giao truyện để giao và nhận
              truyện được trao đổi.
            </p>
          ),
        };
      case 3:
        return {
          title: "Thanh toán",
          subTitle: (
            <p className="leading-relaxed">
              Hoàn tất quá trình thanh toán để xác nhận hoàn tất trao đổi. Quá
              trình giao hàng sẽ tự động bắt đầu ngay sau khi ghi nhận được đầy
              đủ tiền cọc từ hai bên.
            </p>
          ),
        };
      case 4:
        return {
          title: "Giao hàng & nhận hàng",
          subTitle: (
            <p className="leading-relaxed max-w-1/2">
              Quá trình giao hàng sẽ tự động bắt đầu sau khi hệ thống ghi nhận
              được giao dịch thanh toán của cả hai. <br />
              Hãy đảm bảo bạn đã hoàn thành việc đóng gói trước khi nhân viên
              giao hàng đến.
            </p>
          ),
        };
      case 5:
        return {
          title: "Hoàn tất quá trình trao đổi",
          subTitle: (
            <p className="leading-relaxed max-w-1/2">
              Quá trình hoàn cọc và chuyển giao tiền bù sẽ tự động diễn ra sau
              khi hệ thống ghi nhận xác nhận nhận hàng thành công từ hai bên.
            </p>
          ),
        };
      case 6:
        return {
          title: "Trao đổi thành công",
          subTitle: (
            <p className="leading-relaxed max-w-1/2">
              Hệ thống đã hoàn trả cọc và thanh toán tiền bù cho cuộc trao đổi
              này.
            </p>
          ),
        };
    }
  };
  return (
    <div className="w-full flex flex-col items-stretch gap-8 mt-4">
      <div className="flex items-start justify-between gap-16">
        <div className="basis-2/3">
          <p className="text-lg font-semibold uppercase">{getTitle()?.title}</p>
          <div className="text-md font-light italic">
            {getTitle()?.subTitle}
          </div>
        </div>

        {!isFailed && (
          <button
            onClick={() => fetchExchangeDetails()}
            className="min-w-fit flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-300 duration-200 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"></path>
            </svg>
            <p className="text-xs font-semibold">Cập nhật</p>
          </button>
        )}
      </div>

      {caughtProgress && firstCurrentStage === 6 && (
        <SuccessfulExchange exchangeDetails={exchangeDetails} />
      )}

      {caughtProgress && firstCurrentStage === 5 && (
        <div className="w-full text-center border border-gray-500 rounded-lg py-2">
          Đang chờ{" "}
          <span className="font-semibold">
            <Avatar src={secondUser.avatar} />
            &ensp;{secondUser.name}
          </span>{" "}
          xác nhận giao hàng thành công...
        </div>
      )}

      {caughtProgress && firstCurrentStage === 4 && (
        <DeliveryProcessInfo
          exchangeDetails={exchangeDetails}
          firstUser={firstUser}
          secondUser={secondUser}
          firstAddress={firstAddress}
          secondAddress={secondAddress}
          fetchExchangeDetails={fetchExchangeDetails}
          setIsLoading={setIsLoading}
        />
      )}

      {caughtProgress && firstCurrentStage === 3 && (
        <PlaceDeposit
          exchangeDetails={exchangeDetails}
          firstAddress={firstAddress}
          secondAddress={secondAddress}
          firstUser={firstUser}
          secondUser={secondUser}
          fetchExchangeDetails={fetchExchangeDetails}
          setIsLoading={setIsLoading}
        />
      )}

      {caughtProgress && firstCurrentStage === 2 && (
        <SubmitDeliveryInfo
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          addresses={addresses}
          setAddresses={setAddresses}
          fetchUserAddress={fetchUserAddress}
        />
      )}

      {caughtProgress &&
        firstCurrentStage === 1 &&
        (exchangeDetails.isRequestUser ? (
          <SubmitAmounts
            exchangeId={exchangeDetails.exchange.id}
            self={self}
            theOther={theOther}
            fetchExchangeDetails={fetchExchangeDetails}
            setIsLoading={setIsLoading}
          />
        ) : (
          <DealsInformation
            exchangeDetails={exchangeDetails}
            self={self}
            theOther={theOther}
          />
        ))}

      {caughtProgress && firstCurrentStage === 0 && (
        <ViewBothComicsLists
          requestComicsList={exchangeDetails.requestUserList.map(
            (item) => item.comics
          )}
          postComicsList={exchangeDetails.postUserList.map(
            (item) => item.comics
          )}
          isRequestUser={exchangeDetails.isRequestUser}
        />
      )}

      {isFailed && (
        <ViewRefundButton
          refundRequest={userRefundRequest}
          requestsList={refundRequestsList}
        />
      )}
    </div>
  );
}
