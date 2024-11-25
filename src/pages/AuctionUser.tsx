import React from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/accountmanagement/Sidebar";
import AuctionHistory from "../components/auction/AuctionHistory";

const AuctionUser: React.FC = () => {
  return (
    <div className="account-user-container w-full">
      <Grid container spacing={3}>
        <Grid size={2} className="account-menu">
          <Sidebar />
        </Grid>
        <Grid size={10}>
          <div className="content-section">
            <AuctionHistory auctions={[]} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AuctionUser;
