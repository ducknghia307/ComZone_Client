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
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AirplayOutlinedIcon from "@mui/icons-material/AirplayOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ViewHeadlineOutlinedIcon from "@mui/icons-material/ViewHeadlineOutlined";
import { privateAxios } from "../../middleware/axiosInstance";
import adminImage from "../../assets/hcn-logo (1).png";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MultipleStopOutlinedIcon from "@mui/icons-material/MultipleStopOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { LogoutUser } from "../../redux/features/auth/authActionCreators";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSelect?: (item: string) => void;
}

const Sidebar = ({ isCollapsed, onToggleCollapse, onSelect }: SidebarProps) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();
  const currentUrl = window.location.pathname;
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const drawerWidth = isCollapsed ? "5%" : "300px";

  const fetchUserInfo = async () => {
    try {
      const response = await privateAxios("users/profile");
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleLogout = async () => {
    await dispatch(LogoutUser());
    window.location.href = "/";
    // window.location.reload();
  };
  useEffect(() => {
    fetchUserInfo();
  }, [accessToken]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const menuItems = [
    {
      title: "Quản Lý Người Dùng",
      path: "/mod/users",
      icon: <PersonOutlineOutlinedIcon sx={{ color: "inherit" }} />,
    },
    {
      title: "Quản Lý Truyện",
      path: "/mod/comics",
      icon: <AirplayOutlinedIcon sx={{ color: "inherit" }} />,
    },
    {
      title: "Quản Lý Đơn Hàng",
      path: "/mod/orders",
      icon: <TvOutlinedIcon sx={{ color: "inherit" }} />,
    },
    {
      title: "Quản Lý Đấu Giá",
      path: "/mod/auctions",
      icon: <GavelOutlinedIcon sx={{ color: "inherit" }} />,
    },
    {
      title: "Quản Lý Ví",
      path: "/mod/deposits",
      icon: <AccountBalanceWalletOutlinedIcon sx={{ color: "inherit" }} />,
    },
    {
      title: "Quản Lý Đánh Giá",
      path: "/mod/feedbacks",
      icon: <EventNoteOutlinedIcon sx={{ color: "inherit" }} />,
    },
    {
      title: "Quản Lý Hoàn Tiền",
      path: "/mod/refunds",
      icon: <CurrencyExchangeOutlinedIcon sx={{ color: "inherit" }} />,
    },
    {
        title: "Quản Lý Trao Đổi",
        path: "/mod/exchanges",
        icon: <MultipleStopOutlinedIcon sx={{ color: 'inherit' }} />
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #662249 0%, #a33757 100%)",
          color: "#fff",
          borderRight: "none",
          transition: "width 0.3s ease",
          overflowX: "hidden",
          overflowY: "auto",
        },
      }}
    >
      {/* Header with Toggle Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          padding: isCollapsed ? 1 : 3,
          minHeight: 64,
        }}
      >
        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{
              fontFamily: "REM",
              fontWeight: "bold",
              color: "#fff",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              textAlign: "center",
              flex: 1,
            }}
          >
            MODERATOR
          </Typography>
        )}
        <IconButton onClick={onToggleCollapse} sx={{ color: "#fff" }}>
          <ViewHeadlineOutlinedIcon />
        </IconButton>
      </Box>

      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }} />

      {/* Profile Section */}
      {!isCollapsed && (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <img
            src={adminImage}
            style={{
              width: 200,
              margin: '0 auto',
            }}
          />
          {/* <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontFamily: 'REM',
              color: '#fff',
              fontSize: '1rem'
            }}
          >
            {userInfo?.name || 'Admin'}
          </Typography> */}
        </Box>
      )}

      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }} />

      {/* Menu Items */}
      <List sx={{ px: isCollapsed ? 1 : 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.title}
            disablePadding
            sx={{ whiteSpace: "nowrap" }}
          >
            <ListItemButton
              sx={{
                borderRadius: "8px",
                mb: 1,
                justifyContent: isCollapsed ? "center" : "flex-start",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                backgroundColor:
                  currentUrl === item.path
                    ? "rgba(255, 255, 255, 0.12)"
                    : "transparent",
                transition: "all 0.2s ease-in-out",
                minHeight: 35,
                px: isCollapsed ? 1 : 3,
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 0 : "40px",
                  color:
                    currentUrl === item.path
                      ? "#fff"
                      : "rgba(255, 255, 255, 0.7)",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.title}
                  sx={{
                    "& .MuiTypography-root": {
                      fontFamily: "REM",
                      fontWeight: currentUrl === item.path ? "bold" : "normal",
                      color:
                        currentUrl === item.path
                          ? "#fff"
                          : "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.95rem",
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <ListItem
        disablePadding
        sx={{
          whiteSpace: "nowrap",
          // position: "absolute",
          bottom: "10px",
          width: "100%",
          padding: "0 20px",
        }}
      >
        <ListItemButton
          sx={{
            borderRadius: "8px",
            justifyContent: isCollapsed ? "center" : "flex-start",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
            minHeight: 35,
            px: isCollapsed ? 1 : 3,
          }}
          onClick={handleLogout}
        >
          <ListItemIcon
            sx={{
              minWidth: isCollapsed ? 0 : "40px",
              color: "#fff",
              justifyContent: "center",
            }}
          >
            <LogoutOutlinedIcon />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiTypography-root": {
                  fontFamily: "REM",
                  fontWeight: "bold",
                  color: "#fff",
                  fontSize: "0.95rem",
                },
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    </Drawer>
  );
};
export default Sidebar;
