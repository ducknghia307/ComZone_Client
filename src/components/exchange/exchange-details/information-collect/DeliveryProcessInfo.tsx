import React from "react";
import Car from "../../../../assets/car.png";
import { LinearProgress } from "@mui/material";
const DeliveryProcessInfo: React.FC = () => {
  const deliveryStatus = "Đang giao hàng"; // Thay đổi trạng thái tại đây
  const estimatedDeliveryTime = "20:00 - 21:00";
  const sender = {
    name: "Nguyễn Văn A",
    address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
  };
  const receiver = {
    name: "Lê Thị B",
    address: "456 Đường XYZ, Quận 2, TP. Hồ Chí Minh",
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg REM overflow-hidden">
      <h2 className="text-lg font-bold text-gray-700 mb-4">
        Thông tin giao hàng
      </h2>
      <div className="w-full flex flex-row">
        <div className="w-1/2 flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Người gửi:</h3>
            <p className="font-light">{sender.name}</p>
            <p className="font-light">{sender.address}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Người nhận:</h3>
            <p className="font-light">{receiver.name}</p>
            <p className="font-light">{receiver.address}</p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-4">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Trạng thái:</h3>
            <p className="text-blue-600 font-medium p-2 bg-blue-200 w-fit rounded-md">
              {deliveryStatus}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Thời gian dự kiến:</h3>
            <p className="font-light">{estimatedDeliveryTime}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 r">
        <p className="w-full text-center text-sm font-light italic pb-4">
          Trên đường giao hàng đến bạn...
        </p>
        <LinearProgress />
      </div>
    </div>
  );
};

export default DeliveryProcessInfo;
