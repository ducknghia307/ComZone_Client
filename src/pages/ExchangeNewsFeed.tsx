/* eslint-disable react-hooks/exhaustive-deps */
import ExchangePost from "../components/exchangeNewsFeed/ExchangePost";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { privateAxios, publicAxios } from "../middleware/axiosInstance";
import { ExchangePostInterface } from "../common/interfaces/exchange.interface";
import Loading from "../components/loading/Loading";
import ExchangeSearchBar from "../components/exchangeNewsFeed/ExchangeSearchBar";
import CreatePostModal from "../components/exchangeNewsFeed/modal/CreatePostModal";
import "../components/ui/Exchange.css";
import { useAppSelector } from "../redux/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import ExchangeNotFound from "../components/exchangeNewsFeed/ExchangeNotFound";
import ChatModal from "./ChatModal";
import EmptyExchangeList from "../components/exchangeNewsFeed/EmptyExchangeList";
import { Comic } from "../common/base.interface";

export default function ExchangeNewsFeed() {
  const { isLoggedIn, userId } = useAppSelector((state) => state.auth);

  const [postList, setPostList] = useState<ExchangePostInterface[]>([]);
  const [userExchangeComicsList, setUserExchangeComicsList] = useState<Comic[]>(
    []
  );

  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKey, setSearchKey] = useState<string>(
    searchParams.get("search") || ""
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchExchangeNewsFeed = async () => {
    setIsLoading(true);

    try {
      if (searchParams.get("search")) {
        setPostList(
          await publicAxios
            .get(`exchange-posts/search`, {
              params: {
                key: searchKey,
              },
            })
            .then((res) => {
              return res.data;
            })
        );
      } else
        setPostList(
          isLoggedIn
            ? await privateAxios
                .get(`exchange-posts/available/user`)
                .then((res) => {
                  console.log(res.data);
                  return res.data;
                })
            : await publicAxios.get(`exchange-posts/available`).then((res) => {
                console.log(res.data);
                return res.data;
              })
        );

      await privateAxios
        .get("comics/exchange/user")
        .then((res) => setUserExchangeComicsList(res.data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeNewsFeed();
  }, []);

  const handleOpenCreatePost = async () => {
    if (userExchangeComicsList.length === 0) {
      notification.info({
        key: "empty_exchange_comics",
        message: "Bạn chưa có truyện để trao đổi!",
        description: (
          <p className="text-xs">
            Bạn cần có ít nhất 1 truyện dùng để trao đổi trên hệ thống trước khi
            thực hiện đăng bài.
            <br />
            <button
              onClick={() => {
                sessionStorage.setItem("create-exchange-comics", "true");
                navigate("/exchange/comics-collection");
              }}
              className="text-sky-600 underline mt-2"
            >
              Thêm truyện ngay
            </button>
          </p>
        ),
        duration: 8,
      });
    } else {
      setOpenCreatePost(true);
    }
  };

  const handleSearch = async () => {
    if (searchKey.length > 0) {
      setSearchParams({ search: searchKey });
      fetchExchangeNewsFeed();
    } else {
      setSearchParams();
      fetchExchangeNewsFeed();
    }
  };

  useEffect(() => {
    setSearchKey(searchParams.get("search") || "");
    fetchExchangeNewsFeed();
  }, [searchParams]);

  return (
    <div
      id="news-feed-container"
      className="w-full flex justify-center bg-[rgba(0,0,0,0.03)] REM"
    >
      {isLoading && <Loading />}
      <div className="w-full flex items-start justify-center min-h-[80vh] px-8 pb-8 REM">
        <div className="w-full flex flex-col items-center justify-start gap-2 py-8 relative">
          <div id="scroll-to-top" />

          <ExchangeSearchBar
            isLoggedIn={isLoggedIn}
            handleOpenCreatePost={handleOpenCreatePost}
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            handleSearch={handleSearch}
          />

          <CreatePostModal
            openCreatePost={openCreatePost}
            setOpenCreatePost={setOpenCreatePost}
            fetchExchangeNewsFeed={fetchExchangeNewsFeed}
          />

          <div className="w-full xl:w-2/3 flex flex-col items-center justify-start gap-8 py-4">
            {postList && postList.length > 0 ? (
              postList.map((post, index: number) => {
                const tourIndex = postList.findIndex(
                  (post) => post.user.id !== userId
                );
                return (
                  <ExchangePost
                    key={index}
                    post={post}
                    userExchangeComicsList={userExchangeComicsList}
                    index={index}
                    setIsLoading={setIsLoading}
                    currentUserId={userId}
                    setIsChatOpen={setIsChatOpen}
                    tourIndex={tourIndex}
                    navigate={navigate}
                    isLoggedIn={isLoggedIn}
                    fetchExchangeNewsFeed={fetchExchangeNewsFeed}
                  />
                );
              })
            ) : searchParams.get("search") ? (
              <ExchangeNotFound
                searchParams={searchParams}
                isLoading={isLoading}
              />
            ) : (
              <EmptyExchangeList isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>

      <div data-dial-init className="fixed end-6 bottom-6 group">
        <div
          id="speed-dial-menu-default"
          className="flex flex-col items-center mb-4 space-y-2"
        >
          <button
            type="button"
            data-dial-toggle="speed-dial-menu-default"
            aria-controls="speed-dial-menu-default"
            aria-expanded="false"
            onClick={() => {
              document
                .getElementById("navbar-container")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center justify-center text-white bg-black rounded-full w-10 h-10 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              className="w-4 h-4 transition-transform group-hover:scale-150"
              aria-hidden="true"
            >
              <path d="M12 4.83582L5.79291 11.0429L7.20712 12.4571L12 7.66424L16.7929 12.4571L18.2071 11.0429L12 4.83582ZM12 10.4857L5.79291 16.6928L7.20712 18.107L12 13.3141L16.7929 18.107L18.2071 16.6928L12 10.4857Z"></path>
            </svg>
            <span className="sr-only">Lên trên cùng</span>
          </button>
        </div>
      </div>

      <ChatModal isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </div>
  );
}
