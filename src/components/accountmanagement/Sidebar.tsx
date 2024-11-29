import React, { useEffect, useState } from "react";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MultipleStopOutlinedIcon from "@mui/icons-material/MultipleStopOutlined";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../middleware/axiosInstance";
import { UserInfo } from "../../common/base.interface";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import "../ui/SidebarAccount.css";
const Sidebar = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const navigate = useNavigate();
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);

  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);
    if (item === "announcement") {
      setIsNotificationExpanded(!isNotificationExpanded);
    } else {
      setIsNotificationExpanded(false);
    }
  };

  const currentUrl = window.location.pathname;
  console.log("URL", currentUrl);

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const fetchUserInfo = async () => {
    const response = await privateAxios("users/profile");
    console.log("user info", response);

    setUserInfo(response.data);
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
      <div className="profile-section1" style={{paddingTop:'30px'}}>
        <img src={userInfo?.avatar} alt="avatar" className="avatar-image" />
        <div>
          <p className="username">{userInfo?.name}</p>
          <a href="/accountManagement/profile" className="edit-profile">
            <CreateOutlinedIcon />
            Sửa Hồ Sơ
          </a>
        </div>
      </div>
      <div className="menu-section">
        <ul>
          <li
            className={`menu-item ${
              currentUrl === "/accountmanagement/purchase" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("purchase");
              navigate("/accountmanagement/purchase");
            }}
          >
            <ShoppingBagOutlinedIcon /> Lịch Sử Mua Hàng
          </li>
          <li
            className={`menu-item ${
              currentUrl === "/accountmanagement/profile" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("profile");
              navigate("/accountmanagement/profile");
            }}
          >
            <PersonOutlinedIcon /> Hồ Sơ Của Tôi
          </li>
          <li
            className={`menu-item ${
              currentUrl === "/accountmanagement/announcement" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("announcement");
              navigate("/accountmanagement/announcement");
            }}
          >
            <NotificationsNoneIcon /> Thông báo
            {isNotificationExpanded && (
            <ul className="sub-menu">
              <li
                className="sub-menu-item"
                onClick={() => navigate("/accountmanagement/orders")}
              >
                Đơn Hàng
              </li>
              <li
                className="sub-menu-item"
                onClick={() => navigate("/accountmanagement/auctions")}
              >
                Đấu Giá
              </li>
              <li
                className="sub-menu-item"
                onClick={() => navigate("/accountmanagement/exchanges")}
              >
                Trao Đổi
              </li>
            </ul>
          )}
          </li>
       

          <li
            className={`menu-item ${
              currentUrl === "/accountmanagement/auction" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("auction");
              navigate("/accountmanagement/auction");
            }}
          >
            <TvOutlinedIcon /> Lịch Sử Đấu Giá
          </li>
          <li
            className={`menu-item ${
              currentUrl === "/accountmanagement/wallet" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("wallet");
              navigate("/accountmanagement/wallet");
            }}
          >
            <AccountBalanceWalletOutlinedIcon /> Ví Của Tôi
          </li>
          {/* <li
            className={`menu-item ${
              currentUrl === "/accountmanagement/exchange" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("exchange");
              navigate("/accountmanagement/exchange");
            }}
          >
            <MultipleStopOutlinedIcon /> Lịch Sử Trao Đổi
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
