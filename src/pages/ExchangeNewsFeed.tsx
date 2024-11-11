import ExchangePost from "../components/exchange/ExchangePost";
import { Button, message, notification, Tour } from "antd";
import type { TourProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { privateAxios, publicAxios } from "../middleware/axiosInstance";
import { ExchangeRequest } from "../common/interfaces/exchange.interface";
import Loading from "../components/loading/Loading";
import ExchangeSearchBar from "../components/exchange/ExchangeSearchBar";
import CreatePostModal from "../components/exchange/CreatePostModal";
import SubscriptionModal from "../components/exchange/SubscriptionModal";
import "../components/ui/Exchange.css";
import { useAppSelector } from "../redux/hooks";
import { useSearchParams } from "react-router-dom";
import ExchangeNotFound from "../components/exchange/ExchangeNotFound";
import ChatModal from "./ChatModal";

export default function ExchangeNewsFeed() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [beginTour, setBeginTour] = useState(false);
  const [exchangeList, setExchangeList] = useState<ExchangeRequest[]>([]);
  const [findByOwnedMode, setFindByOwnedMode] = useState<boolean>(false);
  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);
  const [openSubscription, setOpenSubscription] = useState<boolean>(false);
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
      title: "Tìm kiếm truyện cho chính mình.",
      description: "Bắt đầu với việc tìm những truyện bạn muốn đổi lấy.",
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
      title: "Truyện người đăng đang tìm kiếm.",
      description: "Xem qua những truyện người đăng đang tìm kiếm.",
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
      description: "Bắt đầu trò chuyện để tiến hành trao đổi với nhau.",
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
    setIsLoading(true);
    try {
      if (searchParams.get("search")) {
        if (!findByOwnedMode) {
          setExchangeList(
            isLoggedIn
              ? await privateAxios
                  .get(`exchange-requests/search/logged`, {
                    params: {
                      key: searchKey,
                    },
                  })
                  .then((res) => {
                    return res.data.data;
                  })
              : await publicAxios
                  .get(`exchange-requests/search`, {
                    params: {
                      key: searchKey,
                    },
                  })
                  .then((res) => {
                    return res.data.data;
                  })
          );
        } else {
          isLoggedIn
            ? setExchangeList(
                await privateAxios
                  .get(`exchange-requests/search/owned`, {
                    params: {
                      key: searchKey,
                    },
                  })
                  .then((res) => {
                    return res.data.data;
                  })
              )
            : alert("Chưa đăng nhập!");
        }
      } else
        setExchangeList(
          isLoggedIn
            ? await privateAxios
                .get(`exchange-requests/available/logged`)
                .then((res) => {
                  return res.data;
                })
            : await publicAxios.get(`exchanges/available`).then((res) => {
                return res.data;
              })
        );
    } catch (err) {
    } finally {
      setIsLoading(false);
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
      message.warning({
        key: "a",
        duration: 2,
        content:
          "Cần ít nhất 1 truyện dùng để trao đổi trước khi được đăng bài tìm trao đổi!",
      });
    } else {
      //FETCH USER'S EXCHANGE SUBSCRIPTION
      if (true) setOpenSubscription(true);
      else setOpenCreatePost(true);
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

  const handleOpenChat = async (exchange: ExchangeRequest) => {
    if (!isLoggedIn) {
      alert("Chưa đăng nhập!");
      return;
    } else {
      setIsLoading(true);
      await privateAxios
        .post("chat-rooms", {
          secondUser: exchange.user.id,
          exchange: exchange.id,
        })
        .then((res) => {
          sessionStorage.setItem("connectedChat", res.data.id);
          setIsChatOpen(true);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="w-full flex justify-center bg-[rgba(0,0,0,0.03)]">
      {isLoading && <Loading />}
      <div className="w-full md:w-3/4 flex items-center justify-center min-h-[80vh] px-8 pb-8 REM">
        <div className="w-full flex flex-col items-center justify-start gap-2 py-8">
          <ExchangeSearchBar
            isLoggedIn={isLoggedIn}
            setBeginTour={setBeginTour}
            findByOwnedMode={findByOwnedMode}
            setFindByOwnedMode={setFindByOwnedMode}
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

          <div className="w-full min-w-[50em] flex flex-col items-center justify-center gap-8 py-4">
            {exchangeList && exchangeList.length > 0 ? (
              exchangeList.map((exchange, index: number) => {
                return (
                  <ExchangePost
                    key={index}
                    exchange={exchange}
                    refs={[ref1, ref2, ref3]}
                    index={index}
                    handleOpenChat={handleOpenChat}
                  />
                );
              })
            ) : (
              <ExchangeNotFound
                searchParams={searchParams}
                isLoading={isLoading}
              />
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
