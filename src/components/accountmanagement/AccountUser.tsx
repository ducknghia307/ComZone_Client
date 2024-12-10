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
import OrderHistory from "../order/OrderHistory";
import AuctionHistory from "../auction/AuctionHistory";
import ProfileUser from "../../pages/ProfileUser";

const AccountUser: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("purchase");

  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);
  };

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
