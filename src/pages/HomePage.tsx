import CarouselComponent from "../components/home/Carousel";
import Auctions from "../components/home/Auctions";
import AllGenres from "../components/home/AllGenres";
import SellingComics from "../components/home/SellingComics";
import { useEffect, useState } from "react";
import { Comic } from "../common/base.interface";
import { publicAxios } from "../middleware/axiosInstance";

const HomePage = () => {
  const [comicsList, setComicsList] = useState<Comic[]>([]);

  const fetchComicsList = async () => {
    await publicAxios
      .get("comics/available/random")
      .then((res) => {
        console.log(res.data);
        setComicsList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchComicsList();
  }, []);

  return (
    <div className="REM w-full space-y-8 overflow-x-hidden">
      <CarouselComponent />
      <SellingComics comicsList={comicsList} />
      <Auctions />
      <AllGenres />
    </div>
  );
};

export default HomePage;
