import React, { useEffect, useState } from "react";
// import Footer from "../components/footer/Footer";
import CarouselComponent from "../components/home/Carousel";
import HotComic from "../components/home/HotComic";
import Auctions from "../components/home/Auctions";
import AllGenres from "../components/home/AllGenres";
import axios from "axios";
import "../components/ui/HomePage.css"

const HomePage = () => {
  const [comicData, setComicData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchComicData = async () => {
    setIsLoading(true);
    await axios
      .get("https://669355fcc6be000fa07adfe4.mockapi.io/comic")
      .then((res) => {
        setComicData(res.data);
        setIsLoading(false);
        console.log("Data:", res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchComicData();
  }, []);
  return (
    <div className="homepage w-full overflow-x-hidden ">
      <CarouselComponent />
      <HotComic />
      <Auctions />
      <AllGenres />
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
