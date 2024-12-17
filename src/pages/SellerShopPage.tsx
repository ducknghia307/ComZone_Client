/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  Auction,
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
import ShopAuctionsList from "../components/sellerShopPage/ShopAuctionsList";

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

  const [auctionList, setAuctionList] = useState<Auction[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentTab, setCurrentTab] = useState<SellerShopTabs>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [firstLoad, setFirstLoad] = useState<boolean>(true);

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
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const fetchSellerAuctions = async () => {
    setIsLoading(true);
    await publicAxios
      .get(`auction/active/seller/${id}`)
      .then((res) => {
        console.log("AUCTIONS: ", res.data);
        setAuctionList(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
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
      if (firstLoad) setFirstLoad(false);
      else window.history.pushState(null, "", `/seller/shop/${path}/${id}`);
    };

    switch (currentTab) {
      case SellerShopTabs.ALL:
        fetchSellerRecentOrders();
        fetchSellerComics();
        fetchSellerAuctions();
        fetchSellerFeedback();
        rewriteUrl("all");
        break;
      case SellerShopTabs.COMICS:
        fetchSellerComics();
        rewriteUrl("comics");
        break;
      case SellerShopTabs.AUCTIONS:
        fetchSellerAuctions();
        rewriteUrl("auctions");
        break;
      case SellerShopTabs.FEEDBACK:
        fetchSellerFeedback();
        rewriteUrl("feedback");
        break;
    }

    document
      .getElementById("navbar-container")
      ?.scrollIntoView({ behavior: "instant" });
  }, [currentTab]);

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
        setIsLoading={setIsLoading}
      />

      {currentTab === SellerShopTabs.ALL && (
        <ShopOverview
          seller={currentSeller.user}
          setCurrentTab={setCurrentTab}
          recentOrderItems={recentOrderItems}
          comicsList={fullComicsList}
          auctionsList={auctionList}
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

      {currentTab === SellerShopTabs.AUCTIONS && (
        <ShopAuctionsList auctionsList={auctionList} />
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
