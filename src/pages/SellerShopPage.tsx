/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  BaseInterface,
  Comic,
  OrderDetailData,
  SellerDetails,
} from "../common/base.interface";
import { publicAxios } from "../middleware/axiosInstance";
import { useParams, useSearchParams } from "react-router-dom";
import {
  SellerFeedback,
  SellerFeedbackResponse,
} from "../common/interfaces/seller-feedback.interface";
import SellerShopHeader from "../components/sellerShopPage/ShopHeader";
import ShopComicsList from "../components/sellerShopPage/ShopComicsList";
import ShopOverview from "../components/sellerShopPage/ShopOverview";
import Loading from "../components/loading/Loading";
import ShopSellerFeedback from "../components/sellerShopPage/ShopSellerFeedback";

// eslint-disable-next-line react-refresh/only-export-components
export enum SellerShopTabs {
  ALL = "ALL",
  COMICS = "COMICS",
  AUCTIONS = "AUCTIONS",
  FEEDBACK = "FEEDBACK",
}

export interface SellerRecentOrderItem extends BaseInterface {
  comics: Comic;
  order: OrderDetailData;
  price: number;
}

export default function SellerShopPage() {
  const { category, id } = useParams();

  const [currentSeller, setCurrentSeller] = useState<SellerDetails>();

  const [recentOrderItems, setRecentOrderItems] = useState<
    SellerRecentOrderItem[]
  >([]);

  const [fullComicsList, setFullComicsList] = useState<Comic[]>([]);
  const [currentComicsList, setCurrentComicsList] = useState<Comic[]>([]);

  const [feedbackList, setFeedbackList] = useState<SellerFeedback[]>([]);
  const [averageRating, setAverageRating] = useState<number>();
  const [totalFeedback, setTotalFeedback] = useState<number>(0);

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentTab, setCurrentTab] = useState<SellerShopTabs>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useMemo(async () => {
    setIsLoading(true);
    await publicAxios
      .get(`seller-details/user/${id}`)
      .then((res) => {
        setCurrentSeller(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  const fetchSellerFeedback = async () => {
    setIsLoading(true);
    await publicAxios
      .get(`seller-feedback/seller/all/${id}`)
      .then((res) => {
        const feedbackData: SellerFeedbackResponse = res.data;
        console.log(feedbackData);
        setFeedbackList(feedbackData.feedback);
        setTotalFeedback(feedbackData.totalFeedback);
        setAverageRating(feedbackData.averageRating);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const fetchSellerComics = async () => {
    setIsLoading(true);
    await publicAxios
      .get(`comics/seller/${id}`)
      .then((res) => {
        setFullComicsList(res.data);
        if (!searchParams.has("search")) setCurrentComicsList(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const fetchSellerRecentOrders = async () => {
    setIsLoading(true);
    await publicAxios
      .get(`orders/recent/seller/${id}`)
      .then((res) => {
        console.log(res.data);
        setRecentOrderItems(res.data);
      })
      .catch((err) => console.log(err));
  };

  const searchSellerAvailableComics = async () => {
    if (searchInput.length === 0) return;

    await publicAxios
      .get(`comics/search/available/seller/${id}?search=${searchInput}`)
      .then((res) => {
        setCurrentComicsList(res.data);
        setCurrentTab(SellerShopTabs.COMICS);
        setSearchParams({ search: searchInput });
      })
      .catch((err) => console.log(err));
  };

  const handleSearchSellerComics = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);

    if (e.target.value.length === 0) {
      setCurrentComicsList(fullComicsList);
      searchParams.delete("search");
      setSearchParams(searchParams);
    }
  };

  useEffect(() => {
    switch (category) {
      case "all":
        setCurrentTab(SellerShopTabs.ALL);
        break;
      case "comics":
        setCurrentTab(SellerShopTabs.COMICS);
        break;
      case "auctions":
        setCurrentTab(SellerShopTabs.AUCTIONS);
        break;
      case "feedback":
        setCurrentTab(SellerShopTabs.FEEDBACK);
        break;
    }
  }, [category]);

  useEffect(() => {
    const rewriteUrl = (path: string) => {
      window.history.pushState(null, "", `/seller/shop/${path}/${id}`);
    };

    switch (currentTab) {
      case SellerShopTabs.ALL:
        fetchSellerRecentOrders();
        fetchSellerComics();
        fetchSellerFeedback();
        rewriteUrl("all");
        break;
      case SellerShopTabs.COMICS:
        fetchSellerComics();
        rewriteUrl("comics");
        break;
      case SellerShopTabs.AUCTIONS:
        rewriteUrl("auctions");
        break;
      case SellerShopTabs.FEEDBACK:
        fetchSellerFeedback();
        rewriteUrl("feedback");
        break;
    }
  }, [currentTab]);

  const shuffleArray = (array: any[]) => {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  if (!currentSeller) return <Loading />;

  return (
    <div className="REM w-full lg:w-2/3 min-h-[50vh] flex flex-col items-stretch justify-start gap-2 px-4 pt-4 pb-8">
      {isLoading && <Loading />}

      <SellerShopHeader
        currentSeller={currentSeller}
        totalFeedback={totalFeedback}
        averageRating={averageRating}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchInput={searchInput}
        handleSearchSellerComics={handleSearchSellerComics}
        searchSellerAvailableComics={searchSellerAvailableComics}
      />

      {currentTab === SellerShopTabs.ALL && (
        <ShopOverview
          seller={currentSeller.user}
          setCurrentTab={setCurrentTab}
          recentOrderItems={recentOrderItems}
          comicsList={shuffleArray(fullComicsList).slice(0, 10)}
          feedbackList={feedbackList}
        />
      )}

      {currentTab === SellerShopTabs.COMICS && (
        <ShopComicsList
          comicsList={currentComicsList}
          fullComicsList={fullComicsList}
          searchParams={searchParams}
        />
      )}

      {currentTab === SellerShopTabs.FEEDBACK && (
        <ShopSellerFeedback
          seller={currentSeller.user}
          feedbackList={feedbackList}
          totalFeedback={totalFeedback}
        />
      )}
    </div>
  );
}
