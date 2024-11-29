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

      //Fetch logged in user's exchange comics list
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
              onClick={() => navigate("")}
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
    <div className="w-full flex justify-center bg-[rgba(0,0,0,0.03)]">
      {isLoading && <Loading />}
      <div className="w-full flex items-start justify-center min-h-[80vh] px-8 pb-8 REM">
        <div className="w-full flex flex-col items-center justify-start gap-2 py-8">
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

      <ChatModal isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </div>
  );
}
