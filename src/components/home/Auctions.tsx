import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../ui/Auctions.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Countdown from "react-countdown";
import { Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";

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
        <div className="section-title text-xl font-bold">
          <h2
            className="title"
            style={{
              paddingBottom: "15px",
              color: "#fff",
              textAlign: "center",
            }}
          >
            Các sản phẩm đang được đấu giá
          </h2>
          <div className="line"></div>
        </div>
        {ongoingComics.length === 0 ? (
          <div className="no-auctions">
            <p style={{ color: "#fff", textAlign: "center" }}>Hiện tại không có sản phẩm đấu giá.</p>
          </div>
        ) : (
          <Carousel
            responsive={responsive}
            customButtonGroup={
              <CustomButtonGroup
                next={() => { }}
                previous={() => { }}
                carouselState={{
                  currentSlide: 0,
                  totalItems: 0,
                  slidesToShow: 0,
                }}
              />
            }
            renderButtonGroupOutside={true}
          >
            {ongoingComics.map((comic, index) => (
              <div className="auction-card" key={index}>
                <img
                  src={comic.comics.coverImage}
                  // alt={comic.title}
                  className=" object-fill mx-auto"
                />
                <p className="title">{comic.title}</p>
                <Chip
                  label={comic.comics.condition}
                  icon={<ChangeCircleOutlinedIcon />}
                  size="medium"
                />
                <p className="endtime">KẾT THÚC TRONG</p>
                <Countdown date={new Date(comic.endTime)} renderer={renderer} />
                <Button
                  className="detail-button"
                  onClick={() => handleDetailClick(comic.id)}
                  variant="contained"
                >
                  Xem Chi Tiết
                </Button>
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default Auctions;
// import React from "react";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
// import "../ui/Auctions.css";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import Countdown from "react-countdown";
// import { Button, Chip } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";

// const responsive = {
//   superLargeDesktop: {
//     breakpoint: { max: 4000, min: 1024 },
//     items: 5,
//     slidesToSlide: 2,
//   },
//   desktop: {
//     breakpoint: { max: 1024, min: 800 },
//     items: 4,
//   },
//   tablet: {
//     breakpoint: { max: 800, min: 464 },
//     items: 2,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1,
//   },
// };

// const CustomButtonGroup = ({
//   next,
//   previous,
//   carouselState,
// }: {
//   next: () => void;
//   previous: () => void;
//   carouselState: {
//     currentSlide: number;
//     totalItems: number;
//     slidesToShow: number;
//   };
// }) => {
//   const { currentSlide, totalItems, slidesToShow } = carouselState;
//   const isFirstSlide = currentSlide === 0;
//   const isLastSlide = currentSlide + slidesToShow >= totalItems;

//   return (
//     <div className="custom-button-group">
//       {!isFirstSlide && (
//         <button className="custom-button custom-button-left" onClick={previous}>
//           <ChevronLeftIcon />
//         </button>
//       )}
//       {!isLastSlide && (
//         <button className="custom-button custom-button-right" onClick={next}>
//           <ChevronRightIcon />
//         </button>
//       )}
//     </div>
//   );
// };

// const renderer = ({ days, hours, minutes, seconds }: any) => {
//   return (
//     <div className="countdown">
//       <div className="time-box">
//         <span className="time1">{days.toString().padStart(2, "0")}</span>
//         <span className="label">Ngày</span>
//       </div>
//       <div className="time-box">
//         <span className="time1">{hours.toString().padStart(2, "0")}</span>
//         <span className="label">Giờ</span>
//       </div>
//       <div className="time-box">
//         <span className="time1">{minutes.toString().padStart(2, "0")}</span>
//         <span className="label">Phút</span>
//       </div>
//       <div className="time-box">
//         <span className="time1">{seconds.toString().padStart(2, "0")}</span>
//         <span className="label">Giây</span>
//       </div>
//     </div>
//   );
// };

// const mockAuctions = [
//   {
//     id: "1",
//     title: "Naruto Manga vol. 1",
//     comics: {
//       coverImage: "https://example.com/naruto1.jpg",
//       condition: "Như Mới"
//     },
//     endTime: new Date(Date.now() + 86400000), // 24 hours from now
//   },
//   {
//     id: "2",
//     title: "One Piece Manga vol. 50",
//     comics: {
//       coverImage: "https://example.com/onepiece50.jpg",
//       condition: "Tốt"
//     },
//     endTime: new Date(Date.now() + 172800000), // 48 hours from now
//   },
//   {
//     id: "3",
//     title: "Dragon Ball Complete Set",
//     comics: {
//       coverImage: "https://example.com/dragonball.jpg",
//       condition: "Cũ"
//     },
//     endTime: new Date(Date.now() + 259200000), // 72 hours from now
//   },
//   {
//     id: "4",
//     title: "Attack on Titan vol. 1",
//     comics: {
//       coverImage: "https://example.com/aot1.jpg",
//       condition: "Như Mới"
//     },
//     endTime: new Date(Date.now() + 345600000), // 96 hours from now
//   },
//   {
//     id: "5",
//     title: "My Hero Academia vol. 10",
//     comics: {
//       coverImage: "https://example.com/mha10.jpg",
//       condition: "Tốt"
//     },
//     endTime: new Date(Date.now() + 432000000), // 120 hours from now
//   },
//   {
//     id: "6",
//     title: "Death Note Complete Set",
//     comics: {
//       coverImage: "https://example.com/deathnote.jpg",
//       condition: "Như Mới"
//     },
//     endTime: new Date(Date.now() + 518400000), // 144 hours from now
//   },
//   {
//     id: "7",
//     title: "Demon Slayer vol. 5",
//     comics: {
//       coverImage: "https://example.com/demonslayer5.jpg",
//       condition: "Tốt"
//     },
//     endTime: new Date(Date.now() + 604800000), // 168 hours from now
//   },
//   {
//     id: "8",
//     title: "Fullmetal Alchemist vol. 20",
//     comics: {
//       coverImage: "https://example.com/fma20.jpg",
//       condition: "Cũ"
//     },
//     endTime: new Date(Date.now() + 691200000), // 192 hours from now
//   },
//   {
//     id: "9",
//     title: "Bleach Complete Set",
//     comics: {
//       coverImage: "https://example.com/bleach.jpg",
//       condition: "Như Mới"
//     },
//     endTime: new Date(Date.now() + 777600000), // 216 hours from now
//   },
//   {
//     id: "10",
//     title: "Chainsaw Man vol. 1",
//     comics: {
//       coverImage: "https://example.com/chainsawman1.jpg",
//       condition: "Tốt"
//     },
//     endTime: new Date(Date.now() + 864000000), // 240 hours from now
//   }
// ];

// const Auctions: React.FC = () => {
//   const navigate = useNavigate();

//   const handleDetailClick = (auctionId: string) => {
//     navigate(`/auctiondetail/${auctionId}`);
//   };

//   return (
//     <div className="w-full py-8 auction-container1">
//       <div className="mt-4 big-cards">
//         <div className="section-title text-xl font-bold">
//           <h2 className="title" style={{ paddingBottom: '15px', color: '#fff', textAlign:'center' }}>
//             Các sản phẩm đang được đấu giá
//           </h2>
//           <div className="line"></div>
//         </div>
//         <Carousel
//           responsive={responsive}
//           customButtonGroup={
//             <CustomButtonGroup
//               next={() => { }}
//               previous={() => { }}
//               carouselState={{
//                 currentSlide: 0,
//                 totalItems: mockAuctions.length,
//                 slidesToShow: responsive.desktop.items,
//               }}
//             />
//           }
//           renderButtonGroupOutside={true}
//         >
//           {mockAuctions.map((comic, index) => (
//             <div className="auction-card mb-0" key={index}>
//               <img
//                 src={comic.comics.coverImage}
//                 alt={comic.title}
//                 className="object-fill mx-auto"
//               />
//               <p className="title">{comic.title}</p>
//               <Chip
//                 label={comic.comics.condition}
//                 icon={<ChangeCircleOutlinedIcon />}
//                 size="medium"
//               />
//               <p className="endtime">KẾT THÚC TRONG</p>
//               <Countdown date={comic.endTime} renderer={renderer} />
//               <Button
//                 className="detail-button"
//                 onClick={() => handleDetailClick(comic.id)}
//                 variant="contained"
//               >
//                 Xem Chi Tiết
//               </Button>
//             </div>
//           ))}
//         </Carousel>
//       </div>
//     </div>
//   );
// };

// export default Auctions;
