import { Link } from "react-router-dom";
import tick from "../assets/tick-circle.png";
const OrderComplete = () => {
  return (
    <div
      className="w-full REM flex flex-col items-center bg-cover bg-center "
      // style={{
      //   backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${backgr})`,
      // }}
    >
      <div className="w-full flex flex-col justify-center items-center px-4 py-16 md:py-32 gap-6 md:min-h-[75vh]">
        <img src={tick} alt="" className="h-40 w-40" />
        <h1 className="text-black capitalize font-bold text-3xl md:text-5xl text-center">
          Đặt hàng thành công!
        </h1>
        <h2 className="text-black text-center text-sm md:text-base">
          Bạn có thể kiểm tra lại đơn hàng trong{" "}
          <Link
            to="/accountmanagement/purchase"
            className="hover:opacity-60 duration-200 underline"
          >
            lịch sử mua hàng
          </Link>
        </h2>
      </div>
    </div>
  );
};

export default OrderComplete;
