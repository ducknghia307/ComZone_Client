import React, { useEffect, useState } from "react";
import UserInformation from "../components/Profile/UserInformation";
import { privateAxios } from "../middleware/axiosInstance";
import { UserInfo } from "../common/base.interface";
import ProfileTab from "../components/Profile/ProfileTab";

const CurrentUserRecentAct = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const fetchUserInfo = async () => {
    try {
      const res = await privateAxios("/users/profile");
      setUserInfo(res.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);
  return (
    <div className="w-full flex flex-row REM">
      <div className="w-1/3 p-4 ">
        <div className="">
          {userInfo && <UserInformation userInfo={userInfo} />}
        </div>
      </div>
      <div className="w-2/3 flex flex-col gap-4 p-4 ">
        <ProfileTab />
      </div>
    </div>
  );
};

export default CurrentUserRecentAct;
