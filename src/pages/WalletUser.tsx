import React from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/accountmanagement/Sidebar";
import UserWallet from "../components/wallet/UserWallet";

const WalletUser: React.FC = () => {
  return (
    <div className="w-full bg-[#f9f9f9] lg:px-8 mt-2">
      <div className="w-full flex flex-col lg:flex-row items-stretch gap-2 min-h-[70vh]">
        <div className="min-w-fit flex flex-col items-stretch justify-start bg-white px-8">
          <Sidebar />
        </div>

        <div className="w-full">
          <UserWallet />
        </div>
      </div>
    </div>
  );
};

export default WalletUser;
