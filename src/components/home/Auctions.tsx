import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../ui/Auctions.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";
import SellIcon from "@mui/icons-material/Sell";

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

const renderer = ({ days, hours, minutes, seconds }: any) => {
  return (
    <div className="countdown">
      <div className="time-box">
        <span className="time1">{days.toString().padStart(2, "0")}</span>
        <span className="label">Ngày</span>
      </div>
      <div className="time-box">
        <span className="time1">{hours.toString().padStart(2, "0")}</span>
        <span className="label">Giờ</span>
      </div>
      <div className="time-box">
        <span className="time1">{minutes.toString().padStart(2, "0")}</span>
        <span className="label">Phút</span>
      </div>
      <div className="time-box">
        <span className="time1">{seconds.toString().padStart(2, "0")}</span>
        <span className="label">Giây</span>
      </div>
    </div>
  );
};

const Auctions: React.FC = () => {
  const navigate = useNavigate();

  const [ongoingComics, setOngoingComics] = useState<any[]>([]);
  console.log("ongoingComics", ongoingComics);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await publicAxios.get("/auction");
        const data = response.data;
        console.log("Available Comics:", response.data);

        const auctionComics = data.filter(
          (auction: any) => auction.status === "ONGOING"
        );
        console.log("Auction Comics:", auctionComics);

        setOngoingComics(auctionComics);
      } catch (error) {
        console.error("Error fetching comics:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchComics();
  }, []);

  const handleDetailClick = (auctionId: string) => {
    navigate(`/auctiondetail/${auctionId}`);
  };

  return (
    <div className="w-full py-8 auction-container1">
      <div className="mt-4 big-cards">
        <div className="section-title text-xl font-bold flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Các sản phẩm đang được đấu giá
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
        {ongoingComics.length === 0 ? (
          <div className="no-auctions">
            <p
              style={{ color: "#000", textAlign: "center", fontFamily: "REM" }}
            >
              Hiện tại không có sản phẩm đấu giá.
            </p>
          </div>
        ) : (
          <Carousel
          className="mt-6"
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
            {ongoingComics.map((comic) => (
              <div
                className="bg-white rounded-lg w-[14em] overflow-hidden border drop-shadow-md cursor-pointer m-auto"
                key={comic.id}
                onClick={() => handleDetailClick(comic.id)}
              >
                <img
                  src={comic.comics.coverImage}
                  alt={comic.comics.title}
                  className="object-cover w-full h-80"
                />

                <div className="px-3 py-2">
                  <div className="flex flex-row justify-between gap-2 pb-2 min-h-[1.7em] mt-2">
                    {comic?.comics?.condition === "SEALED" && (
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
                    {comic?.comics.edition !== "REGULAR" && (
                      <span
                        className={`flex items-center gap-1 px-2 basis-1/2 py-1 rounded-2xl ${
                          comic?.edition === "SPECIAL"
                            ? "bg-yellow-600"
                            : "bg-red-800"
                        } text-white text-[0.5em] font-light text-nowrap justify-center`}
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
                        {comic?.edition === "SPECIAL"
                          ? "BẢN ĐẶC BIỆT"
                          : "BẢN GIỚI HẠN"}
                      </span>
                    )}
                  </div>
                  {/* Comic Title */}
                  <p className="font-bold line-clamp-6 h-[4.5rem]">
                    {comic.comics.title}
                  </p>
                  {/* Current Price */}
                  <p className="font-semibold mt-2 mb-2 flex items-center justify-center">
                    <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full shadow-sm flex items-center gap-1 text-sm flex-nowrap whitespace-nowrap max-w-full">
                      <SellIcon sx={{ fontSize: 12 }} />
                      Giá hiện tại:{" "}
                      <span className="font-bold">
                        {comic.currentPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </span>
                  </p>
                  {/* Countdown Timer */}
                  <p className="font-semibold">KẾT THÚC TRONG</p>
                  <Countdown
                    date={new Date(comic.endTime)}
                    renderer={renderer}
                  />
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default Auctions;
