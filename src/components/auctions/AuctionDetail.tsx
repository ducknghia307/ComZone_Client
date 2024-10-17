import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import '../ui/AuctionDetail.css';
import { Button, Typography } from '@mui/material';
import Countdown from 'react-countdown';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import { useParams } from 'react-router-dom';

const renderer = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="countdown">
            <div className="time-box">
                <span className="time">{days.toString().padStart(2, '0')}</span>
                <span className="label1">D</span>
            </div>
            <div className="time-box">
                <span className="time">{hours.toString().padStart(2, '0')}</span>
                <span className="label1">H</span>
            </div>
            <div className="time-box">
                <span className="time">{minutes.toString().padStart(2, '0')}</span>
                <span className="label1">M</span>
            </div>
            <div className="time-box">
                <span className="time">{seconds.toString().padStart(2, '0')}</span>
                <span className="label1">S</span>
            </div>
        </div>
    );
};

const ComicAuction = () => {

    const { id } = useParams(); // Lấy ID từ URL
    const [comic, setComic] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coverImage, setCoverImage] = useState("");
    const [previewChapter, setPreviewChapter] = useState([]);
    const token = sessionStorage.getItem("accessToken");


    const [mainImage, setMainImage] = useState("");

    useEffect(() => {
        // Gọi API để lấy thông tin chi tiết của comic theo ID
        fetch(`http://localhost:3000/comics/${id}`, {
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
                console.log('Comic Detail:', data);
                setUsers(data.sellerId);
                setComic(data);

                setMainImage(data.coverImage); 
                setPreviewChapter(data.previewChapter || []);

                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching comic details:", error);
                setLoading(false);
            });
    }, [id]);

    console.log("Preview Chapter", previewChapter);

    if (loading) return <p>Loading comic details...</p>;
    if (!comic) return <p>Comic not found.</p>;

    const handleImageClick = (imageSrc) => {
        setMainImage(imageSrc); // Cập nhật ảnh lớn khi click vào ảnh nhỏ
    };

    return (
        <div className="auction-wrapper">
            <div className="title-container">
                <Typography style={{ paddingLeft: '40px', fontSize: '25px' }}>
                    {comic.title}
                </Typography>
                <div className="condition-tag">
                    {comic.condition}
                </div>
            </div>

            <Grid container spacing={5} className="auction-container">
                <Grid size={7} className="comic-info">
                    <div className="comic-images">
                        <img
                            className="main-comic-image"
                            src={mainImage}
                            alt="Main Comic Cover"
                        />
                       <div className="small-images" >
                            {/* Hiển thị tất cả các ảnh nhỏ, bao gồm ảnh bìa */}
                            {[comic.coverImage, ...(comic.previewChapter || [])].map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Preview ${index + 1}`}
                                    style={{ width: "60px", height: "90px", cursor: "pointer", objectFit: "cover", flexDirection:'column', display:'flex' }}
                                    onClick={() => handleImageClick(img)} // Cập nhật ảnh lớn khi click
                                />
                            ))}
                        </div>
                    </div>
                </Grid>

                <Grid size={5} className="auction-info">
                    <div className="timer">
                        <p>KẾT THÚC TRONG: {comic.endDate}</p>
                        <Countdown
                            // date={new Date(comic.endDate)}
                            date={Date.now() + 100000000}
                            renderer={renderer}
                        />
                        <div className="current-price">
                            <div className="current-price1">
                                <p>Giá hiện tại</p>
                                {/* <h2>{comic.currentPrice}₫</h2> */}
                                <h2>10.000.000₫</h2>
                            </div>
                            <div className="current-price2">
                                <p>Lượt đấu giá</p>
                                {/* <h2>{comic.bids.length}</h2> */}
                                <h2>10</h2>
                            </div>
                        </div>
                    </div>

                    <div className="shop-info">
                        <p><StoreOutlinedIcon /> {users.name}</p>
                        <p style={{ fontSize: "18px", paddingTop: '10px' }}>
                            {/* Giá đấu tối thiểu tiếp theo: {comic.nextBid}₫ */}
                            Giá đấu tối thiểu tiếp theo: 11.000.000₫
                        </p>
                        <div className="bid-row">
                            <input
                                type="text"
                                placeholder="đ"
                                className="bid-input"
                            />
                            <Button variant='contained' className="bid-button">RA GIÁ</Button>
                        </div>
                        <Button
                            variant='contained'
                            style={{ color: '#fff', backgroundColor: '#000', fontWeight: 'bold', fontSize: '18px' }}
                        >
                            {/* Mua ngay với giá {comic.buyNowPrice}₫ */}
                            Mua ngay với giá 20.000.000₫
                        </Button>
                    </div>

                    <div className="publisher">
                        <div className='publisher-detail'>
                            <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>NXB: <span style={{ fontWeight: '500' }}>{comic.author}</span></Typography>
                            {/* <Typography>{comic.author}</Typography> */}
                        </div>

                        <p style={{ paddingTop: '20px', color: "#1a73e8", fontWeight: '700', marginBottom: '7px' }}>
                            Mô tả nội dung:
                        </p>
                        <p>{comic.description}</p>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default ComicAuction;