import { useNavigate } from "react-router-dom";
import Congrats from "../../../../assets/congrats/congrats.jpg";

export default function SuccessfulExchange() {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 pb-8">
      <img src={Congrats} className="w-1/4" />
      <p className="text-xl text-green-700">TRAO ĐỔI THÀNH CÔNG</p>
      <div>
        <button
          onClick={() => navigate("/exchange-news-feed")}
          className="px-8 py-2 rounded-md bg-sky-700 text-white font-semibold duration-200 hover:bg-sky-800"
        >
          TIẾP TỤC TRAO ĐỔI
        </button>
      </div>
    </div>
  );
}
