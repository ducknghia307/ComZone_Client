import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid2';
import '../ui/AuctionDetail.css';
import { Button, Typography } from '@mui/material';
import Countdown from 'react-countdown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useParams } from 'react-router-dom';
import { publicAxios } from '../../middleware/axiosInstance';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';

const renderer = ({ days, hours, minutes, seconds }: any) => {
    return (
        <div className="countdown REM">
            <div className="time-box">
                <span className="time">{days.toString().padStart(2, '0')}</span>
                <span className="label1">Ngày</span>
            </div>
            <div className="time-box">
                <span className="time">{hours.toString().padStart(2, '0')}</span>
                <span className="label1">Giờ</span>
            </div>
            <div className="time-box">
                <span className="time">{minutes.toString().padStart(2, '0')}</span>
                <span className="label1">Phút</span>
            </div>
            <div className="time-box">
                <span className="time">{seconds.toString().padStart(2, '0')}</span>
                <span className="label1">Giây</span>
            </div>
        </div>
    );
};

const ComicAuction = () => {

    const { id } = useParams<{ id: string }>();
    console.log("Comic ID:", id);
    const [comic, setComic] = useState<any>(null);
    const [users, setUsers] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string>("");
    const [previewChapter, setPreviewChapter] = useState<string[]>([]);

    const descriptionRef = useRef<HTMLDivElement>(null); // Tạo ref cho phần mô tả

    useEffect(() => {
        const fetchComicDetails = async () => {
            try {
                const response = await publicAxios.get(`/auction/${id}`);
                const data = response.data;
                console.log('Comic Detail:', data);

                setUsers(data.sellerId);
                console.log('Seller Info:', data.comics.sellerId);

                setComic(data);
                setMainImage(data.comics.coverImage);
                setPreviewChapter(data.previewChapter || []);
            } catch (error) {
                console.error("Error fetching comic details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComicDetails();
    }, [id]);

    console.log("Preview Chapter", previewChapter);

    if (loading) return <p>Loading comic details...</p>;
    if (!comic) return <p>Comic not found.</p>;

    const handleImageClick = (imageSrc: string) => {
        setMainImage(imageSrc); // Cập nhật ảnh lớn khi click vào ảnh nhỏ
    };

    const scrollToDescription = () => {
        descriptionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="auction-wrapper">
            <div className="title-container">
                <Typography style={{ paddingLeft: '50px', fontSize: '25px', fontWeight: '500', fontFamily: 'REM' }}>
                    {comic.comics.title}
                </Typography>
                <div className="condition-tag REM">
                    {comic.comics.condition === 'SEALED' ? 'Nguyên Seal' : 'Đã Qua Sử Dụng'}
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
                            {[comic.comics.coverImage, ...(comic.comics.previewChapter || [])].map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Preview ${index + 1}`}
                                    style={{ width: "60px", height: "90px", cursor: "pointer", objectFit: "cover", flexDirection: 'column', display: 'flex' }}
                                    onClick={() => handleImageClick(img)} // Cập nhật ảnh lớn khi click
                                />
                            ))}
                        </div>
                    </div>
                </Grid>

                <Grid size={5} className="auction-info">
                    <div className="timer">
                        <p className='REM'>KẾT THÚC TRONG</p>
                        <Countdown
                            date={Date.now() + 100000000}
                            renderer={renderer}
                        />
                        <div className="current-price REM">
                            <div className="current-price1">
                                <p>Giá hiện tại</p>
                                <h2>10.000.000₫</h2>
                            </div>
                            <div className="current-price2">
                                <p>Lượt đấu giá</p>
                                <h2>10</h2>
                            </div>
                        </div>
                    </div>

                    <div className="shop-info REM">
                        <p><StoreOutlinedIcon /> {comic.comics.sellerId.name}</p>
                        <p style={{ fontSize: "18px", paddingTop: '10px' }}>
                            Giá đấu tối thiểu tiếp theo: 11.000.000₫
                        </p>
                        <div className="bid-row">
                            <input
                                type="text"
                                placeholder="đ"
                                className="bid-input"
                            />
                            <Button sx={{ fontFamily: 'REM' }} variant='contained' className="bid-button">RA GIÁ</Button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
                            <Button
                                variant='contained'
                                style={{ color: '#fff', backgroundColor: '#000', fontWeight: '500', fontSize: '18px', fontFamily: 'REM' }}
                            >
                                Mua ngay với giá 20.000.000₫
                            </Button>
                        </div>
                    </div>

                    <div className="publisher">
                        <div className='publisher-detail'>
                            <Typography style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'REM' }}>NXB: <span className="REM" style={{ fontWeight: '300' }}>{comic.comics.author}</span></Typography>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
                            <p className="REM" style={{ color: "#1a73e8", fontWeight: '700', fontSize:'18px' }}>
                                Mô tả nội dung:
                            </p>
                            <ArrowDropDownIcon sx={{ color: "#1a73e8", fontSize: '30px', cursor: 'pointer' }} onClick={scrollToDescription} />
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={5} className="description-auction">
                <Grid size={12} className="description-info REM" ref={descriptionRef}>
                    <div style={{ padding: '0px 50px 30px 50px' }}>
                        <p style={{ paddingTop: '20px', color: "#1a73e8", fontWeight: 'bold', marginBottom: '7px', fontSize: '19px' }}>
                            Mô tả nội dung:
                        </p>
                        <p style={{ textAlign: 'justify', fontSize: '16px', fontWeight: '300' }}>{comic.comics.description}</p>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default ComicAuction;