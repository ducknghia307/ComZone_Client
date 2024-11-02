import React, { useEffect, useState } from "react";
import "../ui/AuctionSidebar.css";
import Countdown from "react-countdown";
import { Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';

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

const AllAuctions = ({ filteredGenres, filteredAuthors, filteredConditions  }: any) => {

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
        navigate(`/auctiondetail/${comicId}`); // Điều hướng với ID comic
    };

    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('query');

    // Lọc comics dựa trên query từ URL
    const filteredComics = comics.filter((comic) => {
        const genreMatch = filteredGenres.length > 0 ? comic.genres && comic.genres.some((genre: any) => filteredGenres.includes(genre.name)) : true;
        const authorMatch = filteredAuthors.length > 0 ? filteredAuthors.includes(comic.author) : true;
        const titleMatch = searchQuery ? comic.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        const conditionMatch = filteredConditions.length > 0 ? filteredConditions.includes(comic.condition) : true;
        return genreMatch && authorMatch && titleMatch && conditionMatch;
    });

    if (loading) return <p>Loading auctions...</p>;

    return (
        <div className="mb-10">
            <div className="auction-section flex justify-between items-center">
                <h2 className="text-2xl font-bold">Các Cuộc Đấu Giá Ở ComZone</h2>
            </div>

            <div className="auction-section-detail1 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Đang diễn ra</h2>
            </div>

            <div className="auction-cards mt-4">
                {filteredComics.length > 0 ? (
                    filteredComics.map((comic) => (
                        <div className="auction-card" key={comic.id}>
                            <img
                                src={comic.coverImage}
                                alt={comic.title}
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
                    ))
                ) : (
                    <p>Không tìm thấy kết quả phù hợp</p>
                )}
            </div>
            <div className="auction-section-detail2 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Sắp diễn ra</h2>
            </div>
            <div className="auction-cards mt-4">
                {filteredComics.length > 0 ? (
                    filteredComics.map((comic) => (
                        <div className="auction-card" key={comic.id}>
                            <img
                                src={comic.coverImage}
                                alt={comic.title}
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
                                // onClick={() => handleDetailClick(comic.id)}
                                variant="contained"
                            >
                                Xem Chi Tiết
                            </Button>
                        </div>
                    ))
                ) : (
                    <p>Không tìm thấy kết quả phù hợp</p>
                )}
            </div>

        </div>
    );
};

export default AllAuctions;
