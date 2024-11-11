import ExchangePost from "../components/exchange/ExchangePost";
import { Button, message, notification, Tour } from "antd";
import type { TourProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { privateAxios, publicAxios } from "../middleware/axiosInstance";
import { ExchangeRequest } from "../common/interfaces/exchange-request.interface";
import Loading from "../components/loading/Loading";
import ExchangeSearchBar from "../components/exchange/ExchangeSearchBar";
import CreatePostModal from "../components/exchange/CreatePostModal";
import SubscriptionModal from "../components/exchange/SubscriptionModal";
import "../components/ui/Exchange.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useSearchParams } from "react-router-dom";
import ExchangeNotFound from "../components/exchange/ExchangeNotFound";
import ChatModal from "./ChatModal";
import EmptyExchangeList from "../components/exchange/EmptyExchangeList";
import { authSlice } from "../redux/features/auth/authSlice";

export default function ExchangeNewsFeed() {
  const { isLoggedIn, isLoading, userId } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const [beginTour, setBeginTour] = useState(false);

  const [exchangeList, setExchangeList] = useState<ExchangeRequest[]>([]);
  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);
  const [openSubscription, setOpenSubscription] = useState<boolean>(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKey, setSearchKey] = useState<string>(
    searchParams.get("search") || ""
  );

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
        setExchangeList(
          await publicAxios
            .get(`exchange-requests/search`, {
              params: {
                key: searchKey,
              },
            })
            .then((res) => {
              return res.data;
            })
        );
      } else
        setExchangeList(
          await publicAxios.get(`exchange-requests/available`).then((res) => {
            console.log(res.data);
            return res.data;
          })
        );
    } catch (err) {
    } finally {
      dispatch(authSlice.actions.updateIsLoading({ isLoading: false }));
    }
  };

  useEffect(() => {
    fetchExchangeNewsFeed();
  }, []);

  const handleOpenCreatePost = async () => {
    const offeredList = await privateAxios
      .get(`comics/exchange-offer/user`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err));

    if (!offeredList || offeredList.length === 0) {
      notification.warning({
        key: "a",
        message: "Chưa được đăng bài",
        description:
          "Cần ít nhất 1 truyện dùng để trao đổi trước khi được đăng bài tìm trao đổi!",
        duration: 5,
      });
    } else {
      //FETCH USER'S EXCHANGE SUBSCRIPTION
      setOpenSubscription(true);
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

  const handleOpenChat = async (exchangeRequest: ExchangeRequest) => {
    if (!isLoggedIn) {
      alert("Chưa đăng nhập!");
      return;
    } else {
      dispatch(authSlice.actions.updateIsLoading({ isLoading: true }));
      await privateAxios
        .post("chat-rooms", {
          secondUser: exchangeRequest.user.id,
          exchangeRequest: exchangeRequest.id,
        })
        .then((res) => {
          sessionStorage.setItem("connectedChat", res.data.id);
          setIsChatOpen(true);
        })
        .catch((err) => console.log(err))
        .finally(() =>
          dispatch(authSlice.actions.updateIsLoading({ isLoading: false }))
        );
    }
  };

  return (
    <div className="w-full flex justify-center bg-[rgba(0,0,0,0.03)]">
      {isLoading && <Loading />}
      <div className="w-full flex items-start justify-center min-h-[80vh] px-8 pb-8 REM border-4">
        <div className="w-full flex flex-col items-center justify-start gap-2 py-8">
          <ExchangeSearchBar
            isLoggedIn={isLoggedIn}
            setBeginTour={setBeginTour}
            handleOpenCreatePost={handleOpenCreatePost}
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            handleSearch={handleSearch}
          />

          <SubscriptionModal
            openSubscription={openSubscription}
            setOpenSubscription={setOpenSubscription}
            handleSelectSubscription={handleSelectSubscription}
          />

          <CreatePostModal
            openCreatePost={openCreatePost}
            setOpenCreatePost={setOpenCreatePost}
          />

          <div className="w-full grid grid-cols-[repeat(auto-fill,50em)] items-stretch justify-center gap-8 py-4">
            {exchangeList && exchangeList.length > 0 ? (
              exchangeList.map((exchangeRequest, index: number) => {
                return (
                  <ExchangePost
                    key={index}
                    exchangeRequest={exchangeRequest}
                    refs={[ref1, ref2, ref3]}
                    index={index}
                    isLoading={isLoading}
                    isSelectModalOpen={isSelectModalOpen}
                    setIsSelectModalOpen={setIsSelectModalOpen}
                    currentUserId={userId}
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
      <Tour
        open={beginTour}
        onClose={() => setBeginTour(false)}
        steps={steps}
      />
      <ChatModal isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </div>
  );
}
