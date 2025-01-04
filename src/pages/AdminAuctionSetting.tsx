import React, { useState } from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/admin/Sidebar";
import EditAuctionDetail from "../components/admin/EditAuctionDetail";
import { Link, useLocation } from "react-router-dom";

const AdminAuctionSetting: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("users");
  const location = useLocation();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);
  };

  return (
    <div className="w-full">
      <Grid
        container
        sx={{
          padding: "30px 40px",
          "& .MuiGrid2-root": {
            paddingLeft: "24px",
          },
          backgroundColor: "#fedddb24",
        }}
      >
        <Grid
          size={isCollapsed ? 0.5 : 2.5}
          className="account-menu2"
          sx={{
            paddingLeft: "0 !important",
          }}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={handleToggleCollapse}
          />
        </Grid>
        <Grid
          size={isCollapsed ? 11.5 : 9.5}
          sx={{
            height: "100vh",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border  REM py-12 px-4 w-full">
            <div className="flex flex-col shadow-md rounded-lg w-full h-fit">
              <Link
                to={"/admin/auction/settingPrice"}
                className={`p-3 rounded-t-lg ${
                  location.pathname === "/admin/auction/settingPrice"
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-200"
                } hover:cursor-pointer duration-300 transition-all`}
              >
                Cài đặt mức giá
              </Link>
              <Link
                to={"/admin/auction/auctionCriteria"}
                className={`p-3 rounded-b-lg ${
                  location.pathname === "/admin/auction/auctionCriteria"
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-200"
                } hover:cursor-pointer duration-300 transition-all`}
              >
                Cài đặt tiêu chí đánh giá
              </Link>
            </div>
            <div className="col-span-2">
              <EditAuctionDetail />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminAuctionSetting;
