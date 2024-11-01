import React, { useEffect, useState } from "react";
import { message, Steps } from "antd";
import SellerInfomation from "../components/RegisterSeller/SellerInfomation";
import DeliveryMethod from "../components/RegisterSeller/DeliveryMethod";
import { privateAxios } from "../middleware/axiosInstance";
import { UserInfo } from "../common/base.interface";

const steps = [
  {
    title: "Thông tin Người bán",
    content: <SellerInfomation />,
  },
  {
    title: "Cài đặt vận chuyển",
    content: <DeliveryMethod />,
  },
  {
    title: "Hoàn tất",
    content: "Last-content",
  },
];

const App: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const fetchUserInfo = async () => {
    try {
      const response = await privateAxios("/users/profile");
      const data = await response.data;

      setUserInfo(data);
    } catch {
      console.log("...");
    }
  };
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: <span className=" text-nowrap ">{item.title}</span>,
  }));
  useEffect(() => {
    fetchUserInfo();
  });
  return (
    <div className="w-full px-32 py-16 ">
      <Steps
        current={current}
        items={items}
        labelPlacement="vertical"
        progressDot
      />
      <div className="w-full">{steps[current].content}</div>
      <div className="mt-6 flex flex-row items-center w-full h-10">
        {current < steps.length - 1 && (
          <button
            className=" px-4 py-2 rounded-lg bg-black text-white REM duration-200 hover:opacity-70"
            onClick={() => next()}
          >
            Tiếp theo
          </button>
        )}
        {current === steps.length - 1 && (
          <button
            className=" px-4 py-2 rounded-lg bg-black text-white  REM duration-200 hover:opacity-70"
            onClick={() => message.success("Processing complete!")}
          >
            Hoàn thành
          </button>
        )}
        {current > 0 && (
          <button
            className=" px-4 py-2 rounded-lg bg-white text-black REM duration-200 hover:opacity-70 border border-black ml-4"
            onClick={() => prev()}
          >
            Quay lại
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
