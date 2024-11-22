/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Address } from "../../../../common/base.interface";
import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import AcceptOrRejectButtons from "./buttons/1.AcceptOrRejectButtons";
import ConfirmDealsButton from "./buttons/ConfirmDealsButton";
import ConfirmDeliveryButton from "./buttons/ConfirmDeliveryButton";

export default function ActionButtons({
  exchangeDetails,
  currentStage,
  oppositeCurrentStage,
  anotherStage,
  fetchExchangeDetails,
  selectedAddress,
}: {
  exchangeDetails: ExchangeDetails;
  currentStage: number;
  anotherStage: number;
  oppositeCurrentStage: number;
  fetchExchangeDetails: Function;
  selectedAddress: Address | null;
}) {
  if (currentStage > oppositeCurrentStage)
    return (
      <div className="w-full bg-gray-300 text-white py-2 rounded-lg text-center">
        Đang đợi người đối diện thực hiện...
      </div>
    );
  console.log(selectedAddress);

  return (
    <div className="relative w-full flex flex-col items-stretch justify-center px-2 mt-1">
      {currentStage === 0 &&
        (!exchangeDetails.isRequestUser ? (
          <AcceptOrRejectButtons
            exchangeId={exchangeDetails.exchange.id}
            fetchExchangeDetails={fetchExchangeDetails}
          />
        ) : (
          <button className="w-full py-2 rounded-lg border border-gray-500 font-light cursor-default">
            Yêu cầu đang chờ để được chấp nhận...
          </button>
        ))}

      {currentStage === 1 &&
        anotherStage === 1 &&
        (exchangeDetails.isRequestUser ? null : (
          <button className="w-full py-2 rounded-lg border border-gray-500 font-light cursor-default">
            Đang chờ người yêu cầu trao đổi xác nhận...
          </button>
        ))}
      {currentStage === 1 &&
        anotherStage === 2 &&
        (!exchangeDetails.isRequestUser ? (
          <ConfirmDealsButton
            exchangeDetail={exchangeDetails}
            fetchExchangeDetails={fetchExchangeDetails}
          />
        ) : (
          <button className="w-full py-2 rounded-lg border border-gray-500 font-light cursor-default">
            Đang chờ người yêu cầu trao đổi xác nhận...
          </button>
        ))}

      {currentStage === 2 && (
        <ConfirmDeliveryButton
          exchangeId={exchangeDetails.exchange.id}
          selectedAddress={selectedAddress}
          fetchExchangeDetails={fetchExchangeDetails}
        />
      )}
    </div>
  );
}
