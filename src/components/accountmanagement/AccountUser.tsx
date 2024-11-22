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

  const auctions: Auction[] = [
    {
      id: "1",
      shopName: "Tạp Hóa Truyện",
      productName: "Thám Tử Lừng Danh Conan - Tập 102",
      status: "ONGOING",
      imgUrl: "https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg",
      currentPrice: 29000,
      userBid: 20000,
      finalPrice: 50000,
      isWin: false,
      reservePrice: 10000,
      priceStep: 2000,
      startTime: "2024-11-01T10:00:00Z",
      endTime: "2024-11-30T10:00:00Z",
      comics: {
        id: "comic1",
        createdAt: "2024-10-01T12:00:00Z",
        updatedAt: "2024-10-05T15:00:00Z",
        deletedAt: null,
        title: "Thám Tử Lừng Danh Conan - Tập 102",
        author: "Gosho Aoyama",
        description: "The latest volume of Detective Conan",
        coverImage: "https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg",
        condition: "SEALED",
        edition: "REGULAR",
        page: 200,
        publishedDate: "2024-09-01",
        price: 29000,
        status: "AVAILABLE",
        quantity: 100,
        previewChapter: ["Chapter 1", "Chapter 2"],
        sellerId: {
          createdAt: "2024-01-01T00:00:00Z",
          email: "seller@example.com",
          id: "seller1",
          is_verified: true,
          name: "Tạp Hóa Truyện",
          phone: "0123456789",
          avatar: "https://example.com/avatar.jpg",
          refresh_token: "refresh-token",
          role: "SELLER",
          updatedAt: "2024-10-01T00:00:00Z",
          balance: 100000,
          nonWithdrawableAmount: 5000,
        },
        onSaleSince: new Date(),
      },
      maxPrice: 100000,
    },
  ];
  

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "purchase":
        return <OrderHistory orders={orders} />;
      case "profile":
        return <ProfileUser />;
      case "auction":
        return <AuctionHistory auctions={auctions} />;
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
                className={`menu-item ${selectedMenuItem === "purchase" ? "active" : ""
                  }`}
                onClick={() => handleMenuItemClick("purchase")}
              >
                <ShoppingBagOutlinedIcon /> Lịch Sử Mua Hàng
              </li>
              <li
                className={`menu-item ${selectedMenuItem === "profile" ? "active" : ""
                  }`}
                onClick={() => handleMenuItemClick("profile")}
              >
                <PersonOutlinedIcon /> Hồ Sơ Của Tôi
              </li>
              <li
                className={`menu-item ${selectedMenuItem === "auction" ? "active" : ""
                  }`}
                onClick={() => handleMenuItemClick("auction")}
              >
                <TvOutlinedIcon /> Lịch Sử Đấu Giá
              </li>
              <li
                className={`menu-item ${selectedMenuItem === "wallet" ? "active" : ""
                  }`}
                onClick={() => handleMenuItemClick("wallet")}
              >
                <AccountBalanceWalletOutlinedIcon /> Ví Của Tôi
              </li>
              <li
                className={`menu-item ${selectedMenuItem === "exchange" ? "active" : ""
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
