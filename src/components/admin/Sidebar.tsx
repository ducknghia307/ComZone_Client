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

const Sidebar = ({ onSelect }) => {
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
      <div className="menu-section" style={{ marginTop: '-10px', fontFamily: 'REM' }}>
        <ul>
          <li
            className={`menu-item ${currentUrl === "/admin/dashboard" ? "active" : ""
              }`}
            onClick={() => {
              handleMenuItemClick("dashboard");
              navigate("/admin/dashboard");
            }}
          >
            <PersonOutlinedIcon /> Bảng Điều Khiển
          </li>
          <li
            className={`menu-item ${currentUrl === "/admin/users" ? "active" : ""
              }`}
            onClick={() => {
              handleMenuItemClick("users");
              navigate("/admin/users");
            }}
          >
            <PersonOutlinedIcon /> Quản Lý Người Dùng
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
