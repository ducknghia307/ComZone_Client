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

const Sidebar = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const navigate = useNavigate();
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);

  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);

    if (item === "announcement") {
      setIsNotificationExpanded((prev) => !prev);

      if (!isNotificationExpanded) {
        navigate("/accountmanagement/announcement/orders");
      }
    } else {
      setIsNotificationExpanded(false);
    }
  };

  const currentUrl = window.location.pathname;
  console.log("URL", currentUrl);
  useEffect(() => {
    if (currentUrl.includes("/accountmanagement/announcement")) {
      setIsNotificationExpanded(true);
    } else {
      setIsNotificationExpanded(false);
    }
  }, [currentUrl]);

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
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
      className="REM"
    >
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <img
          src={userInfo?.avatar}
          alt="avatar"
          className="w-[8em] aspect-square rounded-full"
        />
        <p className="font-semibold text-lg">{userInfo?.name}</p>
      </div>
      <div className="menu-section border-t border-gray-300 pt-4">
        <ul>
          <li
            className={`menu-item ${
              currentUrl === "/accountmanagement/profile" ? "active" : ""
            } flex items-center`}
            onClick={() => {
              handleMenuItemClick("profile");
              navigate("/accountmanagement/profile");
            }}
          >
            <PersonOutlinedIcon /> Tài Khoản
          </li>

          <li
            className={`menu-item ${
              currentUrl === "/accountmanagement/purchase" ? "active" : ""
            } flex items-center`}
            onClick={() => {
              handleMenuItemClick("purchase");
              navigate("/accountmanagement/purchase");
            }}
          >
            <ShoppingBagOutlinedIcon /> Đơn Hàng
          </li>

          <li
            className={`menu-item ${
              currentUrl === "/accountmanagement/auction" ? "active" : ""
            } flex items-center`}
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
            } flex items-center`}
            onClick={() => {
              handleMenuItemClick("wallet");
              navigate("/accountmanagement/wallet");
            }}
          >
            <AccountBalanceWalletOutlinedIcon /> Số Dư & Giao Dịch
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
