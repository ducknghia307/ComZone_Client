import React, { useEffect, useState } from "react";
import UserInformation from "../components/Profile/UserInformation";
import { privateAxios } from "../middleware/axiosInstance";
import { UserInfo } from "../common/base.interface";
import ProfileTab from "../components/Profile/ProfileTab";
import Loading from "../components/loading/Loading";
import NewComicOfferModal from "../components/Profile/ComicOffer/NewComicOfferModal";

const CurrentUserComicExchange = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [currentUrl, setCurrentUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
        <div className="w-2/3 flex flex-col gap-4 p-4  ">
          {currentUrl && <ProfileTab currentUrl={currentUrl} />}
          <div className="w-full flex flex-col items-start px-4">
            <h2 className="font-bold text-lg">DANH SÁCH TRUYỆN ĐỂ TRAO ĐỔI</h2>
            <button
              className="min-w-max border flex items-center px-4 py-2 rounded-lg bg-gray-50 text-black duration-200 hover:bg-gray-300 gap-2 mt-4"
              onClick={showModal}
            >
              <p>+</p>
              <p>Thêm truyện</p>
            </button>
          </div>
        </div>
      </div>
      {userInfo && (
        <NewComicOfferModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          userInfo={userInfo}
        />
      )}
    </>
  );
};

export default CurrentUserComicExchange;
