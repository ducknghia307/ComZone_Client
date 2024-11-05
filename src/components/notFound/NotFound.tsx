import React from "react";
import { Link } from "react-router-dom";
import detective from "../../assets/notFound/detective.jpg";

export default function NotFound() {
  return (
    <div
      className={`min-h-[70vh] flex flex-row items-center justify-center gap-16 REM py-8`}
    >
      <img
        src={detective}
        alt=""
        style={{
          width: "300px",
          borderRadius: "50%",
        }}
        className="hidden md:block"
      />

      <div className="flex flex-col items-center justify-center gap-4 text-center text-gray-700">
        <p className="text-[10em] font-bold">404</p>
        <span className="flex flex-col items-center justify-center gap-4">
          <p className="text-2xl font-bold">Không tìm thấy trang này.</p>
          <p className="font-light italic hidden md:block">
            "Đừng lo, chúng tôi đã cử đặc vụ cừ khôi nhất của chúng tôi cho vụ
            này."
          </p>
        </span>
        <span className="flex flex-col items-center justify-center gap-2 mt-2">
          <p className="text-xs">Trong khi chờ, bạn có thể thử về trang chủ.</p>
          <Link to="/">
            <button className="bg-sky-800 text-white font-bold hover:bg-sky-900 rounded-xl mt-2 px-4 py-2">
              Về trang chủ
            </button>
          </Link>
        </span>
      </div>
    </div>
  );
}
