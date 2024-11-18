import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { privateAxios } from "../middleware/axiosInstance";
import { Avatar } from "antd";
import { Exchange } from "../common/interfaces/exchange.interface";

const ExchangeDetail: React.FC = () => {
  const { id } = useParams(); // Get the id from the URL
  const [exchangeData, setExchangeData] = useState<Exchange>();

  const fetchExchangeDetails = async () => {
    try {
      const response = await privateAxios(`/exchanges/${id}`);
      console.log(response.data);

      setExchangeData(response.data);
    } catch (error) {
      console.error("Error fetching exchange details:", error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchExchangeDetails();
    }
  }, [id]);

  return (
    <div className="min-h-[75vh] w-full p-8 REM flex flex-row gap-5">
      <div className="w-1/3 flex flex-col gap-2">
        <div className="border bg-white shadow-md rounded-md">
          <div className="p-4">
            <h2 className="font-semibold text-lg">Người gửi yêu cầu</h2>
            <div className="flex flex-row gap-4 align-top mt-4">
              <Avatar
                size={"large"}
                src={exchangeData?.requestUser.avatar}
                alt={exchangeData?.requestUser.name}
              />
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-medium">
                  {exchangeData?.requestUser.name}
                </h2>
                <h2 className="text-base">{exchangeData?.requestUser.phone}</h2>
                <h2 className="text-base">{exchangeData?.requestUser.email}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="border bg-white shadow-md rounded-md">
          <div className="p-4">
            <h2 className="font-semibold text-lg">Người đăng bài</h2>
            <div className="flex flex-row gap-4 align-top mt-4">
              <Avatar
                size={"large"}
                src={exchangeData?.post.user.avatar}
                alt={exchangeData?.post.user.name}
              />
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-medium">
                  {exchangeData?.post.user.name}
                </h2>
                <h2 className="text-base">{exchangeData?.post.user.phone}</h2>
                <h2 className="text-base">{exchangeData?.post.user.email}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-2/3 flex flex-col"></div>
    </div>
  );
};

export default ExchangeDetail;
