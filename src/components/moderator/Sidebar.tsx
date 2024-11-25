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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ViewHeadlineOutlinedIcon from "@mui/icons-material/ViewHeadlineOutlined";
import { privateAxios } from "../../middleware/axiosInstance";
import adminImage from "../../assets/settings.png";
import { UserInfo } from "../../common/base.interface";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ isCollapsed, onToggleCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const currentUrl = window.location.pathname;
  const drawerWidth = isCollapsed ? "5%" : "16%";

  const fetchUserInfo = async () => {
    try {
      const response = await privateAxios("users/profile");
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const menuItems = [
    {
      title: "Quản Lý Người Dùng",
      path: "/mod/users",
      icon: <PersonOutlineOutlinedIcon sx={{ color: "inherit" }} />,
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
            }}
          >
            MOD PANEL
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
          <Avatar
            src={adminImage}
            sx={{
              width: 80,
              height: 80,
              margin: "0 auto",
              border: "3px solid rgba(255, 255, 255, 0.2)",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontFamily: "REM",
              color: "#fff",
              fontSize: "1rem",
            }}
          >
            {userInfo?.name || "Admin"}
          </Typography>
        </Box>
      )}
      ddowij xiu goi dien
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
                minHeight: 48,
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
    </Drawer>
  );
};
export default Sidebar;
