import React, { useEffect, useState } from "react";
// import Footer from "../components/footer/Footer";
import CarouselComponent from "../components/home/Carousel";
import HotComic from "../components/home/HotComic";
import Auctions from "../components/home/Auctions";
import AllGenres from "../components/home/AllGenres";
import axios from "axios";
import "../components/ui/HomePage.css"

const HomePage = () => {
  
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
