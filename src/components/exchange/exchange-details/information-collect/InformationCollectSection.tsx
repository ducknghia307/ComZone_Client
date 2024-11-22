import { Avatar } from "antd";
import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import ViewBothComicsLists from "./ViewBothComicsLists";
import SubmitAmounts from "./SubmitAmounts";
import SubmitDeliveryInfo from "./SubmitDeliveryInfo";
import PlaceDeposit from "./PlaceDeposit";
import DeliveryProcessInfo from "./DeliveryProcessInfo";
import SuccessfulExchange from "./SuccessfulExchange";
import { Address } from "../../../../common/base.interface";

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
}) {
  const theOther = exchangeDetails.isRequestUser
    ? exchangeDetails.exchange.post.user
    : exchangeDetails.exchange.requestUser;

  const caughtProgress = firstCurrentStage <= secondCurrentStage;
  const firstUserName = exchangeDetails.isRequestUser
    ? exchangeDetails.exchange.requestUser.name
    : exchangeDetails.exchange.post.user.name;
  const secondUserName = !exchangeDetails.isRequestUser
    ? exchangeDetails.exchange.requestUser.name
    : exchangeDetails.exchange.post.user.name;
  const getTitle = () => {
    switch (firstCurrentStage) {
      case 0:
        return {
          title: "Xác nhận danh sách truyện hai bên dùng để trao đổi",
          subTitle: exchangeDetails.isRequestUser ? (
            <p>
              <Avatar src={theOther.avatar} />{" "}
              <span className="font-semibold">{theOther.name}</span> có thể bù
              thêm tiền để thực hiện trao đổi với bạn, sau khi xác nhận danh
              sách truyện dùng để trao đổi của cả hai.
            </p>
          ) : (
            <p>
              Bạn có thể bù thêm tiền để thực hiện trao đổi với{" "}
              <Avatar src={theOther.avatar} />{" "}
              <span className="font-semibold">{theOther.name}</span>, sau khi
              xác nhận danh sách truyện dùng để trao đổi của cả hai.
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
              Điền thông tin địa điểm bạn sẽ bàn giao truyện để giao và bạn sẽ
              nhận truyện được trao đổi.
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
    }
  };
  return (
    <div className="w-full flex flex-col items-stretch gap-8 mt-4">
      <div>
        <p className="text-lg font-semibold uppercase">{getTitle()?.title}</p>
        <div className="text-xs font-light italic">{getTitle()?.subTitle}</div>
      </div>

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

      {caughtProgress &&
        firstCurrentStage === 1 &&
        exchangeDetails.isRequestUser && (
          <SubmitAmounts
            exchangeId={exchangeDetails.exchange.id}
            fetchExchangeDetails={fetchExchangeDetails}
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
      {caughtProgress && firstCurrentStage === 3 && (
        <PlaceDeposit
          exchangeDetails={exchangeDetails}
          firstAddress={firstAddress}
          secondAddress={secondAddress}
          firstUserName={firstUserName}
          secondUserName={secondUserName}
          fetchExchangeDetails={fetchExchangeDetails}
        />
      )}
      {caughtProgress && firstCurrentStage === 4 && (
        <DeliveryProcessInfo
          exchangeDetails={exchangeDetails}
          firstUserName={firstUserName}
          secondUserName={secondUserName}
          firstAddress={firstAddress}
          secondAddress={secondAddress}
        />
      )}
      {caughtProgress && firstCurrentStage === 5 && <SuccessfulExchange />}
    </div>
  );
}
