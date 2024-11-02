import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../ui/Auctions.css";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Countdown from "react-countdown";
import { Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';

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
    carouselState: { currentSlide: number; totalItems: number; slidesToShow: number };
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
                <span className="time1">{days.toString().padStart(2, '0')}</span>
                <span className="label">Ngày</span>
            </div>
            <div className="time-box">
                <span className="time1">{hours.toString().padStart(2, '0')}</span>
                <span className="label">Giờ</span>
            </div>
            <div className="time-box">
                <span className="time1">{minutes.toString().padStart(2, '0')}</span>
                <span className="label">Phút</span>
            </div>
            <div className="time-box">
                <span className="time1">{seconds.toString().padStart(2, '0')}</span>
                <span className="label">Giây</span>
            </div>
        </div>
    );
};

const Auctions: React.FC = () => {
    const navigate = useNavigate();
    const [comics, setComics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComics = async () => {
            try {
                const response = await publicAxios.get("/comics/status/auction");
                const data = response.data;

                // Filter comics where status is AUCTION 
                const auctionComics = data.filter(
                    (comic: any) => comic.status === "AUCTION"
                );

                setComics(auctionComics);
            } catch (error) {
                console.error("Error fetching comics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComics();
    }, []);

    const handleDetailClick = (comicId: string) => {
        navigate(`/auctiondetail/${comicId}`);
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
                        customButtonGroup={<CustomButtonGroup next={() => { }} previous={() => { }} carouselState={{ currentSlide: 0, totalItems: 0, slidesToShow: 0 }} />}
                        renderButtonGroupOutside={true}
                    >
                        {comics.map((comic, index) => (
                            <div className="auction-card" key={index}>
                                <img
                                    src={comic.coverImage?.[0] || "/default-cover.jpg"}
                                    // alt={comic.title}
                                    className=" object-cover mx-auto"
                                />
                                <p className="title">{comic.title}</p>
                                <Chip
                                    label={comic.condition}
                                    icon={<ChangeCircleOutlinedIcon />}
                                    size="medium"
                                />
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
