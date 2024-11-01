import { Modal } from "antd";
import React, { useState } from "react";

const DeliveryMethod = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("Nhanh"); // default selected method

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const selectMethod = (method: any) => {
    setSelectedMethod(method);
    // setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full bg-white px-8 py-4 flex flex-col rounded-lg my-4">
        <div className="grid grid-cols-4 gap-4 items-center">
          <h2 className="font-bold">PHƯƠNG THỨC VẬN CHUYỂN</h2>
          <div className="p-4 border-2 rounded-lg col-span-3 grid grid-cols-3">
            <div className="flex flex-row items-center justify-between col-span-2">
              <div className="flex flex-row gap-2 items-center">
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth="3"
                  stroke="#000000"
                  fill="none"
                >
                  <path d="M21.68,42.22H37.17a1.68,1.68,0,0,0,1.68-1.68L44.7,19.12A1.68,1.68,0,0,0,43,17.44H17.61a1.69,1.69,0,0,0-1.69,1.68l-5,21.42a1.68,1.68,0,0,0,1.68,1.68h2.18" />
                  <path d="M41.66,42.22H38.19l5-17.29h8.22a.85.85,0,0,1,.65.3l3.58,6.3a.81.81,0,0,1,.2.53L52.51,42.22h-3.6" />
                  <ellipse cx="18.31" cy="43.31" rx="3.71" ry="3.76" />
                  <ellipse cx="45.35" cy="43.31" rx="3.71" ry="3.76" />
                  <line
                    x1="23.25"
                    y1="22.36"
                    x2="6.87"
                    y2="22.36"
                    strokeLinecap="round"
                  />
                  <line
                    x1="20.02"
                    y1="27.6"
                    x2="8.45"
                    y2="27.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="21.19"
                    y1="33.5"
                    x2="3.21"
                    y2="33.5"
                    strokeLinecap="round"
                  />
                </svg>
                <h2>{selectedMethod}</h2>
              </div>
              <h2>{selectedMethod === "Nhanh" ? "22,200đ" : "74,100đ"}</h2>
            </div>
            <div
              className="flex flex-row gap-1 items-center cursor-pointer justify-end"
              onClick={showModal}
            >
              <svg
                fill="#000000"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="icon flat-line"
              >
                <polyline
                  points="20 10 4 10 7 7"
                  stroke="#1D6199"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  fill="none"
                ></polyline>
                <polyline
                  points="4 14 20 14 17 17"
                  stroke="#1D6199"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  fill="none"
                ></polyline>
              </svg>
              <h2 className="font-light text-slate-500 ">Thay đổi</h2>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="PHƯƠNG THỨC THANH TOÁN"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <div className="flex flex-col gap-4">
          <div
            className={`border p-4 rounded-lg flex justify-between items-center cursor-pointer ${
              selectedMethod === "Nhanh" ? "bg-gray-100" : ""
            }`}
            onClick={() => selectMethod("Nhanh")}
          >
            <div>
              <h3 className="font-bold text-lg text-red-500">Nhanh</h3>
              <p className="text-lg font-bold text-orange-600">₫22.200</p>
              <p>Đảm bảo nhận hàng từ 2 Tháng 11 - 4 Tháng 11</p>
              <p>
                Nhận Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau
                ngày 4 Tháng 11 2024.
              </p>
            </div>
            {selectedMethod === "Nhanh" && (
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="text-green-500"
              >
                <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
              </svg>
            )}
          </div>
          <div
            className={`border p-4 rounded-lg flex justify-between items-center cursor-pointer ${
              selectedMethod === "Hỏa Tốc" ? "bg-gray-100" : ""
            }`}
            onClick={() => selectMethod("Hỏa Tốc")}
          >
            <div>
              <h3 className="font-bold text-lg text-red-500">Hỏa Tốc</h3>
              <p className="text-lg font-bold text-orange-600">₫74.100</p>
              <p>Đảm bảo nhận hàng vào ngày mai</p>
              <p>
                Nhận Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau
                ngày 1 Tháng 11 2024.
              </p>
              <p className="text-gray-500 text-sm">
                (Kênh Hỏa Tốc không hỗ trợ chương trình Shopee Đồng Kiểm)
              </p>
            </div>
            {selectedMethod === "Hỏa Tốc" && (
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="text-green-500"
              >
                <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
              </svg>
            )}
          </div>
          <div className="w-full flex justify-end gap-4">
            <button className="px-8 py-2 border-2 rounded-lg font-bold">
              Hủy
            </button>
            <button className="px-8 py-2 rounded-lg font-bold text-white bg-black">
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeliveryMethod;
