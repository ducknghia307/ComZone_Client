import React, { useState } from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/admin/Sidebar";
import AdminComicTab from "../components/admin/AdminComicTab";
import ConditionsList from "../components/admin/ConditionsList";

const AdminComicCondition: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4   REM py-12 px-4 w-full">
            <AdminComicTab />

            <div className="col-span-3 shadow-md bg-white p-3 rounded-lg">
              <ConditionsList />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminComicCondition;