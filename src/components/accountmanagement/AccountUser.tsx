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
                    <div>
                        <div className="status-tabs">
                            <span
                                className={`status-tab ${selectedStatus === 'all' ? 'active' : ''}`}
                                onClick={() => setSelectedStatus('all')}
                            >
                                Tất cả
                            </span>
                            <span
                                className={`status-tab ${selectedStatus === 'pending' ? 'active' : ''}`}
                                onClick={() => setSelectedStatus('pending')}
                            >
                                Chờ xử lí
                            </span>
                            <span
                                className={`status-tab ${selectedStatus === 'packing' ? 'active' : ''}`}
                                onClick={() => setSelectedStatus('packing')}
                            >
                                Đang đóng gói
                            </span>
                            <span
                                className={`status-tab ${selectedStatus === 'delivering' ? 'active' : ''}`}
                                onClick={() => setSelectedStatus('delivering')}
                            >
                                Đang giao hàng
                            </span>
                            <span
                                className={`status-tab ${selectedStatus === 'delivered' ? 'active' : ''}`}
                                onClick={() => setSelectedStatus('delivered')}
                            >
                                Giao thành công
                            </span>
                            <span
                                className={`status-tab ${selectedStatus === 'completed' ? 'active' : ''}`}
                                onClick={() => setSelectedStatus('completed')}
                            >
                                Hoàn tất
                            </span>
                            <span
                                className={`status-tab ${selectedStatus === 'cancelled' ? 'active' : ''}`}
                                onClick={() => setSelectedStatus('cancelled')}
                            >
                                Hủy
                            </span>
                        </div>
                        <div className='searchbar'>
                            <SearchOutlinedIcon sx={{ color: '#8d8d8d', fontSize: '24px' }} />
                            <TextField
                                variant="outlined"
                                fullWidth
                                size="small"
                                placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                            />
                        </div>

                        <div className="purchase-history-content">
                            {renderPurchaseContent()}
                        </div>
                    </div>
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
                        <div className='searchauctionbar'>
                            <SearchOutlinedIcon />
                            <TextField
                                variant="outlined"
                                fullWidth
                                size="small"
                                placeholder="Bạn có thể tìm kiếm theo Tên Sản phẩm đấu giá"
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                            />
                        </div>
                        <div className="auction-history-content">
                            {renderAuctionContent()}
                        </div>
                    </div>
                );
            case 'wallet':
                return <div>Số dư ví của bạn...</div>;
            case 'exchange':
                return <div>Lịch sử trao đổi của bạn...</div>;
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

    const getAuctionStatusColor = (status) => {
        switch (status) {
            case 'ongoing':
                return '#F0ECFF';
            case 'completed':
                return '#D6FFD8';
            case 'canceled':
                return '#FFD6D6';
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

    const renderPurchaseContent = () => {
        // Lọc đơn hàng dựa vào trạng thái nếu không phải "all"
        const filteredOrders = selectedStatus === 'all'
            ? orders
            : orders.filter(order => order.status === selectedStatus);

        return filteredOrders.map(order => (
            <div key={order.id} className='status-detail' style={{ marginBottom: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                <div className='status-content' style={{ padding: '10px 30px' }}>
                    <div className='status-content-detail'>
                        <StoreOutlinedIcon style={{ fontSize: 35 }} />
                        <Typography sx={{ fontSize: '20px' }}>{order.shopName}</Typography>
                        <div style={{ marginLeft: '20px' }} className='chat-button'>
                            <ChatOutlinedIcon />
                            <Typography>Chat</Typography>
                        </div>
                        <div style={{ marginLeft: '10px' }} className='shop-button'>
                            <StoreOutlinedIcon />
                            <Typography>Xem Shop</Typography>
                        </div>
                    </div>
                    <Typography sx={{ margin: 'auto 0', paddingRight: '20px', color: getStatusColor(order.status), fontSize: '20px' }}>{getStatusText(order.status)}</Typography>
                </div>
                <div className='status-content1' style={{ padding: '20px 50px', display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <img style={{ width: "180px" }} src={order.imgUrl} alt={order.productName} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontSize: '24px' }}>{order.productName}</Typography>
                            <Typography sx={{ fontSize: '20px' }}>x1</Typography>
                        </div>
                    </div>
                    <Typography sx={{ alignSelf: 'center', color: "#000", fontSize: '28px' }}>{order.price}</Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px', gap: '10px', backgroundColor: '#fff' }}>
                    <Typography sx={{ alignSelf: 'center', fontSize: '20px' }}>Thành tiền: </Typography>
                    <Typography sx={{ fontSize: '28px', color: "#000" }}>{order.price} </Typography>
                </div>
                {renderButtons(order.status)}
            </div>
        ));
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


    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return "Đơn hàng chờ xử lí";
            case 'packing':
                return "Đơn hàng đang đóng gói";
            case 'delivering':
                return "Đơn hàng đang giao hàng";
            case 'delivered':
                return "Đơn hàng đã giao thành công";
            case 'completed':
                return "Đơn hàng hoàn tất";
            case 'cancelled':
                return "Đơn hàng đã bị hủy";
            default:
                return "Tất cả trạng thái đơn hàng";
        }
    };

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

    const renderButtons = (status) => {
        switch (status) {
            case 'pending':
            case 'packing':
            case 'delivering':
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 20px 40px 20px', gap: '10px', backgroundColor: '#fff' }}>
                        <Button variant='contained' sx={{ backgroundColor: "#fff", color: '#000', border: '1px solid black', fontSize: '18px' }}>Xem Chi Tiết</Button>
                    </div>
                );
            case 'delivered':
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 20px 40px 20px', gap: '10px', backgroundColor: '#fff' }}>
                        <Button variant='contained' sx={{ backgroundColor: "#000", color: '#fff' }}>Gửi Xác Nhận</Button>
                        <Button variant='contained' sx={{ backgroundColor: "#fff", color: '#000', border: '1px solid black', fontSize: '18px' }}>Xem Chi Tiết</Button>
                    </div>
                );
            case 'completed':
            case 'cancelled':
            default:
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 20px 40px 20px', gap: '10px', backgroundColor: '#fff' }}>
                        <Button variant='contained' sx={{ backgroundColor: "#fff", color: '#000', border: '1px solid black', fontSize: '18px' }}>Xem Chi Tiết</Button>
                    </div>
                );
        }
    };

    const renderAuctionButtons = (status) => {
        switch (status) {
            case 'ongoing':
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 20px 40px 20px', gap: '10px', backgroundColor: '#fff' }}>
                        <Button variant='contained' sx={{ backgroundColor: "#000", color: '#fff', border: '1px solid black', fontSize: '18px' }}>Trở Lại Cuộc Đấu Giá</Button>
                    </div>
                );
            case 'completed':
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 20px 40px 20px', gap: '10px', backgroundColor: '#fff' }}>
                        <Button variant='contained' sx={{ backgroundColor: "#000", color: '#fff', border: '1px solid black', fontSize: '18px' }}>Xem Chi Tiết Đấu Giá</Button>
                    </div>
                );
            case 'canceled':
            default:
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 20px 40px 20px', gap: '10px', backgroundColor: '#fff' }}>
                        <Button variant='contained' sx={{ backgroundColor: "#000", color: '#fff', border: '1px solid black', fontSize: '18px' }}>Xem Chi Tiết</Button>
                    </div>
                );
        }
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
