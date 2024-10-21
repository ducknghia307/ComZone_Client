import React, { useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import Countdown from 'react-countdown';
import '../ui/AuctionHistory.css';

const AuctionHistory = ({ auctions }) => {
    const [selectedAuctionStatus, setSelectedAuctionStatus] = useState('all');

    const filteredAuctions = selectedAuctionStatus === 'all'
        ? auctions
        : auctions.filter(auction => auction.status === selectedAuctionStatus);

    const getAuctionStatusTextColor = (status) => {
        switch (status) {
            case 'ongoing':
                return '#28bacf';
            case 'completed':
                return '#228B22';
            case 'canceled':
                return '#FF4500';
            default:
                return '#000';
        }
    };

    const getAuctionResultColor = (isWin) => {
        return isWin ? '#D6FFD8' : '#E9E9E9'; // Xanh lá cho win, xám cho lose
    };

    const renderAuctionContent = () => {
        const filteredAuctions = selectedAuctionStatus === 'all'
            ? auctions
            : auctions.filter(auction => auction.status === selectedAuctionStatus);

        return filteredAuctions.map(auction => {
            const isWin = auction.status === 'completed' && auction.isWin;

            return (
                <div key={auction.id}
                    style={{
                        backgroundColor: '#fff',  // Giữ màu nền trắng
                        borderRadius: '8px',
                        marginBottom: '20px',
                        padding: '16px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        borderLeft: isWin || auction.isWin === false
                        ? `5px solid ${getAuctionResultColor(isWin)}`
                        : 'none', // Thêm viền màu trái nếu win/lose
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                            padding: '10px 30px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <StoreOutlinedIcon style={{ marginRight: '8px' }} />
                            <Typography sx={{ fontSize: '20px' }} variant="subtitle1">
                                {auction.shopName}
                            </Typography>
                        </div>

                        {/* Chip màu cho status đấu giá */}
                        <div
                            style={{
                                backgroundColor: getAuctionStatusTextColor(auction.status),
                                padding: '5px 10px',
                                borderRadius: '16px',
                            }}
                        >
                            <Typography sx={{ fontSize: '16px', color: '#fff' }}>
                                {getAuctionStatusText(auction.status)}
                            </Typography>
                        </div>
                    </div>

                    <div style={{ padding: '0px 30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: "20px" }}>
                                <img
                                    src={auction.imgUrl}
                                    alt={auction.productName}
                                    style={{ width: '150px', marginRight: '16px' }}
                                />
                                <div>
                                    <Typography
                                        sx={{ fontSize: '28px', fontWeight: 'bold' }}
                                        variant="body1"
                                    >
                                        {auction.productName}
                                    </Typography>

                                    {auction.status === 'ongoing' && (
                                        <div>
                                            <Typography
                                                sx={{ fontSize: '20px', marginTop: '12px' }}
                                                variant="body2"
                                            >
                                                Giá hiện tại: <span style={{ color: "#0000FF" }}>{auction.currentPrice}</span>
                                            </Typography>
                                            <Typography
                                                sx={{ fontSize: '20px', marginTop: '8px' }}
                                                variant="body2"
                                            >
                                                Bạn đã đặt giá: <span style={{ color: "#FF7F00" }}>{auction.userBid}</span>
                                            </Typography>
                                        </div>
                                    )}

                                    {auction.status === 'completed' && (
                                        <div>
                                            {isWin ? (
                                                <Typography
                                                    sx={{ fontSize: '24px', marginTop: '12px' }}
                                                    variant="body2"
                                                >
                                                    Giá cuối cùng: <span style={{ color: "#32CD32" }}>{auction.finalPrice}</span>
                                                </Typography>
                                            ) : (
                                                <>
                                                    <Typography
                                                        sx={{ fontSize: '24px', marginTop: '12px' }}
                                                        variant="body2"
                                                    >
                                                        Bạn đã đặt giá: <span style={{ color: "#FF7F00" }}>{auction.userBid}</span>
                                                    </Typography>
                                                    <Typography
                                                        sx={{ fontSize: '24px', marginTop: '8px' }}
                                                        variant="body2"
                                                    >
                                                        Giá chiến thắng: <span style={{ color: "#FF0000" }}>{auction.finalPrice}</span>
                                                    </Typography>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {auction.status !== 'canceled' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '30px'
                                    }}
                                >
                                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
                                        Thời gian còn lại:
                                    </Typography>
                                    {auction.status === 'ongoing' ? (
                                        <Countdown
                                            date={Date.now() + 100000000}
                                            renderer={renderer}
                                        />
                                    ) : (
                                        <div className="countdown1">
                                            <div className="time-box1">
                                                <span className="time">00</span>
                                                <span className="label">D</span>
                                            </div>
                                            <div className="time-box1">
                                                <span className="time">00</span>
                                                <span className="label">H</span>
                                            </div>
                                            <div className="time-box1">
                                                <span className="time">00</span>
                                                <span className="label">M</span>
                                            </div>
                                            <div className="time-box1">
                                                <span className="time">00</span>
                                                <span className="label">S</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '12px',
                            paddingBottom: '20px',
                            paddingRight: '20px'
                        }}
                    >
                        {auction.status === 'ongoing' ? (
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#000000', color: '#FFFFFF', fontSize: '16px' }}
                            >
                                TRỞ LẠI CUỘC ĐẤU GIÁ
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#000000', color: '#FFFFFF', fontSize: '16px' }}
                            >
                                XEM CHI TIẾT ĐẤU GIÁ
                            </Button>
                        )}
                    </div>
                </div>
            );
        });
    };

    const renderer = ({ days, hours, minutes, seconds }) => (
        <div className="countdown1">
            <div className="time-box1">
                <span className="time">{days.toString().padStart(2, '0')}</span>
                <span className="label">D</span>
            </div>
            <div className="time-box1">
                <span className="time">{hours.toString().padStart(2, '0')}</span>
                <span className="label">H</span>
            </div>
            <div className="time-box1">
                <span className="time">{minutes.toString().padStart(2, '0')}</span>
                <span className="label">M</span>
            </div>
            <div className="time-box1">
                <span className="time">{seconds.toString().padStart(2, '0')}</span>
                <span className="label">S</span>
            </div>
        </div>
    );

    const getAuctionStatusText = (status) => {
        switch (status) {
            case 'ongoing':
                return "Cuộc Đấu Giá Đang diễn ra";
            case 'completed':
                return "Cuộc Đấu Giá Đã kết thúc";
            case 'canceled':
                return "Cuộc Đấu Giá Bị Hủy";
            default:
                return "Tất cả trạng thái đấu giá";
        }
    };

    return (
        <div>
            <div className="status-auction-tabs">
                <span
                    className={`status-auction-tab ${selectedAuctionStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedAuctionStatus('all')}
                >
                    Tất cả
                </span>
                <span
                    className={`status-auction-tab ${selectedAuctionStatus === 'ongoing' ? 'active' : ''}`}
                    onClick={() => setSelectedAuctionStatus('ongoing')}
                >
                    Đang diễn ra
                </span>
                <span
                    className={`status-auction-tab ${selectedAuctionStatus === 'completed' ? 'active' : ''}`}
                    onClick={() => setSelectedAuctionStatus('completed')}
                >
                    Kết Thúc
                </span>
                <span
                    className={`status-auction-tab ${selectedAuctionStatus === 'canceled' ? 'active' : ''}`}
                    onClick={() => setSelectedAuctionStatus('canceled')}
                >
                    Bị Hủy
                </span>
            </div>
            <div className="searchauctionbar">
                <SearchOutlinedIcon />
                <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Bạn có thể tìm kiếm theo Tên Sản phẩm đấu giá"
                    InputProps={{
                        disableUnderline: true,
                        sx: { '& fieldset': { border: 'none' } },
                    }}
                />
            </div>
            <div className="auction-history-content">
                {renderAuctionContent()}
            </div>
        </div>
    );
};

export default AuctionHistory;