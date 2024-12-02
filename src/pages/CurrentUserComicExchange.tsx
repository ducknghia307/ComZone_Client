import { useEffect, useState } from "react";
import UserInformation from "../components/Profile/UserInformation";
import { privateAxios } from "../middleware/axiosInstance";
import { Comic, UserInfo } from "../common/base.interface";
import ProfileTab from "../components/Profile/ProfileTab";
import Loading from "../components/loading/Loading";
import NewComicOfferModal from "../components/Profile/ComicOffer/NewComicOfferModal";
import ComicExchangeOfferList from "../components/Profile/ComicOffer/ComicExchangeOfferList";

const CurrentUserComicExchange = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [currentUrl, setCurrentUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [comicExchangeOffer, setComicExchangeOffer] = useState<Comic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const fetchComicExchangeOffer = async () => {
    try {
      setIsLoading(true);
      const res = await privateAxios("/comics/exchange/user");
      setComicExchangeOffer(res.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
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
    fetchComicExchangeOffer();
  }, []);

  return (
    <div className="w-full min-w-[50vw]">
      {isLoading && <Loading />}
      <div className="w-full flex flex-col items-stretch REM">
        <button
          className="min-w-max border flex items-center px-4 py-2 rounded-lg bg-gray-50 text-black duration-200 hover:bg-gray-300 gap-2 mt-4"
          onClick={showModal}
        >
          <p>+</p>
          <p>Thêm truyện</p>
        </button>

        <div className="w-full ">
          <ComicExchangeOfferList comicExchangeOffer={comicExchangeOffer} />
        </div>
      </div>

      {userInfo && (
        <NewComicOfferModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          userInfo={userInfo}
          fetchComicExchangeOffer={fetchComicExchangeOffer}
        />
      )}
    </div>
  );
};

export default CurrentUserComicExchange;
