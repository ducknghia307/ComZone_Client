import React from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import OrderHistory from "../components/order/OrderHistory";
import Sidebar from "../components/accountmanagement/Sidebar";

const OrderUser: React.FC = () => {
  return (
    <div className="account-user-container w-full">
      <Grid container spacing={3}>
        <Grid size={2} className="account-menu">
          <Sidebar />
        </Grid>
        <Grid size={10}>
          <div className="content-section">
            <OrderHistory />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderUser;
