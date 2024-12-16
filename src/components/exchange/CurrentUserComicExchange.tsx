/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import { Comic, UserInfo } from "../../common/base.interface";
import Loading from "../loading/Loading";
import NewComicOfferModal from "./exchange-management/NewComicOfferModal";
import SingleExchangeComics from "./exchange-management/SingleExchangeComics";
import ExchangeComicsDetails from "./exchange-management/ExchangeComicsDetails";
import UpdateExchangeComics from "./exchange-management/UpdateExchangeComics";
import { notification, Pagination } from "antd";
import { useSearchParams } from "react-router-dom";
import EmptyIcon from "../../assets/notFound/empty-book-collection.png";

const CurrentUserComicExchange = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const [comicExchangeOffer, setComicExchangeOffer] = useState<Comic[]>([]);
  const [currentComicsList, setCurrentComicsList] = useState<Comic[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>(
    searchParams.get("search") || ""
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowingDetails, setIsShowingDetails] = useState<Comic>();

  const [isUpdating, setIsUpdating] = useState<Comic>();

  const [currentPage, setCurrentPage] = useState(0);
  const comicsPerPage = 10;
  const topListPosition = useRef<HTMLDivElement>();

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

      if (!searchParams.get("search")) setCurrentComicsList(exchangeComicsList);

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

  const searchExchangeComics = async (searchKey?: string) => {
    if (!searchKey && searchInput.length === 0) return;

    await privateAxios
      .get(`comics/exchange/search/self?key=${searchKey || searchInput}`)
      .then((res) => {
        setSearchParams({ search: searchKey || searchInput });
        setCurrentComicsList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleSearchExchangeComics = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && searchInput.length > 0) {
      setCurrentPage(0);
      searchExchangeComics();
    }
  };

  useEffect(() => {
    if (searchParams.get("search") && searchParams.get("search").length > 0) {
      searchExchangeComics(searchParams.get("search"));
      setSearchInput(searchParams.get("search"));
    }
  }, []);

  const handleUndoDelete = async (comics: Comic) => {
    await privateAxios
      .delete(`comics/undo/${comics.id}`)
      .then(() => {
        notification.success({
          key: "delete",
          message: <p className="REM">Khôi phục thành công</p>,
          description: (
            <p className="REM">
              Truyện <span className="font-semibold">"{comics.title}"</span> đã
              được khôi phục!
            </p>
          ),
          duration: 5,
        });

        fetchComicExchangeOffer();
      })
      .catch((err) => console.log(err));
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
              disabled={comicExchangeOffer.length === 0}
              placeholder="Tìm kiếm theo tên truyện, tác giả..."
              className="w-full border border-gray-300 rounded-md p-2 pl-12 font-light"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);

                if (e.target.value.length === 0) {
                  searchParams.delete("search");
                  setSearchParams(searchParams);
                  setCurrentComicsList(comicExchangeOffer);
                }
              }}
              onKeyDown={handleSearchExchangeComics}
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

        {comicExchangeOffer.length > 0 ? (
          <div className="w-full flex flex-col gap-1 items-stretch">
            <div ref={topListPosition} />
            {currentComicsList
              .slice(
                currentPage * comicsPerPage,
                currentPage * comicsPerPage + comicsPerPage
              )
              .map((comics) => (
                <SingleExchangeComics
                  comics={comics}
                  setIsShowingDetails={setIsShowingDetails}
                />
              ))}

            {searchParams.get("search") && (
              <p className="mt-2">
                Hiển thị {currentComicsList.length} kết quả
              </p>
            )}

            <Pagination
              align="center"
              defaultCurrent={1}
              pageSize={comicsPerPage}
              total={currentComicsList.length}
              hideOnSinglePage
              onChange={(page) => {
                setCurrentPage(page - 1);

                if (topListPosition.current) {
                  topListPosition.current.scrollIntoView({
                    behavior: "instant",
                  });
                }
              }}
              className="mt-4"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-8 opacity-60">
            <img src={EmptyIcon} alt="" className="w-1/6" />
            <p className="font-light sm:text-xl text-center">
              CHƯA CÓ TRUYỆN NÀO ĐỂ TRAO ĐỔI!
            </p>
          </div>
        )}
      </div>

      {isShowingDetails && (
        <ExchangeComicsDetails
          comics={isShowingDetails}
          setIsShowingDetails={setIsShowingDetails}
          fetchComicExchangeOffer={fetchComicExchangeOffer}
          setIsUpdating={setIsUpdating}
          handleUndoDelete={handleUndoDelete}
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
