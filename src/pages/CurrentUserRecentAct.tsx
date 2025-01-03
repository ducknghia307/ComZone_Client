import { useEffect, useState } from "react";
import UserInformation from "../components/Profile/UserInformation";
import { privateAxios } from "../middleware/axiosInstance";
import { UserInfo } from "../common/base.interface";
import ProfileTab from "../components/Profile/ProfileTab";
import Loading from "../components/loading/Loading";

const CurrentUserRecentAct = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [currentUrl, setCurrentUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchUserInfo = async () => {
    try {
      const res = await privateAxios("/users/profile");
      setUserInfo(res.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserInfo();
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
          recentact
        </div>
      </div>
    </>
  );
};

export default CurrentUserRecentAct;
