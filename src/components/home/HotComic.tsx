import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../ui/HotComic.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Link } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";
import { useAppSelector } from "../../redux/hooks";

const responsive = {
  superLargeDesktop: {
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
const CustomButtonGroup = ({
  next,
  previous,
  carouselState,
}: {
  next: () => void;
  previous: () => void;
  carouselState: {
    currentSlide: number;
    totalItems: number;
    slidesToShow: number;
  };
}) => {
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

const HotComic: React.FC = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  console.log("..........", isLoggedIn);
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        // Use the appropriate Axios instance based on the endpoint
        const response = await publicAxios.get("/comics/status/available"); // For guests
        console.log(response);

        const data = response.data;

        const hotComics = data.filter(
          (comic: any) => comic.condition === "SEALED"
        );

        setComics(hotComics);
        console.log("sealed comic", hotComics);
      } catch (error) {
        console.error("Error fetching comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [isLoggedIn]);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  return (
    <div className="REM w-full py-8">
      {/* Truyện tranh nổi bật */}
      <div className="hot-comic-section flex justify-between items-center bg-black rounded-t-lg ">
        <h2 className="text-2xl font-bold text-white ">
          Truyện Tranh Nguyên Seal
        </h2>
        <a
          href="hotcomic"
          className="text-red-500 font-semibold"
          style={{ fontSize: "20px" }}
        >
          Xem tất cả{" "}
          <ChevronRightIcon style={{ width: "30px", height: "30px" }} />
        </a>
      </div>

      {loading ? (
        <p>Loading comics...</p>
      ) : (
        <div className="hot-comic-cards REMmx-[80px] relative border border-black bg-white rounded-b-lg py-5 ">
          <Carousel
            responsive={responsive}
            customButtonGroup={
              <CustomButtonGroup
                next={() => {}}
                previous={() => {}}
                carouselState={{
                  currentSlide: 0,
                  totalItems: 0,
                  slidesToShow: 0,
                }}
              />
            }
            renderButtonGroupOutside={true}
          >
            {/* Render comics */}
            {comics.map((comic) => (
              <div
                className="bg-white rounded-lg w-[14em] overflow-hidden border drop-shadow-md mx-auto"
                key={comic.id}
              >
                <Link to={`/detail/${comic.id}`}>
                  <img
                    src={comic.coverImage || "/default-cover.jpg"}
                    alt={comic.title}
                    className="object-cover w-full h-80"
                  />
                  <div className="px-3 py-2">
                    <div className="flex flex-row justify-between gap-2 pb-2  min-h-[1.7em] ">
                      {comic?.condition === "SEALED" && (
                        <span className="flex items-center gap-1 basis-1/2 px-2 rounded-2xl bg-sky-800 text-white text-[0.5em] font-light text-nowrap justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="10"
                            height="10"
                            fill="currentColor"
                          >
                            <path d="M12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598L12 1ZM12 3.04879L5 4.60434V13.7889C5 15.1263 5.6684 16.3752 6.7812 17.1171L12 20.5963L17.2188 17.1171C18.3316 16.3752 19 15.1263 19 13.7889V4.60434L12 3.04879ZM16.4524 8.22183L17.8666 9.63604L11.5026 16L7.25999 11.7574L8.67421 10.3431L11.5019 13.1709L16.4524 8.22183Z"></path>
                          </svg>
                          NGUYÊN SEAL
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-xl text-red-500">
                      {formatPrice(comic.price)}
                    </p>
                    <p className="font-light text-sm">
                      {comic.author.toUpperCase()}
                    </p>
                    <p className="font-semibold line-clamp-3 h-[4.5em]">
                      {comic.title}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default HotComic;
