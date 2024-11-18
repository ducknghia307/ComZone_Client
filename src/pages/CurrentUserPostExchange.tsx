import React, { useEffect, useState } from "react";
import UserInformation from "../components/Profile/UserInformation";
import { privateAxios } from "../middleware/axiosInstance";
import { UserInfo } from "../common/base.interface";
import ProfileTab from "../components/Profile/ProfileTab";
import Loading from "../components/loading/Loading";
import { ExchangeRequest } from "../common/interfaces/exchange.interface";
import ExchangePost from "../components/exchangeNewsFeed/ExchangePost";

const CurrentUserPostExchange = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [currentUrl, setCurrentUrl] = useState<string>();
  const [exchangeList, setExchangeList] = useState<ExchangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const res = await privateAxios("/users/profile");
      setUserInfo(res.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUserExchangeRequest = async () => {
    try {
      setIsLoading(true);
      const res = await privateAxios("/comics/exchange/user");
      setExchangeList(res.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserInfo();
    fetchUserExchangeRequest();
    setCurrentUrl(window.location.pathname);
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <div className="w-full flex flex-row REM">
        <div className="w-1/3 p-4 ">
          <div className="">
            {userInfo && <UserInformation userInfo={userInfo} />}
          </div>
        </div>
        <div className="w-2/3 flex flex-col gap-4 p-4 ">
          {currentUrl && <ProfileTab currentUrl={currentUrl} />}
          {exchangeList &&
            userInfo &&
            exchangeList.map((exchangeRequest, index: number) => (
              <ExchangePost
                key={index}
                exchangeRequest={exchangeRequest}
                index={index}
                isLoading={isLoading}
                currentUserId={userInfo?.id}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default CurrentUserPostExchange;
