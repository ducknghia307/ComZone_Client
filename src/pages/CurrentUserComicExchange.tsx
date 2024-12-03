import { useEffect, useState } from "react";
import { privateAxios } from "../middleware/axiosInstance";
import { Comic, UserInfo } from "../common/base.interface";
import Loading from "../components/loading/Loading";
import NewComicOfferModal from "../components/exchange/exchange-management/NewComicOfferModal";
import SingleExchangeComics from "../components/exchange/exchange-management/SingleExchangeComics";
import ExchangeComicsDetails from "../components/exchange/exchange-management/ExchangeComicsDetails";
import UpdateExchangeComics from "../components/exchange/exchange-management/UpdateExchangeComics";

const CurrentUserComicExchange = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const [comicExchangeOffer, setComicExchangeOffer] = useState<Comic[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowingDetails, setIsShowingDetails] = useState<Comic>();

  const [isUpdating, setIsUpdating] = useState<Comic>();

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
      const exchangeComicsList: Comic[] = res.data;
      setComicExchangeOffer(exchangeComicsList);

      if (isShowingDetails)
        setIsShowingDetails(
          exchangeComicsList.find((comics) => comics.id === isShowingDetails.id)
        );
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
    fetchComicExchangeOffer();

    const createComicsSession = sessionStorage.getItem(
      "create-exchange-comics"
    );
    if (createComicsSession && createComicsSession === "true") {
      setIsModalOpen(true);
      sessionStorage.removeItem("create-exchange-comics");
    }
  }, []);

  return (
    <div className="REM w-full min-w-[50vw] md:w-2/3 flex flex-col mx-auto px-4">
      {isLoading && <Loading />}
      <div className="w-full flex flex-col items-stretch gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="grow relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên truyện, tác giả..."
              className="w-full border border-gray-300 rounded-md p-2 pl-12 font-light"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              className="absolute top-1/2 -translate-y-1/2 left-4"
            >
              <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
            </svg>
          </div>

          <button
            className="flex items-center px-4 py-2 rounded-lg bg-green-600 text-white md:text-lg md:whitespace-nowrap duration-200 hover:bg-green-800 gap-2"
            onClick={showModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
            </svg>
            <p>Thêm truyện trao đổi</p>
          </button>
        </div>

        <div className="w-full flex flex-col gap-1">
          {comicExchangeOffer.map((comics) => (
            <SingleExchangeComics
              comics={comics}
              setIsShowingDetails={setIsShowingDetails}
            />
          ))}
        </div>
      </div>

      {isShowingDetails && (
        <ExchangeComicsDetails
          comics={isShowingDetails}
          setIsShowingDetails={setIsShowingDetails}
          fetchComicExchangeOffer={fetchComicExchangeOffer}
          setIsUpdating={setIsUpdating}
        />
      )}

      {isUpdating && (
        <UpdateExchangeComics
          comics={isUpdating}
          setIsOpen={setIsUpdating}
          fetchComicExchangeOffer={fetchComicExchangeOffer}
        />
      )}

      {userInfo && (
        <NewComicOfferModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          userInfo={userInfo}
          fetchComicExchangeOffer={fetchComicExchangeOffer}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default CurrentUserComicExchange;
