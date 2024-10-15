import React, { useEffect, useState } from "react";
// import Footer from "../components/footer/Footer";
import CarouselComponent from "../components/home/Carousel";
import HotComic from "../components/home/HotComic";
import Auctions from "../components/home/Auctions";
import AllGenres from "../components/home/AllGenres";
import axios from "axios";
import "../components/ui/HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const currentUrl = window.location.href;

    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      sessionStorage.setItem("accessToken", tokenFromUrl);
      navigate("/");
      // console.log("Token:", tokenFromUrl);
    }
  }, []);
  console.log("Token:", token);

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
