import React, { useEffect, useState } from "react";
// import Footer from "../components/footer/Footer";
import CarouselComponent from "../components/home/Carousel";
import HotComic from "../components/home/HotComic";
import axios from "axios";

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
    <div className="w-full overflow-x-hidden">
      <CarouselComponent />
      <HotComic />
      {/* <Footer /> */}
      <div className="h-screen"></div>
    </div>
  );
};

export default HomePage;
