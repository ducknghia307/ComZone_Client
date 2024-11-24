import { useNavigate } from "react-router-dom";
import Checked from "../../../../assets/congrats/checked.png";
import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";

export default function SuccessfulExchange({
  exchangeDetails,
}: {
  exchangeDetails: ExchangeDetails;
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full flex items-stretch justify-between gap-4">
      <div className="grow flex flex-col items-center justify-center gap-4 py-8 bg-[#19873f] text-white rounded-xl">
        <img src={Checked} className="w-1/4" />
        <p className="text-xl">TRAO ĐỔI THÀNH CÔNG</p>
      </div>

      <div className="basis-1/3 flex flex-col items-stretch justify-between gap-4">
        <div className="flex items-center justify-center">
          <p className="font-light italic text-sm border border-gray-400 rounded-lg p-2">
            "Quá trình trao đổi đã hoàn tất. Chúng tôi hy vọng bạn sẽ có một
            khoảng thời gian tận hưởng với những tập truyện mới!"
          </p>
        </div>

        <div className="min-w-max flex flex-col items-stretch gap-1">
          <button
            onClick={() => navigate("/accountmanagement/wallet")}
            className="border border-gray-300 p-2 rounded-lg duration-200 hover:bg-gray-100"
          >
            Kiểm tra ví
          </button>
          <button
            onClick={() => navigate("/exchange-news-feed")}
            className="bg-sky-800 text-white p-2 rounded-lg duration-200 hover:bg-sky-900"
          >
            Tiếp tục trao đổi
          </button>
        </div>
      </div>
    </div>
  );
}
