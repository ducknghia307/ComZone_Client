import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Comic } from "../../common/base.interface";
import "./style.css";
import CurrencySplitter from "../../assistants/Spliter";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 7,
    slidesToSlide: 2,
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

export default function ComicsHorizontalMenu({
  comicsList,
}: {
  comicsList: Comic[] | [];
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
    <div className="w-full relative">
      <Button
        onClick={handlePrev}
        icon={<LeftOutlined />}
        shape="circle"
        className="absolute left-4 z-10 top-1/2"
      />
      <Carousel
        ref={carouselRef}
        responsive={responsive}
        infinite={false}
        className="w-full relative"
      >
        {comicsList.map((comics: Comic) => (
          <div
            key={comics.id}
            className="min-w-40 w-1/2 flex flex-col justify-start items-start border border-gray-300 rounded-lg overflow-hidden ml-2"
          >
            <div
              className={`w-full h-64 bg-cover bg-center bg-no-repeat`}
              style={{ backgroundImage: `url(${comics.coverImage[0]})` }}
            />
            <p className="wrapTitle px-1 pt-2">{comics.title}</p>
            <p className="flex items-start gap-1 font-semibold text-xl p-2">
              {CurrencySplitter(comics.price)}
              <span className="underline text-[0.6em]">đ</span>
            </p>
          </div>
        ))}
      </Carousel>
      <Button
        onClick={handleNext}
        icon={<RightOutlined />}
        shape="circle"
        className="absolute right-4 z-10 top-1/2"
      />
    </div>
  );
}
