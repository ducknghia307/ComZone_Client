import React, { useState } from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/admin/Sidebar";
import { Link, useLocation } from "react-router-dom";
import EditionsList from "../components/admin/EditionsList";

const AdminComicEdition: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const location = useLocation();
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
        <Grid size={isCollapsed ? 11.5 : 9.5}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4   REM py-12 px-4 w-full">
            <div className="flex flex-col shadow-md rounded-lg w-full h-fit">
              <Link
                to={"/admin/auction/genres"}
                className={`p-3 rounded-t-lg ${
                  location.pathname === "/admin/auction/genres"
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-200"
                } hover:cursor-pointer duration-300 transition-all`}
              >
                Thể loại truyện
              </Link>
              <Link
                to={"/admin/auction/editions"}
                className={`p-3 rounded-b-lg ${
                  location.pathname === "/admin/auction/editions"
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-200"
                } hover:cursor-pointer duration-300 transition-all`}
              >
               Phiên bản
              </Link>
            </div>

            <div className="col-span-2 shadow-md bg-white p-3 rounded-lg">
              <EditionsList />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminComicEdition;