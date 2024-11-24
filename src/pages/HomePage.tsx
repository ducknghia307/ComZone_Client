import CarouselComponent from "../components/home/Carousel";
import HotComic from "../components/home/HotComic";
import Auctions from "../components/home/Auctions";
import AllGenres from "../components/home/AllGenres";
import "../components/ui/HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage w-full overflow-x-hidden">
      <CarouselComponent />
      <HotComic />
      <Auctions />
      <AllGenres />
    </div>
  );
};

export default HomePage;
