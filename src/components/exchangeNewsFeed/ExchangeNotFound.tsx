import { Link } from "react-router-dom";
import DetectiveImage from "../../assets/notFound/detective.jpg";

export default function ExchangeNotFound({
  searchParams,
  isLoading,
}: {
  searchParams: URLSearchParams;
  isLoading: boolean;
}) {
  return (
    <div
      className={`${
        isLoading && "hidden"
      } min-h-[70vh] flex flex-row items-center justify-center gap-16 REM py-8`}
    >
      <img
        src={DetectiveImage}
        alt=""
        style={{
          width: "300px",
          borderRadius: "50%",
        }}
        className="hidden md:block"
      />

      <div className="flex flex-col items-center justify-center gap-4 text-center text-gray-700">
        <p className="text-[5em] font-bold">MẤT TÍCH</p>
        <span className="flex flex-col items-center justify-center gap-4">
          <p
            className={`${
              !searchParams.get("search") && "hidden"
            } text-2xl font-bold`}
          >
            Không tìm thấy kết quả cho "{searchParams.get("search")}".
          </p>
          <p className="font-light italic hidden md:block">
            "Đừng lo, chúng tôi đã cử đặc vụ cừ khôi nhất của chúng tôi cho vụ
            này."
          </p>
        </span>
        <span className="flex flex-col items-center justify-center gap-2 mt-2">
          <p className="text-xs">Bạn có thể thử lại với từ khóa khác hoặc</p>
          <Link to="/exchange-news-feed">
            <button className="bg-sky-800 text-white font-bold hover:bg-sky-900 rounded-xl mt-2 px-4 py-2">
              XEM TẤT CẢ
            </button>
          </Link>
        </span>
      </div>
    </div>
  );
}
