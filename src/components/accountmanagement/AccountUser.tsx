import React, { useState } from 'react';
import "../ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MultipleStopOutlinedIcon from '@mui/icons-material/MultipleStopOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Button, MenuItem, TextField, Typography } from '@mui/material';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Countdown from 'react-countdown';
import UserWallet from "../wallet/UserWallet"
import ExchangeHistory from "../exchange/ExchangeHistory"
import OrderHistory from '../order/OrderHistory';
import AuctionHistory from '../auction/AuctionHistory';

const AccountUser = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState('purchase');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedAuctionStatus, setSelectedAuctionStatus] = useState('all');

    const [editing, setEditing] = useState(false);
    const [newAvatar, setNewAvatar] = useState(null);

    const handleMenuItemClick = (item) => {
        setSelectedMenuItem(item);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewAvatar(URL.createObjectURL(file));
        }
    };

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleCancelClick = () => {
        setEditing(false);
        setNewAvatar(null);
    };

    const handleConfirmClick = () => {
        if (newAvatar) {
            setProfileData({ ...profileData, avatar: newAvatar });
        }
        setEditing(false);
    };


    const [profileData, setProfileData] = useState({
        email: 'maicttsel73328@fpt.edu.vn',
        username: 'thanhmai27092003',
        phoneNumber: '0947758903',
        gender: 'Female',
        address: 'LA',
        dateOfBirth: '09/27/2003',
        avatar: 'https://cdn-icons-png.flaticon.com/512/147/147144.png',
    });

    const orders = [
        { id: 1, status: 'pending', shopName: 'Tạp Hóa Truyện', productName: 'Thám Tử Lừng Danh Conan - Tập 102', price: '29.000đ', imgUrl: 'https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg' },
        { id: 2, status: 'packing', shopName: 'Abc Shop', productName: 'One Piece - Tập 101', price: '39.000đ', imgUrl: 'https://cdn0.fahasa.com/media/catalog/product/o/n/one_piece_-_tap_101_-_ban_bia_ao_bia_gap_bia_1__1.jpg?_gl=1*t4s1ch*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODQ4OTc1OC4zNi4xLjE3Mjg0ODk3ODcuMzEuMC4xNTg5MzI2OQ..' },
        { id: 3, status: 'delivering', shopName: 'Abc Shop', productName: 'Naruto - Tập 50', price: '49.000đ', imgUrl: 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/naruto_tap_50_thuy_lao_tu_chien_tai_ban_2022/2024_04_05_09_50_39_1-390x510.jpg?_gl=1*m22ao5*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODQ4OTc1OC4zNi4xLjE3Mjg0ODk4MTIuNi4wLjE1ODkzMjY5' },
        { id: 4, status: 'delivered', shopName: 'Abc Shop', productName: 'Attack on Titan - Tập 24', price: '59.000đ', imgUrl: 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/_24___attack_on_titan_24/2023_04_14_15_19_24_1-390x510.jpg' },
        { id: 5, status: 'completed', shopName: 'Abc Shop', productName: 'Doraemon - Tập 15', price: '19.000đ', imgUrl: 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/doraemon___chu_meo_may_den_tu_tuong_lai___tap_15_tai_ban_2023/2024_06_08_10_37_33_1-390x510.jpg?_gl=1*9asfdx*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODQ4OTc1OC4zNi4xLjE3Mjg0ODk4OTkuMi4wLjE1ODkzMjY5' },
        { id: 6, status: 'cancelled', shopName: 'Abc Shop', productName: 'Dragon Ball - Tập 24', price: '99.000đ', imgUrl: 'https://cdn0.fahasa.com/media/catalog/product/2/4/24_3b445abed5484fbca9eb0cf899682_1.jpg' },
    ];

    const auctions = [
        { id: 1, status: 'ongoing', shopName: 'Tạp Hóa Truyện', productName: 'Thám Tử Lừng Danh Conan - Tập 102', currentPrice: '29.000đ', userBid: '300.000đ', imgUrl: 'https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg' },
        { id: 2, status: 'completed', shopName: 'Abc Shop', productName: 'One Piece - Tập 101', userBid: '39.000đ', finalPrice: '50.000đ', imgUrl: 'https://cdn0.fahasa.com/media/catalog/product/o/n/one_piece_-_tap_101_-_ban_bia_ao_bia_gap_bia_1__1.jpg', isWin: true },
        { id: 3, status: 'completed', shopName: 'Abc Shop', productName: 'Naruto - Tập 50', userBid: '49.000đ', finalPrice: '59.000đ', imgUrl: 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/naruto_tap_50_thuy_lao_tu_chien_tai_ban_2022/2024_04_05_09_50_39_1-390x510.jpg', isWin: false },
        { id: 1, status: 'canceled', shopName: 'Tạp Hóa Truyện', productName: 'Attack On Titan - Tập 24', currentPrice: '129.000đ', imgUrl: 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/_24___attack_on_titan_24/2023_04_14_15_19_24_1-390x510.jpg' },
    ];


    const renderContent = () => {
        switch (selectedMenuItem) {
            case 'purchase':
                return (
                    <OrderHistory orders={orders}/>
                );
            case 'profile':
                return (
                    <div className="profile-container">
                        <Typography sx={{ fontSize: '35px', fontWeight: 'bolder', textAlign: 'center', marginBottom: '20px' }} className="profile-title">HỒ SƠ CỦA TÔI</Typography>
                        <Grid container spacing={0} alignItems="center">
                            {/* Avatar Section */}
                            <Grid size={3}>
                                <div className="profile-image">
                                    <img
                                        src={newAvatar || profileData.avatar}
                                        alt="avatar"
                                        className="avatar-image1"
                                        style={{ width: '100%', height: 'auto', borderRadius: '50%' }}
                                    />
                                    {editing && (
                                        <>
                                            <label htmlFor="avatar-upload" className="change-photo-label">
                                                <Typography color="primary" className="change-photo-text">
                                                    Đổi ảnh đại diện
                                                </Typography>
                                            </label>
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                        </>
                                    )}
                                </div>
                            </Grid>

                            {/* Form Section */}
                            <Grid size={9}>
                                <form noValidate autoComplete="off" className="profile-form">
                                    <div className="form-row">
                                        <Typography>Email:</Typography>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            // label="Email"
                                            variant="outlined"
                                            value={profileData.email}
                                            disabled
                                            className="profile-field"
                                            size="small"
                                        />
                                    </div>
                                    <div className="form-row">
                                        <Typography>Username:</Typography>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            // label="Username"
                                            name="username"
                                            variant="outlined"
                                            value={profileData.username}
                                            className="profile-field"
                                            size="small"
                                        />
                                    </div>
                                    <div className="form-row">
                                        <Typography>Số Điện Thoại:</Typography>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            // label="Phone number"
                                            name="phoneNumber"
                                            variant="outlined"
                                            value={profileData.phoneNumber}
                                            className="profile-field"
                                            size="small"
                                        />
                                    </div>
                                    <div className="form-row">
                                        <Typography>Giới Tính:</Typography>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            select
                                            // label="Gender"
                                            name="gender"
                                            variant="outlined"
                                            value={profileData.gender}
                                            className="profile-field"
                                            size="small"
                                        >
                                            <MenuItem value="Female">Female</MenuItem>
                                            <MenuItem value="Male">Male</MenuItem>
                                        </TextField>
                                    </div>
                                    <div className="form-row">
                                        <Typography>Địa Chỉ:</Typography>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            // label="Address"
                                            name="address"
                                            variant="outlined"
                                            value={profileData.address}
                                            className="profile-field"
                                            size="small"
                                        />
                                    </div>
                                    <div className="form-row">
                                        <Typography>Ngày Sinh:</Typography>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            // label="Date of Birth"
                                            name="dateOfBirth"
                                            variant="outlined"
                                            value={profileData.dateOfBirth}
                                            className="profile-field"
                                            size="small"
                                        />
                                    </div>
                                </form>
                            </Grid>
                        </Grid>

                        {/* Button Section */}
                        <div className="button-container">
                            {!editing ? (
                                <Button
                                    variant="contained"
                                    onClick={handleEditClick}
                                    sx={{ fontSize: '20px', backgroundColor:'#000', color:'#fff' }}
                                >
                                    Cập Nhật Hồ Sơ
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleCancelClick}
                                        sx={{ fontSize: '20px', marginRight: '10px' }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleConfirmClick}
                                        sx={{ fontSize: '20px' }}
                                    >
                                        Xác Nhận
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>


                );
            case 'auction':
                return (
                    <AuctionHistory auctions={auctions}/>
                );
            case 'wallet':
                return <UserWallet/>
            case 'exchange':
                return <ExchangeHistory/>
            default:
                return <div>Chọn một mục để xem chi tiết...</div>;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#f28144';
            case 'packing':
                return '#fc65fc';
            case 'delivering':
                return '#28bacf';
            case 'delivered':
                return '#32CD32';
            case 'completed':
                return '#228B22';
            case 'cancelled':
                return '#FF4500';
            default:
                return '#000';
        }
    };

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

    const renderer = ({ days, hours, minutes, seconds }) => {
        return (
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
    };

    return (
        <div className="account-user-container">
            <Grid container spacing={3}>
                <Grid size={2.5} className="account-menu">
                    <div className="profile-section1">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX1xth7Ez9iGvBnrxojtvXWMPYyLgLPgjnYg&s"
                            alt="avatar"
                            className="avatar-image"
                        />
                        <div>
                            <p className="username">thanhmai2709...</p>
                            <a href="#" className="edit-profile"><CreateOutlinedIcon />Sửa Hồ Sơ</a>
                        </div>
                    </div>
                    <div className="menu-section">
                        <ul>
                            <li
                                className={`menu-item ${selectedMenuItem === 'purchase' ? 'active' : ''}`}
                                onClick={() => handleMenuItemClick('purchase')}
                            >
                                <ShoppingBagOutlinedIcon /> Lịch Sử Mua Hàng
                            </li>
                            <li
                                className={`menu-item ${selectedMenuItem === 'profile' ? 'active' : ''}`}
                                onClick={() => handleMenuItemClick('profile')}
                            >
                                <PersonOutlinedIcon /> Hồ Sơ Của Tôi
                            </li>
                            <li
                                className={`menu-item ${selectedMenuItem === 'auction' ? 'active' : ''}`}
                                onClick={() => handleMenuItemClick('auction')}
                            >
                                <TvOutlinedIcon /> Lịch Sử Đấu Giá
                            </li>
                            <li
                                className={`menu-item ${selectedMenuItem === 'wallet' ? 'active' : ''}`}
                                onClick={() => handleMenuItemClick('wallet')}
                            >
                                <AccountBalanceWalletOutlinedIcon /> Ví Của Tôi
                            </li>
                            <li
                                className={`menu-item ${selectedMenuItem === 'exchange' ? 'active' : ''}`}
                                onClick={() => handleMenuItemClick('exchange')}
                            >
                                <MultipleStopOutlinedIcon /> Lịch Sử Trao Đổi
                            </li>
                        </ul>
                    </div>
                </Grid>
                <Grid size={9.5}>
                    <div className="content-section">
                        {renderContent()}
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default AccountUser;
