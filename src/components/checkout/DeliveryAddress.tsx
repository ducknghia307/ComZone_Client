import React from "react";

const DeliveryAddress = () => {
  return (
    <div className="w-full bg-white px-8 py-4">
      <h2 className="border-b font-bold">ĐỊA CHỈ GIAO HÀNG</h2>
      <div className="flex flex-col w-full">
        <div className="flex lg:flex-row md:flex-row flex-col w-full py-2 lg:items-center md:items-center mt-2">
          <h3 className="lg:w-1/6 md:w-1/3 font-light ">
            Họ và tên người nhận
          </h3>
          <input
            type=""
            className="px-4 lg:w-5/6 md:w-2/3 border rounded-sm"
            placeholder="Nhập họ và tên người nhận"
          />
        </div>
        <div className="flex lg:flex-row md:flex-row flex-col w-full py-2 lg:items-center md:items-center mt-2">
          <h3 className="lg:w-1/6 md:w-1/3 font-light ">Email</h3>
          <input
            className="px-4 lg:w-5/6 md:w-2/3 border rounded-sm"
            type=""
            placeholder="Nhập email"
          />
        </div>
        <div className="flex lg:flex-row md:flex-row flex-col w-full py-2 lg:items-center md:items-center mt-2">
          <h3 className="lg:w-1/6 md:w-1/3 font-light ">Số điện thoại</h3>
          <input
            className="px-4 lg:w-5/6 md:w-2/3 border rounded-sm"
            type=""
            placeholder="Ví dụ: 0987654xxx (10 ký tự số)"
          />
        </div>
        <div className="flex lg:flex-row md:flex-row flex-col w-full py-2 lg:items-center md:items-center mt-2">
          <h3 className="lg:w-1/6 md:w-1/3 font-light ">Tỉnh/Thành phố</h3>
          <input
            className="px-4 lg:w-5/6 md:w-2/3 border rounded-sm"
            type=""
            placeholder="Chọn tỉnh thành phố"
          />
        </div>
        <div className="flex lg:flex-row md:flex-row flex-col w-full py-2 lg:items-center md:items-center mt-2">
          <h3 className="lg:w-1/6 md:w-1/3 font-light ">Quận/Huyện</h3>
          <input
            className="px-4 lg:w-5/6 md:w-2/3 border rounded-sm"
            type=""
            placeholder="Chọn quận/huyện"
          />
        </div>
        <div className="flex lg:flex-row md:flex-row flex-col w-full py-2 lg:items-center md:items-center mt-2">
          <h3 className="lg:w-1/6 md:w-1/3 font-light ">Phường/Xã</h3>
          <input
            className="px-4 lg:w-5/6 md:w-2/3 border rounded-sm"
            type=""
            placeholder="Chọn phường/xã"
          />
        </div>
        <div className="flex lg:flex-row md:flex-row flex-col w-full py-2 lg:items-center md:items-center mt-2">
          <h3 className="lg:w-1/6 md:w-1/3 font-light ">Địa chỉ nhận hàng</h3>
          <input
            className="px-4 lg:w-5/6 md:w-2/3 border rounded-sm"
            type=""
            placeholder="Nhập địa chỉ nhận hàng"
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
