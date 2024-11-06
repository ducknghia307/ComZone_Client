import ExchangePost from "../components/exchange/ExchangePost";
import { Button, Tour } from "antd";
import type { TourProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { privateAxios } from "../middleware/axiosInstance";
import { Exchange } from "../common/interfaces/exchange.interface";
import Loading from "../components/loading/Loading";
import ExchangeSearchBar from "../components/exchange/ExchangeSearchBar";
import CreatePostModal from "../components/exchange/CreatePostModal";
import SubscriptionModal from "../components/exchange/SubscriptionModal";

export default function ExchangeNewsFeed() {
  const [isLoading, setIsLoading] = useState(false);
  const [beginTour, setBeginTour] = useState(false);
  const [exchangeList, setExchangeList] = useState<Exchange[]>([]);
  const [findByOfferMode, setFindByOfferMode] = useState<boolean>(false);
  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);
  const [openSubscription, setOpenSubscription] = useState<boolean>(false);

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
          marginInline: "0px",
          padding: "0px",
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
          marginInline: "0px",
          padding: "0px",
        },
      },
      prevButtonProps: {
        children: (
          <Button size="small" className="px-2">
            Quay lại
          </Button>
        ),
        style: {
          marginInline: "0px",
          marginRight: "4px",
          padding: "0px",
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
          marginInline: "0px",
          padding: "0px",
        },
      },
      prevButtonProps: {
        children: (
          <Button size="small" className="px-2">
            Quay lại
          </Button>
        ),
        style: {
          marginInline: "0px",
          marginRight: "4px",
          padding: "0px",
        },
      },
    },
  ];

  const fetchExchangeNewsFeed = async () => {
    setIsLoading(true);
    await privateAxios
      .get("exchanges/available")
      .then((res) => {
        setExchangeList(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchExchangeNewsFeed();
  }, []);

  const handleOpenCreatePost = () => {
    //FETCH USER'S EXCHANGE SUBSCRIPTION

    if (true) setOpenSubscription(true);
    else setOpenCreatePost(true);
  };

  const handleSelectSubscription = () => {
    setOpenSubscription(false);
    setOpenCreatePost(true);
  };

  return (
    <div className="w-full flex justify-center bg-[rgba(0,0,0,0.03)]">
      {isLoading && <Loading />}
      <div className="w-full md:w-3/4 flex justify-center min-h-[80vh] px-8 pb-8 REM">
        <div className="w-full flex flex-col items-center justify-start gap-2 py-8">
          <ExchangeSearchBar
            setBeginTour={setBeginTour}
            findByOfferMode={findByOfferMode}
            setFindByOfferMode={setFindByOfferMode}
            handleOpenCreatePost={handleOpenCreatePost}
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

          <div className="w-full flex flex-col justify-center gap-8 py-4">
            {exchangeList.map((exchange, index: number) => {
              return (
                <ExchangePost
                  exchange={exchange}
                  refs={[ref1, ref2, ref3]}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </div>
      <Tour
        open={beginTour}
        onClose={() => setBeginTour(false)}
        steps={steps}
      />
    </div>
  );
}
