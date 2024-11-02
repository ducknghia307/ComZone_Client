import React from "react";
import Tick from "../../assets/tick-circle.png";
const RegisterSellerSuccess = () => {
  return (
    <div className="w-full REM flex justify-center ">
      <div className="flex flex-col justify-center items-center py-8">
        <img src={Tick} alt="" className="h-24 w-24" />
        <h2 className="mt-4 font-semibold">
          Nhấn nút "HOÀN THÀNH" để hoàn tất việc đăng ký
        </h2>
      </div>
    </div>
  );
};

export default RegisterSellerSuccess;
