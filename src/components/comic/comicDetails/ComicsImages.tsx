import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React, { useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 4,
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
  setCurrentImage: (img: string) => void;
  imageList: string[];
}) {
  const carouselRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalCarouselRef = useRef<any>(null);
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
  const handleModalNext = () => {
    const currentIndex = imageList.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % imageList.length;
    setCurrentImage(imageList[nextIndex]);
  };

  const handleModalPrev = () => {
    const currentIndex = imageList.indexOf(currentImage);
    const prevIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    setCurrentImage(imageList[prevIndex]);
  };

  return (
    <>
      <div className="w-full bg-white flex flex-col items-center justify-center rounded-xl py-2 drop-shadow-md top-4 sticky max-w-[30rem] min-w-[20rem]">
        <div
          className="w-5/6 p-2 flex justify-center max-w-[25rem] cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img src={currentImage} alt="" className="object-cover h-96 border" />
        </div>
        <div className="flex justify-between items-center w-full max-w-[25rem]">
          {imageList.length > 4 && (
            <Button
              onClick={handlePrev}
              icon={<LeftOutlined />}
              shape="circle"
              className="absolute left-4 z-10"
            />
          )}

          <Carousel
            ref={carouselRef}
            responsive={responsive}
            infinite={false}
            className="w-full relative"
            // renderButtonGroupOutside={true}
            // customButtonGroup={<div />}
          >
            {imageList.map((img: string) => (
              <button
                key={img}
                className=" flex items-center w-full h-[5em] justify-center py-2"
                onClick={() => {
                  console.log({ img });
                  console.log({ imageList });
                  setCurrentImage(img);
                }}
              >
                <img
                  src={img}
                  alt=""
                  className={`object-cover w-16 h-20 max-w-[5em] max-h-[5em] p-1 border rounded-sm 
                  ${currentImage === img ? "border-black" : "hover:opacity-80"}
                 `}
                />
              </button>
            ))}
          </Carousel>
          {imageList.length > 4 && (
            <Button
              onClick={handleNext}
              icon={<RightOutlined />}
              shape="circle"
              className="absolute right-4 z-10"
            />
          )}
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width="80%"
      >
        <div className="flex flex-col items-center">
          <img
            src={currentImage}
            alt=""
            className="object-cover w-auto h-[80vh]"
          />
          <div className="w-1/3 flex justify-between items-center mt-4">
            {imageList.length > 1 && (
              <Button
                onClick={handleModalPrev}
                icon={<LeftOutlined />}
                shape="circle"
                className="absolute left-4 z-10 top-1/2"
              />
            )}

            <Carousel
              ref={modalCarouselRef}
              responsive={responsive}
              infinite={false}
              className="w-full"
            >
              {imageList.map((img: string) => (
                <button
                  key={img}
                  className="flex items-center w-full h-[5em] justify-center py-2"
                  onClick={() => setCurrentImage(img)}
                >
                  <img
                    src={img}
                    alt=""
                    className={`object-cover w-16 h-20 max-w-[5em] max-h-[5em] p-1 border rounded-sm 
                      ${
                        currentImage === img
                          ? "border-black"
                          : "hover:opacity-80"
                      }
                    `}
                  />
                </button>
              ))}
            </Carousel>

            {imageList.length > 1 && (
              <Button
                onClick={handleModalNext}
                icon={<RightOutlined />}
                shape="circle"
                className="absolute right-4 top-1/2 z-10"
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
