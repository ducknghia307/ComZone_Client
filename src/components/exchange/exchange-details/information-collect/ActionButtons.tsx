import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import AcceptOrRejectButtons from "./buttons/1.AcceptOrRejectButtons";

export default function ActionButtons({
  exchangeDetails,
  currentStage,
  oppositeCurrentStage,
  fetchExchangeDetails,
}: {
  exchangeDetails: ExchangeDetails;
  currentStage: number;
  oppositeCurrentStage: number;
  fetchExchangeDetails: Function;
}) {
  if (currentStage > oppositeCurrentStage)
    return (
      <div className="w-full bg-gray-300 text-white py-2 rounded-lg text-center">
        Đang đợi người đối diện thực hiện...
      </div>
    );

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
        (exchangeDetails.isRequestUser ? null : (
          <button className="w-full py-2 rounded-lg border border-gray-500 font-light cursor-default">
            Đang chờ người yêu cầu trao đổi xác nhận...
          </button>
        ))}

      {currentStage === 3 && (
        <div className="flex items-stretch gap-2">
          <button className="basis-1/3 min-w-max py-2 rounded-lg bg-red-700 text-white hover:opacity-80 duration-200">
            Gặp vấn đề khi nhận hàng
          </button>
          <button className="grow py-2 rounded-lg bg-gray-600  text-white hover:opacity-80 duration-200">
            Đã nhận thành công
          </button>
        </div>
      )}
    </div>
  );
}
