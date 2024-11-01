import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function ComicsImages({
  currentImage,
  setCurrentImage,
  imageList,
}: {
  currentImage: string;
  setCurrentImage: Function;
  imageList: string[];
}) {
  const carouselRef = useRef<any>(null);

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  return (
    <div className="w-full bg-white flex flex-col items-center justify-center rounded-xl py-2 drop-shadow-md top-4 sticky">
      <div className="w-2/3 p-2 flex justify-center">
        <img
          src={currentImage}
          alt=""
          className="object-cover h-96 border"
          data-addtocart
        />
      </div>
      <div className="flex justify-between items-center w-full px-4 ">
        <Button
          // className="bg-gray-200 p-2 rounded-md hover:bg-gray-300"
          onClick={handlePrev}
          icon={<LeftOutlined />}
          shape="circle"
          className="absolute left-4 z-10"
        />

        <Carousel
          ref={carouselRef}
          responsive={responsive}
          infinite={false}
          className="w-full relative "
          renderButtonGroupOutside={true}
          customButtonGroup={<div />}
        >
          {imageList.map((img: string) => (
            <button
              key={img}
              className=" flex items-center w-full justify-center py-2"
              onClick={() => setCurrentImage(img)}
            >
              <img
                src={img}
                alt=""
                className={`object-cover max-w-[5em] max-h-[5em] border ${
                  currentImage.match(img) ? "border-black" : ""
                } p-1 ${!currentImage.match(img) ? "hover:opacity-80" : ""}`}
              />
            </button>
          ))}
        </Carousel>
        <Button
          onClick={handleNext}
          icon={<RightOutlined />}
          shape="circle"
          className="absolute right-4 z-10"
        />
      </div>
    </div>
  );
}
