// import { useEffect, useState } from "react";
// import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
// import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
// import MultipleStopOutlinedIcon from "@mui/icons-material/MultipleStopOutlined";
// import { useNavigate } from "react-router-dom";
// import { privateAxios } from "../../middleware/axiosInstance";
// import { UserInfo } from "../../common/base.interface";
// import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
// import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';

// const Sidebar = ({ onSelect }) => {
//   const [selectedMenuItem, setSelectedMenuItem] = useState("");
//   const navigate = useNavigate();

//   const handleMenuItemClick = (item: string) => {
//     setSelectedMenuItem(item);
//   };

//   const currentUrl = window.location.pathname;
//   console.log("URL", currentUrl);

//   const [userInfo, setUserInfo] = useState<UserInfo>();
//   const fetchUserInfo = async () => {
//     const response = await privateAxios("users/profile");
//     console.log("user info", response);

//     setUserInfo(response.data);
//   };
//   useEffect(() => {
//     fetchUserInfo();
//   }, []);

//   return (
//     <div>
//       <div className="menu-section" style={{ marginTop: '-10px', fontFamily: 'REM' }}>
//         <ul>
//           <li
//             className={`menu-item ${currentUrl === "/mod/comics" ? "active" : ""
//               }`}
//             onClick={() => {
//               handleMenuItemClick("comics");
//               navigate("/mod/comics");
//             }}
//           >
//             <ShoppingBagOutlinedIcon /> Quản Lý Truyện
//           </li>
//           <li
//             className={`menu-item ${currentUrl === "/mod/users" ? "active" : ""
//               }`}
//             onClick={() => {
//               handleMenuItemClick("users");
//               navigate("/mod/users");
//             }}
//           >
//             <PersonOutlinedIcon /> Quản Lý Người Dùng
//           </li>
//           <li
//             className={`menu-item ${currentUrl === "/mod/orders" ? "active" : ""
//               }`}
//             onClick={() => {
//               handleMenuItemClick("orders");
//               navigate("/mod/orders");
//             }}
//           >
//             <TvOutlinedIcon /> Quản Lý Đơn Hàng
//           </li>
//           <li
//             className={`menu-item ${currentUrl === "/mod/auctions" ? "active" : ""
//               }`}
//             onClick={() => {
//               handleMenuItemClick("auctions");
//               navigate("/mod/auctions");
//             }}
//           >
//             <GavelOutlinedIcon /> Quản Lý Đấu Giá
//           </li>
//           <li
//             className={`menu-item ${currentUrl === "/mod/exchanges" ? "active" : ""
//               }`}
//             onClick={() => {
//               handleMenuItemClick("exchanges");
//               navigate("/mod/exchanges");
//             }}
//           >
//             <MultipleStopOutlinedIcon /> Quản Lý Trao Đổi
//           </li>
//           <li
//             className={`menu-item ${currentUrl === "/mod/deposits" ? "active" : ""
//               }`}
//             onClick={() => {
//               handleMenuItemClick("deposits");
//               navigate("/mod/deposits");
//             }}
//           >
//             <AccountBalanceWalletOutlinedIcon /> Quản Lý Ví
//           </li>
//           {/* <li
//             className={`menu-item ${currentUrl === "/mod/feedbacks" ? "active" : ""
//               }`}
//             onClick={() => {
//               handleMenuItemClick("feedbacks");
//               navigate("/mod/feedbacks");
//             }}
//           >
//             <EventNoteOutlinedIcon /> Quản Lý Đánh Giá
//           </li> */}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AirplayOutlinedIcon from '@mui/icons-material/AirplayOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ViewHeadlineOutlinedIcon from '@mui/icons-material/ViewHeadlineOutlined';
import { privateAxios } from "../../middleware/axiosInstance";
import adminImage from '../../assets/settings.png';
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MultipleStopOutlinedIcon from "@mui/icons-material/MultipleStopOutlined";
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ isCollapsed, onToggleCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();
  const currentUrl = window.location.pathname;
  const drawerWidth = isCollapsed ? '5%' : '16%';

  const fetchUserInfo = async () => {
    try {
      const response = await privateAxios("users/profile");
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await privateAxios.post('/auth/logout');
      // quay về /login sau khi logout
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const menuItems = [
    {
      title: "Quản Lý Người Dùng",
      path: "/mod/users",
      icon: <PersonOutlineOutlinedIcon sx={{ color: 'inherit' }} />
    },
    {
      title: "Quản Lý Truyện",
      path: "/mod/comics",
      icon: <PersonOutlineOutlinedIcon sx={{ color: 'inherit' }} />
    }, {
      title: "Quản Lý Đơn Hàng",
      path: "/mod/orders",
      icon: <TvOutlinedIcon sx={{ color: 'inherit' }} />
    }, {
      title: "Quản Lý Đấu Giá",
      path: "/mod/auctions",
      icon: <GavelOutlinedIcon sx={{ color: 'inherit' }} />
    }, {
      title: "Quản Lý Trao Đổi",
      path: "/mod/exchanges",
      icon: <MultipleStopOutlinedIcon sx={{ color: 'inherit' }} />
    },
    // {
    //   title: "Quản Lý Đánh Giá",
    //   path: "/mod/feedbacks",
    //   icon: <EventNoteOutlinedIcon sx={{ color: 'inherit' }} />
    // },
    {
      title: "Quản Lý Ví",
      path: "/mod/deposits",
      icon: <AccountBalanceWalletOutlinedIcon sx={{ color: 'inherit' }} />
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #662249 0%, #a33757 100%)',
          color: '#fff',
          borderRight: 'none',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Header with Toggle Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? 1 : 3,
          minHeight: 64
        }}
      >
        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'REM',
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: '0.05em'
            }}
          >
            MOD PANEL
          </Typography>
        )}
        <IconButton onClick={onToggleCollapse} sx={{ color: '#fff' }}>
          <ViewHeadlineOutlinedIcon />
        </IconButton>
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

      {/* Profile Section */}
      {!isCollapsed && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            src={adminImage}
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto',
              border: '3px solid rgba(255, 255, 255, 0.2)',
            }}
          />
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontFamily: 'REM',
              color: '#fff',
              fontSize: '1rem'
            }}
          >
            {userInfo?.name || 'Admin'}
          </Typography>
        </Box>
      )}

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

      {/* Menu Items */}
      <List sx={{ px: isCollapsed ? 1 : 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.title} disablePadding sx={{ whiteSpace: 'nowrap' }}>
            <ListItemButton
              sx={{
                borderRadius: '8px',
                mb: 1,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                backgroundColor: currentUrl === item.path ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                transition: 'all 0.2s ease-in-out',
                minHeight: 48,
                px: isCollapsed ? 1 : 3,
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 0 : '40px',
                  color: currentUrl === item.path ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.title}
                  sx={{
                    '& .MuiTypography-root': {
                      fontFamily: 'REM',
                      fontWeight: currentUrl === item.path ? 'bold' : 'normal',
                      color: currentUrl === item.path ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.95rem',
                    }
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          position: 'absolute',
          bottom: '20px', 
          width: '100%',
          px: 2, 
        }}
      >
        <Button
          variant="contained"
          fullWidth
          startIcon={<LogoutOutlinedIcon />}
          sx={{
            background: '#c66a7a', 
            color: '#fff',
            fontWeight: 'bold',
            textTransform: 'none',
            padding: '10px', 
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#b85a6c',
            },
            transition: 'background-color 0.3s ease',
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

    </Drawer>
  );
};
export default Sidebar;