import React, { useEffect, useState } from "react";
import "../ui/AuctionSidebar.css";
import Countdown from "react-countdown";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";

const renderer = ({ days, hours, minutes, seconds } : any) => {
    return (
        <div className="countdown">
            <div className="time-box">
                <span className="time">{days.toString().padStart(2, '0')}</span>
                <span className="label">Ngày</span>
            </div>
            <div className="time-box">
                <span className="time">{hours.toString().padStart(2, '0')}</span>
                <span className="label">Giờ</span>
            </div>
            <div className="time-box">
                <span className="time">{minutes.toString().padStart(2, '0')}</span>
                <span className="label">Phút</span>
            </div>
            <div className="time-box">
                <span className="time">{seconds.toString().padStart(2, '0')}</span>
                <span className="label">Giây</span>
            </div>
        </div>
    );
};

const AllAuctions = ({ filteredGenres, filteredAuthors }: any) => {

    const navigate = useNavigate();
    const [ongoingComics, setOngoingComics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComics = async () => {
            try {
                const response = await publicAxios.get("/auction");
                const data = response.data;
                console.log("Available Comics:", data);

                const auctionComics = data.filter((auction: any) => auction.status==="ONGOING");
                console.log("Auction Comics:", auctionComics);

                setOngoingComics(auctionComics);
                console.log('13123',ongoingComics);
                
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
    // const filteredComics = comics.filter((comic) => {
    //     const genreMatch = filteredGenres.length > 0 ? comic.genres && comic.genres.some((genre:any) => filteredGenres.includes(genre.name)) : true;
    //     const authorMatch = filteredAuthors.length > 0 ? filteredAuthors.includes(comic.author) : true;
    //     const titleMatch = searchQuery ? comic.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    //     return genreMatch && authorMatch && titleMatch;
    // });

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
                {ongoingComics.length > 0 ? (
                    ongoingComics.map((comic) => (
                        <div className="auction-card" key={comic.id}>
                            <img
                                src={comic.comics.coverImage}
                                alt={comic.comics.title}
                                className=" object-cover mx-auto"
                            />
                            <p className="title">{comic.comics.title}</p>
                            <p className="condition">{comic.comics.condition}</p>
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
            {/* <div className="auction-cards mt-4">
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
                )} */}
            {/* </div> */}

        </div>
    );
};

export default AllAuctions;
