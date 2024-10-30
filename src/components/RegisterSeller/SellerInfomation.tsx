import React from "react";

const SellerInfomation = () => {
  return (
    <div className="w-full items-center justify-center bg-white REM">
      <div className="w-full px-16 py-8 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col">
          <h2>Tên người bán</h2>
          <input className="p-2 border rounded-lg w-2/3 mt-2" type="text" />
        </div>
        <div className="w-full flex flex-col">
          <h2>Email</h2>
          <input className="p-2 border rounded-lg w-2/3 mt-2" type="text" />
        </div>
        <div className="w-full flex flex-col">
          <h2>Số điện thoại</h2>
          <input className="p-2 border rounded-lg w-2/3 mt-2" type="text" />
        </div>
      </div>
    </div>
  );
};

export default SellerInfomation;
