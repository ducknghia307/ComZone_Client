import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../ui/HotComic.css";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StarIcon from '@mui/icons-material/Star';
import { Link } from "react-router-dom";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 5.5,
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

const CustomButtonGroup = ({ next, previous, goToSlide, carouselState }) => {
  const { currentSlide, totalItems, slidesToShow } = carouselState;
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide + slidesToShow >= totalItems;

  return (
    <div className="custom-button-group">
      {!isFirstSlide && (
        <button className="custom-button custom-button-left" onClick={previous}>
          <ChevronLeftIcon />
        </button>
      )}
      {!isLastSlide && (
        <button className="custom-button custom-button-right" onClick={next}>
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
};

const HotComic = () => {
  return (
    <div className="w-full py-8">
      {/* Truyện tranh nổi bật */}
      <div className="hot-comic-section flex justify-between items-center">
        <h2 className="text-2xl font-bold">Truyện Tranh Nổi Bật</h2>
        <a href="hotcomic" className="text-red-500 font-semibold" style={{ fontSize: '20px' }}>
          Xem tất cả <ChevronRightIcon style={{ width: "30px", height: "30px" }} />
        </a>
      </div>

      <div className="hot-comic-cards mt-4">
        <Carousel
          responsive={responsive}
          customButtonGroup={<CustomButtonGroup />}
          renderButtonGroupOutside={true}
        >
          {/* Cards hot comic */}
          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          <div className="hot-comic-card">
            <Link to="/detail">
              <img
                src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                alt="Hot Comic"
                className=" object-cover mx-auto"
              />
              <p className="price">64,350đ</p>
              <p className="title">MÈO MỐC</p>
              <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
              <div className="rating-sold">
                <p className="rating">{[...Array(5)].map((_, index) => (
                  <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                ))}</p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán 1014</p>
              </div>
            </Link>
          </div>

          
        </Carousel>
      </div>

    </div>
  );
};

export default HotComic;
