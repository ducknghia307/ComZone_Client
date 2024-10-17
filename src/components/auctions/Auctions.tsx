import React, { useEffect, useState } from "react";
import "../ui/AuctionSidebar.css";
import Countdown from "react-countdown";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const AllAuctions = ({ filteredGenres, filteredAuthors }) => {

    const navigate = useNavigate();
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
        navigate(`/auctiondetail/${comicId}`); // Điều hướng với ID comic
    };

    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('query');

    // Lọc comics dựa trên query từ URL
    const filteredComics = comics.filter((comic) => {
        const genreMatch = filteredGenres.length > 0 ? comic.genres && comic.genres.some((genre) => filteredGenres.includes(genre.name)) : true;
        const authorMatch = filteredAuthors.length > 0 ? filteredAuthors.includes(comic.author) : true;
        const titleMatch = searchQuery ? comic.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return genreMatch && authorMatch && titleMatch;
    });


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
                            <p className="condition">{comic.condition}</p>
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
