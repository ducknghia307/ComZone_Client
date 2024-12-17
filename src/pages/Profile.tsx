import React, { useState } from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/accountmanagement/Sidebar";
import ProfileUser from "./ProfileUser";
import Loading from "../components/loading/Loading";

const Profile: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <div className="account-user-container w-full">
      {isLoading && <Loading />}
      <Grid container spacing={3}>
        <Grid size={2} className="account-menu">
          <Sidebar />
        </Grid>
        <Grid size={10}>
          <div className="content-section">
            <ProfileUser setIsLoading={setIsLoading} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
