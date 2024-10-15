import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 1024 },
    items: 5,
    slidesToSlide: 2,
  },
  desktop: {
    breakpoint: { max: 1024, min: 800 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 800, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
const HotComic = () => {
  return (
    <div className="w-full">
      <Carousel responsive={responsive}>
        <div>
          <img
            src="https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg"
            alt=""
            className="w-4/5 h-60 mx-4 my-4"
          />
        </div>
        <div>
          <img
            src="https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg"
            alt=""
            className="w-full h-60 mx-auto my-4"
          />
        </div>
        <div>
          <img
            src="https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg"
            alt=""
            className="w-full h-60 mx-auto my-4"
          />
        </div>
        <div>
          <img
            src="https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg"
            alt=""
            className="w-full h-60 mx-auto my-4"
          />
        </div>
        <div>
          <img
            src="https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg"
            alt=""
            className="w-full h-60 mx-auto my-4"
          />
        </div>
        <div>
          <img
            src="https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg"
            alt=""
            className="w-full h-60 mx-auto my-4"
          />
        </div>
        <div>
          <img
            src="https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg"
            alt=""
            className="w-full h-60 mx-auto my-4"
          />
        </div>
        <div>
          <img
            src="https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg"
            alt=""
            className="w-full h-60 mx-auto my-4"
          />
        </div>
        <div>
          <img
            src="https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg"
            alt=""
            className="w-full h-60 mx-auto my-4"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default HotComic;
