import { Carousel } from "antd";
import React from "react";
import ComZoneMarvelImage from "../../assets/home/comzone-comics-wallpaper.png";
import ComZoneSellerImage from "../../assets/home/9f854400-3f19-4443-87ec-59903301456b.jpg";
import ComZoneMangaImage from "../../assets/home/comzone-anime-characters.png";

const CarouselComponent: React.FC = () => {
  const imageList = [ComZoneMarvelImage, ComZoneMangaImage, ComZoneSellerImage];
  return (
    <Carousel autoplay className="mt-1 lg:w-3/4 mx-auto">
      {imageList.map((image, index) => (
        <div key={index} className="w-full">
          <img src={image} alt="" className="w-full h-[40vh] sm:h-[70vh] object-cover" />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
