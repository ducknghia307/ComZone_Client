import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../ui/HotComic.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import { useAppSelector } from "../../redux/hooks";

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
        const response = isLoggedIn
          ? await privateAxios.get("/comics/except-seller/available") // For logged-in users
          : await publicAxios.get("/comics/status/available"); // For guests

        setComics(response.data);
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
    <div className="w-full py-8">
      {/* Truyện tranh nổi bật */}
      <div className="hot-comic-section flex justify-between items-center">
        <h2 className="text-2xl font-bold">Truyện Tranh Nổi Bật</h2>
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
        <div className="hot-comic-cards mt-4">
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
              <div className="hot-comic-card" key={comic.id}>
                <Link to={`/detail/${comic.id}`}>
                  <img
                    src={comic.coverImage}
                    alt={comic.title}
                    className="object-cover mx-auto"
                  />
                  <p className="price">{formatPrice(comic.price)}</p>
                  <p className="author">{comic.author.toUpperCase()}</p>
                  <p className="title">{comic.title}</p>
                  <div className="rating-sold-comic">
                    <p className="rating">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          style={{ width: "20px", color: "#ffc107" }}
                        />
                      ))}
                    </p>
                    <div className="divider"></div>
                    <p className="sold-info">Đã bán {comic.sold}</p>
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
