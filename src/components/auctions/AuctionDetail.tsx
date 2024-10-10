import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import '../ui/AuctionDetail.css';
import { Button, Typography } from '@mui/material';
import Countdown from 'react-countdown';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';

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

const ComicAuction = () => {
    const [mainImage, setMainImage] = useState("https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg");
    
    const handleImageClick = (imageSrc) => {
        setMainImage(imageSrc);
    };

    return (
        <div className="auction-wrapper">
            <div className="title-container">
                <Typography style={{paddingLeft:'40px', fontSize:'25px'}} >Adams, Arthur - CLASSIC X-MEN #10 Cover Prelim</Typography>
                <div className="condition-tag">
                    VF: 8.0
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
                        <div className="small-images">
                            <img
                                className="small-comic-image"
                                src="https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg"
                                alt="Small Image 1"
                                onClick={() => handleImageClick("https://www.comicconnect.com/coverimages/gallery/sup1.3772a.jpg")}
                            />
                            <img
                                className="small-comic-image"
                                src="https://www.comicconnect.com/coverimages/gallery/sup1.3772b.jpg"
                                alt="Small Image 2"
                                onClick={() => handleImageClick("https://www.comicconnect.com/coverimages/gallery/sup1.3772b.jpg")}
                            />
                        </div>
                    </div>
                </Grid>

                <Grid size={5} className="auction-info">
                    <div className="timer">
                        <p>KẾT THÚC TRONG: T3, 01/10/2024 8:00AM</p>
                        <Countdown
                            date={Date.now() + 100000000}  // Example: 100000000 ms from now
                            renderer={renderer}
                        />
                        <div className="current-price">
                            <div className="current-price1">
                                <p>Giá hiện tại</p>
                                <h2>1.500.000₫</h2>
                            </div>
                            <div className="current-price2">
                                <p>Lượt đấu giá</p>
                                <h2>10</h2>
                            </div>
                        </div>
                    </div>

                    <div className="shop-info">
                        <p><StoreOutlinedIcon /> Wuan Shop</p>
                        <p style={{ fontSize: "18px", paddingTop: '10px' }}>
                            Giá đấu tối thiểu tiếp theo: 1.600.000đ
                        </p>
                        <div className="bid-row">
                            <input
                                type="text"
                                placeholder="đ"
                                className="bid-input"
                            />
                            <Button variant='contained' className="bid-button">RA GIÁ</Button>
                        </div>
                        <Button variant='contained' style={{ color: '#fff', backgroundColor: '#000', fontWeight: 'bold', fontSize: '18px' }}>Mua ngay với giá 10.000.000₫</Button>
                    </div>

                    <div className="publisher">
                        <div className='publisher-detail'>
                            <Typography style={{fontSize: '16px', fontWeight:'bold'}}>NXB:</Typography>
                            <Typography>Marvel</Typography>
                        </div>

                        <p style={{ paddingTop: '20px', color:"#1a73e8", fontWeight:'700', marginBottom:'7px' }}>Mô tả nội dung:</p>
                        <p>
                            This awesome collection of Super Hero stories features nine action-packed tales
                            starring your friendly neighbourhood Spider-Man! Enjoy the thrill of adventure
                            with the web-slinger and his friends.
                        </p>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default ComicAuction;