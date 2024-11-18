import ExchangePost from "../components/exchangeNewsFeed/ExchangePost";
import { Button, notification, Tour } from "antd";
import type { TourProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { privateAxios, publicAxios } from "../middleware/axiosInstance";
import {
  Exchange,
  ExchangePostInterface,
} from "../common/interfaces/exchange.interface";
import Loading from "../components/loading/Loading";
import ExchangeSearchBar from "../components/exchangeNewsFeed/ExchangeSearchBar";
import CreatePostModal from "../components/exchangeNewsFeed/CreatePostModal";
import "../components/ui/Exchange.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import ExchangeNotFound from "../components/exchangeNewsFeed/ExchangeNotFound";
import ChatModal from "./ChatModal";
import EmptyExchangeList from "../components/exchangeNewsFeed/EmptyExchangeList";
import { authSlice } from "../redux/features/auth/authSlice";
import { Comic } from "../common/base.interface";

export default function ExchangeNewsFeed() {
  const { isLoggedIn, isLoading, userId } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const [beginTour, setBeginTour] = useState(false);

  const [postList, setPostList] = useState<ExchangePostInterface[]>([]);
  const [userExchangeComicsList, setUserExchangeComicsList] = useState<Comic[]>(
    []
  );

  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);
  const [openSubscription, setOpenSubscription] = useState<boolean>(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKey, setSearchKey] = useState<string>(
    searchParams.get("search") || ""
  );

  const navigate = useNavigate();

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const steps: TourProps["steps"] = [
    {
      title: "Truyện người khác cần.",
      description:
        "Bắt đầu với việc xem thử bạn có truyện người khác cần hay không.",
      cover: (
        <img
          alt="select_tour"
          src="https://cdn-icons-png.freepik.com/256/12640/12640222.png?semt=ais_hybrid"
          className="max-w-[100px] mx-auto"
        />
      ),
      placement: "rightTop",
      target: () => ref1.current,
      nextButtonProps: {
        children: (
          <Button type="primary" size="small">
            Tiếp theo
          </Button>
        ),
        style: {
          marginInlineStart: "0px",
          padding: "0px 8px",
        },
      },
    },
    {
      title: "Xem truyện họ đang có.",
      description:
        "Bạn có thể xem danh sách những truyện người đăng đang có trong trang cá nhân của họ.",
      cover: (
        <img
          alt="select_tour"
          src="https://cdn-icons-png.flaticon.com/512/8424/8424155.png"
          className="max-w-[100px] mx-auto"
        />
      ),
      placement: "leftTop",
      target: () => ref2.current,
      nextButtonProps: {
        children: (
          <Button type="primary" size="small">
            Tiếp theo
          </Button>
        ),
        style: {
          marginInlineStart: "0px",
          padding: "0px 8px",
        },
      },
      prevButtonProps: {
        children: <Button size="small">Quay lại</Button>,
        style: {
          marginInlineStart: "0px",
          marginRight: "4px",
          padding: "0px 8px",
        },
      },
    },
    {
      title: "Bắt đầu trao đổi.",
      description:
        "Bắt đầu chọn truyện của bạn để gửi yêu cầu đến người muốn trao đổi, sau đó trò chuyện và xác nhận để hoàn tất.",
      cover: (
        <img
          alt="select_tour"
          src="https://cdn-icons-png.flaticon.com/512/10828/10828522.png"
          className="max-w-[100px] mx-auto"
        />
      ),
      placement: "topLeft",
      target: () => ref3.current,
      nextButtonProps: {
        children: (
          <Button type="primary" size="small">
            Hoàn tất
          </Button>
        ),
        style: {
          marginInlineStart: "0px",
          padding: "0px 8px",
        },
      },
      prevButtonProps: {
        children: <Button size="small">Quay lại</Button>,
        style: {
          marginInlineStart: "0px",
          marginRight: "4px",
          padding: "0px 8px",
        },
      },
    },
  ];

  const fetchExchangeNewsFeed = async () => {
    dispatch(authSlice.actions.updateIsLoading({ isLoading: true }));
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
          await publicAxios.get(`exchange-posts/available`).then((res) => {
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
      dispatch(authSlice.actions.updateIsLoading({ isLoading: false }));
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
      //FETCH USER'S EXCHANGE SUBSCRIPTION
      setOpenCreatePost(true);
    }
  };

  const handleSelectSubscription = () => {
    setOpenSubscription(false);
    setOpenCreatePost(true);
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

  const handleOpenChat = async (exchange: Exchange) => {
    // if (!isLoggedIn) {
    //   alert("Chưa đăng nhập!");
    //   return;
    // } else {
    //   dispatch(authSlice.actions.updateIsLoading({ isLoading: true }));
    //   await privateAxios
    //     .post("chat-rooms", {
    //       secondUser: exchange.user.id,
    //       exchange: exchange.id,
    //     })
    //     .then((res) => {
    //       sessionStorage.setItem("connectedChat", res.data.id);
    //       setIsChatOpen(true);
    //     })
    //     .catch((err) => console.log(err))
    //     .finally(() =>
    //       dispatch(authSlice.actions.updateIsLoading({ isLoading: false }))
    //     );
    // }
  };

  return (
    <div className="w-full flex justify-center bg-[rgba(0,0,0,0.03)]">
      {isLoading && <Loading />}
      <div className="w-full flex items-start justify-center min-h-[80vh] px-8 pb-8 REM">
        <div className="w-full flex flex-col items-center justify-start gap-2 py-8">
          <ExchangeSearchBar
            isLoggedIn={isLoggedIn}
            setBeginTour={setBeginTour}
            handleOpenCreatePost={handleOpenCreatePost}
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            handleSearch={handleSearch}
          />

          {/* <SubscriptionModal
            openSubscription={openSubscription}
            setOpenSubscription={setOpenSubscription}
            handleSelectSubscription={handleSelectSubscription}
          /> */}

          <CreatePostModal
            openCreatePost={openCreatePost}
            setOpenCreatePost={setOpenCreatePost}
            fetchExchangeNewsFeed={fetchExchangeNewsFeed}
          />

          <div className="w-full grid grid-cols-[repeat(auto-fill,50em)] items-stretch justify-center gap-8 py-4">
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
                    refs={[ref1, ref2, ref3]}
                    index={index}
                    isLoading={isLoading}
                    isSelectModalOpen={isSelectModalOpen}
                    setIsSelectModalOpen={setIsSelectModalOpen}
                    currentUserId={userId}
                    isChatOpen={isChatOpen}
                    setIsChatOpen={setIsChatOpen}
                    tourIndex={tourIndex}
                    navigate={navigate}
                    isLoggedIn={isLoggedIn}
                  />
                );
              })
            ) : searchParams.get("search") ? (
              <ExchangeNotFound
                searchParams={searchParams}
                isLoading={isLoading}
              />
            ) : (
              !isLoading && <EmptyExchangeList isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
      <Tour
        open={beginTour}
        onClose={() => setBeginTour(false)}
        steps={steps}
      />
      <ChatModal isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </div>
  );
}
