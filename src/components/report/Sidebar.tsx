import { useEffect, useState } from "react";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MultipleStopOutlinedIcon from "@mui/icons-material/MultipleStopOutlined";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../middleware/axiosInstance";
import { UserInfo } from "../../common/base.interface";
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';

const Sidebar = ({onSelect}) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const navigate = useNavigate();

  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);
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
    <div>
      <div className="menu-section" style={{marginTop:'-10px'}}>
        <ul>
          <li
            className={`menu-item ${
              currentUrl === "/mod/comics" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("comics");
              navigate("/mod/comics");
            }}
          >
            <ShoppingBagOutlinedIcon /> Quản Lý Truyện
          </li>
          <li
            className={`menu-item ${
              currentUrl === "/mod/users" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("users");
              navigate("/mod/users");
            }}
          >
            <PersonOutlinedIcon /> Quản Lý Người Dùng
          </li>
          <li
            className={`menu-item ${
              currentUrl === "/mod/orders" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("orders");
              navigate("/mod/orders");
            }}
          >
            <TvOutlinedIcon /> Quản Lý Đơn Hàng
          </li>
          <li
            className={`menu-item ${
              currentUrl === "/mod/auctions" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("auctions");
              navigate("/mod/auctions");
            }}
          >
            <GavelOutlinedIcon /> Quản Lý Đấu Giá
          </li>
          <li
            className={`menu-item ${
              currentUrl === "/mod/exchanges" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("exchanges");
              navigate("/mod/exchanges");
            }}
          >
            <MultipleStopOutlinedIcon /> Quản Lý Trao Đổi
          </li>
          <li
            className={`menu-item ${
              currentUrl === "/mod/deposits" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("deposits");
              navigate("/mod/deposits");
            }}
          >
            <AccountBalanceWalletOutlinedIcon /> Quản Lý Ví
          </li>
          <li
            className={`menu-item ${
              currentUrl === "/mod/feedbacks" ? "active" : ""
            }`}
            onClick={() => {
              handleMenuItemClick("feedbacks");
              navigate("/mod/feedbacks");
            }}
          >
            <EventNoteOutlinedIcon /> Quản Lý Đánh Giá
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
