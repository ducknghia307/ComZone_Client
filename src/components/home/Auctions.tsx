import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../ui/Auctions.css";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StarIcon from '@mui/icons-material/Star';
import Countdown from "react-countdown";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const renderer = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="countdown">
            <div className="time-box">
                <span className="time">{days.toString().padStart(2, '0')}</span>
                <span className="label">D</span>
            </div>
            <div className="time-box">
                <span className="time">{hours.toString().padStart(2, '0')}</span>
                <span className="label">H</span>
            </div>
            <div className="time-box">
                <span className="time">{minutes.toString().padStart(2, '0')}</span>
                <span className="label">M</span>
            </div>
            <div className="time-box">
                <span className="time">{seconds.toString().padStart(2, '0')}</span>
                <span className="label">S</span>
            </div>
        </div>
    );
};

const Auctions = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("accessToken"); // Lấy token từ sessionStorage

    useEffect(() => {
        // Gọi API để lấy danh sách comics có status là 'available'
        fetch("http://localhost:3000/comics/status/available", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Available Comics:', data); 
                // Lọc các comics có isAuction là true
                const auctionComics = data.filter((comic) => comic.isAuction === true);
                console.log('Auction Comics:', auctionComics);
                setComics(auctionComics);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching comics:", error);
                setLoading(false);
            });
    }, []);

    const handleDetailClick = (comicId) => {
        navigate(`/auctiondetail/${comicId}`); // Điều hướng với ID của comic
    };
    
    return (
        <div className="w-full py-8">
            <div className="section-title text-2xl font-bold">
                <div className="line"></div>
                <h2 className="title">{comics.length} sản phẩm đang được đấu giá</h2>
                <div className="line"></div>
            </div>

            {loading ? (
        <p>Loading comics...</p>
      ) : (
    
            <div className="hot-comic-cards mt-4">
                <Carousel
                    responsive={responsive}
                    customButtonGroup={<CustomButtonGroup />}
                    renderButtonGroupOutside={true}
                >
                    {comics.map((comic, index) => (
                        <div className="auction-card" key={index}>
                            <img
                                src={comic.coverImage} 
                                alt={comic.title}
                                className=" object-cover mx-auto"
                            />
                            <p className="title">{comic.title}</p>
                            <p className="condition">{comic.condition}</p> 
                            <p className="endtime">KẾT THÚC TRONG</p>
                            <Countdown
                                date={Date.now() + 100000000}  
                                renderer={renderer}
                            />
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
            </div>
      )}
        </div>
    );
    
};

export default Auctions;
