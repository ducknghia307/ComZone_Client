import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../ui/AllGenres.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";
import { Comic } from "../../common/base.interface";
import CurrencySplitter from "../../assistants/Spliter";

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

const AllGenres: React.FC = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const token = sessionStorage.getItem("accessToken");

  // useEffect(() => {
  //   // Gọi API để lấy danh sách comics có status là 'available'
  //   fetch("http://localhost:3000/comics/status/available", {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log('Available Comics:', data);
  //       setComics(data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching comics:", error);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await publicAxios.get("/comics/status/available");
        console.log(response.data);
        setComics(response.data);
      } catch (error) {
        console.error("Error fetching comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  return (
    <div className="w-full py-8">
      {/* Truyện tranh nổi bật */}
      <div className="hot-comic-section flex justify-between items-center bg-black rounded-t-lg  ">
        <h2 className="text-2xl font-bold text-white">Tất Cả Thể Loại</h2>
        <Link
          to="/genres"
          className="text-red-500 font-semibold"
          style={{ fontSize: "20px" }}
        >
          Xem tất cả{" "}
          <ChevronRightIcon style={{ width: "30px", height: "30px" }} />
        </Link>
      </div>

      {loading ? (
        <p>Loading comics...</p>
      ) : (
        <div className="hot-comic-cards REM mx-[80px] relative border border-black bg-white rounded-b-lg py-5">
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
                className="bg-white rounded-lg w-[14em] overflow-hidden border drop-shadow-md mx-auto "
                key={comic.id}
              >
                <Link to={`/detail/${comic.id}`}>
                  <img
                    src={comic.coverImage || "/default-cover.jpg"}
                    alt={comic.title}
                    className="object-cover w-full h-80"
                  />
                  <div className="px-3 py-2">
                    <div className="flex flex-row justify-between gap-2 pb-2 min-h-[1.7em] ">
                      {comic.edition.isSpecial && (
                        <span
                          className={`flex items-center gap-1 px-2 basis-1/2 py-1 rounded-2xl bg-red-700 text-white text-[0.5em] font-light text-nowrap justify-center`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="10"
                            height="10"
                            fill="currentColor"
                          >
                            <path d="M10.6144 17.7956C10.277 18.5682 9.20776 18.5682 8.8704 17.7956L7.99275 15.7854C7.21171 13.9966 5.80589 12.5726 4.0523 11.7942L1.63658 10.7219C.868536 10.381.868537 9.26368 1.63658 8.92276L3.97685 7.88394C5.77553 7.08552 7.20657 5.60881 7.97427 3.75892L8.8633 1.61673C9.19319.821767 10.2916.821765 10.6215 1.61673L11.5105 3.75894C12.2782 5.60881 13.7092 7.08552 15.5079 7.88394L17.8482 8.92276C18.6162 9.26368 18.6162 10.381 17.8482 10.7219L15.4325 11.7942C13.6789 12.5726 12.2731 13.9966 11.492 15.7854L10.6144 17.7956ZM4.53956 9.82234C6.8254 10.837 8.68402 12.5048 9.74238 14.7996 10.8008 12.5048 12.6594 10.837 14.9452 9.82234 12.6321 8.79557 10.7676 7.04647 9.74239 4.71088 8.71719 7.04648 6.85267 8.79557 4.53956 9.82234ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899ZM18.3745 19.0469 18.937 18.4883 19.4878 19.0469 18.937 19.5898 18.3745 19.0469Z"></path>
                          </svg>
                          {comic.edition.name}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-xl text-red-500">
                      {CurrencySplitter(comic.price)} &#8363;
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

export default AllGenres;
