import React, { useState } from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/accountmanagement/Sidebar";
import ProfileUser from "./ProfileUser";

const Profile: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("purchase");

  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);
  };

  return (
    <div className="account-user-container w-full">
      <Grid container spacing={3}>
        <Grid size={2} className="account-menu">
          <Sidebar />
        </Grid>
        <Grid size={10}>
          <div className="content-section">
            <ProfileUser />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
