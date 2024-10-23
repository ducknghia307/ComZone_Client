import React, { useEffect, useState } from 'react';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MultipleStopOutlinedIcon from '@mui/icons-material/MultipleStopOutlined';
import { useNavigate } from 'react-router-dom';
import { privateAxios } from '../../middleware/axiosInstance';
import { UserInfo } from '../../common/base.interface';

const Sidebar = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    const navigate = useNavigate();

    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
    };

    const currentUrl = window.location.pathname;
    console.log('URL', currentUrl)

    const [userInfo, setUserInfo] = useState<UserInfo>();
    const fetchUserInfo = async () => {
        const response = await privateAxios("users/profile");
        setUserInfo(response.data);
    }
    useEffect(() => {
        fetchUserInfo()
    }, []);

    return (
        <div>
            <div className="profile-section1">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX1xth7Ez9iGvBnrxojtvXWMPYyLgLPgjnYg&s"
                    alt="avatar"
                    className="avatar-image"
                />
                <div>
                    <p className="username">{userInfo?.name}</p>
                    <a href="#" className="edit-profile"><CreateOutlinedIcon />Sửa Hồ Sơ</a>
                </div>
            </div>
            <div className="menu-section">
                <ul>
                    <li
                        className={`menu-item ${currentUrl === '/accountmanagement/purchase' ? 'active' : ''}`}
                        onClick={() => { handleMenuItemClick('purchase'); navigate('/accountmanagement/purchase') }}
                    >
                        <ShoppingBagOutlinedIcon /> Lịch Sử Mua Hàng
                    </li>
                    <li
                        className={`menu-item ${currentUrl === '/accountmanagement/profile' ? 'active' : ''}`}
                        onClick={() => { handleMenuItemClick('profile'); navigate('/accountmanagement/profile') }}
                    >
                        <PersonOutlinedIcon /> Hồ Sơ Của Tôi
                    </li>
                    <li
                        className={`menu-item ${currentUrl === '/accountmanagement/auction' ? 'active' : ''}`}
                        onClick={() => { handleMenuItemClick('auction'); navigate('/accountmanagement/auction') }}
                    >
                        <TvOutlinedIcon /> Lịch Sử Đấu Giá
                    </li>
                    <li
                        className={`menu-item ${currentUrl === '/accountmanagement/wallet' ? 'active' : ''}`}
                        onClick={() => { handleMenuItemClick('wallet'); navigate('/accountmanagement/wallet') }}
                    >
                        <AccountBalanceWalletOutlinedIcon /> Ví Của Tôi
                    </li>
                    <li
                        className={`menu-item ${currentUrl === '/accountmanagement/exchange' ? 'active' : ''}`}
                        onClick={() => { handleMenuItemClick('exchange'); navigate('/accountmanagement/exchange') }}
                    >
                        <MultipleStopOutlinedIcon /> Lịch Sử Trao Đổi
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;