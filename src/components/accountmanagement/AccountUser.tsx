import React, { useState } from "react";
import "../ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MultipleStopOutlinedIcon from "@mui/icons-material/MultipleStopOutlined";
import UserWallet from "../wallet/UserWallet";
import ExchangeHistory from "../exchangeNewsFeed/ExchangeHistory";
import OrderHistory from "../order/OrderHistory";
import AuctionHistory from "../auction/AuctionHistory";
import ProfileUser from "../../pages/ProfileUser";
import { Auction } from "../../common/base.interface";

const AccountUser: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("purchase");

  const [editing, setEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);

  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
    email: "maicttsel73328@fpt.edu.vn",
    username: "thanhmai27092003",
    phoneNumber: "0947758903",
    gender: "Female",
    address: "LA",
    dateOfBirth: "09/27/2003",
    avatar: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
  });

  const orders = [
    {
      id: 1,
      status: "pending",
      shopName: "Tạp Hóa Truyện",
      productName: "Thám Tử Lừng Danh Conan - Tập 102",
      price: "29.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg",
      totalPrice: "29.000đ",
      items: [],
      type: "normal",
    },
  ];

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "purchase":
        return <OrderHistory />;
      case "profile":
        return <ProfileUser />;
      case "auction":
        return <AuctionHistory />;
      case "wallet":
        return <UserWallet />;
      case "exchange":
        return <ExchangeHistory />;
      default:
        return <div>Chọn một mục để xem chi tiết...</div>;
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
              <a href="#" className="edit-profile">
                <CreateOutlinedIcon />
                Sửa Hồ Sơ
              </a>
            </div>
          </div>
          <div className="menu-section">
            <ul>
              <li
                className={`menu-item ${
                  selectedMenuItem === "purchase" ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick("purchase")}
              >
                <ShoppingBagOutlinedIcon /> Lịch Sử Mua Hàng
              </li>
              <li
                className={`menu-item ${
                  selectedMenuItem === "profile" ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick("profile")}
              >
                <PersonOutlinedIcon /> Hồ Sơ Của Tôi
              </li>
              <li
                className={`menu-item ${
                  selectedMenuItem === "auction" ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick("auction")}
              >
                <TvOutlinedIcon /> Lịch Sử Đấu Giá
              </li>
              <li
                className={`menu-item ${
                  selectedMenuItem === "wallet" ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick("wallet")}
              >
                <AccountBalanceWalletOutlinedIcon /> Ví Của Tôi
              </li>
              <li
                className={`menu-item ${
                  selectedMenuItem === "exchange" ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick("exchange")}
              >
                <MultipleStopOutlinedIcon /> Lịch Sử Trao Đổi
              </li>
            </ul>
          </div>
        </Grid>
        <Grid size={9.5}>
          <div className="content-section">{renderContent()}</div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AccountUser;
