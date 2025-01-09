/* eslint-disable react-hooks/exhaustive-deps */
import CarouselComponent from "../components/home/Carousel";
import LatestComics from "../components/home/LatestComics";
import { useEffect, useState } from "react";
import { Auction, Comic } from "../common/base.interface";
import { publicAxios } from "../middleware/axiosInstance";
import RecentAuctions from "../components/home/RecentAuctions";
import SomeExchangePosts from "../components/home/SomeExchangePosts";
import { ExchangePostInterface } from "../common/interfaces/exchange.interface";

const HomePage = () => {
  const [comicsList, setComicsList] = useState<Comic[]>([]);

  const [auctionList, setAuctionList] = useState<{
    ongoing: Auction[];
    upcoming: Auction[];
  }>({ ongoing: [], upcoming: [] });

  const [exchangePostList, setExchangePostList] = useState<
    ExchangePostInterface[]
  >([]);

  const fetchComicsList = async () => {
    await publicAxios
      .get("comics/available/latest")
      .then((res) => {
        console.log(res.data);
        setComicsList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchAuctionList = async () => {
    await publicAxios
      .get("auction/ongoing")
      .then(async (res) => {
        setAuctionList({ ...auctionList, ongoing: res.data });

        if (res.data.length < 10) {
          await publicAxios
            .get(`auction/upcoming/limit/${10 - res.data.length}`)
            .then((res) => {
              setAuctionList({ ...auctionList, upcoming: res.data });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchExchangePosts = async () => {
    await publicAxios
      .get("exchange-posts/short/some")
      .then((res) => {
        console.log(res.data);
        setExchangePostList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchComicsList();
    fetchAuctionList();
    fetchExchangePosts();
  }, []);

  return (
    <div className="REM w-full space-y-24 pb-16 overflow-x-hidden">
      <CarouselComponent />
      <LatestComics comicsList={comicsList} />
      <RecentAuctions auctionList={auctionList} />
      <SomeExchangePosts exchangePostList={exchangePostList} />
    </div>
  );
};

export default HomePage;
