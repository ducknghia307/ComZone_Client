import { Carousel } from "antd";
import React from "react";

const CarouselComponent: React.FC = () => (
  <Carousel autoplay className="mt-1">
    <div className="w-full">
      <img
        src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="w-full h-[30em] object-cover"
      />
    </div>
    <div className="w-full">
      <img
        src="https://images.unsplash.com/photo-1486421728445-c460298b20b6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="w-full h-[30em] object-cover"
      />
    </div>{" "}
    <div className="w-full">
      <img
        src="https://images.unsplash.com/photo-1618058368547-e10c14427722?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="w-full h-[30em] object-cover"
      />
    </div>
  </Carousel>
);

export default CarouselComponent;
