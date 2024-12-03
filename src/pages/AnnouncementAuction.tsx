import React from "react";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/accountmanagement/Sidebar";
import AnnouncementUser from "./AnnouncementUser";
const AnnouncementAuction = () => {
  return (
    <div className="account-user-container w-full">
      <Grid container spacing={3}>
        <Grid size={2} className="account-menu">
          <Sidebar />
        </Grid>
        <Grid size={10}>
          <div className="content-section">
            <AnnouncementUser />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AnnouncementAuction;
