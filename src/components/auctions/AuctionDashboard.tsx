import React, { useState } from "react";
import { Badge } from "@mui/material"; // Material-UI Badge
import AuctionManagement from "./AuctionManagement"; // Component for managing auctions
import AuctionRequestManagement from "./AuctionRequestManament";

const AuctionDashboard = () => {
  const [activeTab, setActiveTab] = useState("AUCTION");

  return (
    <div className="auction-dashboard w-full">
      {/* Tab Header */}
      <div className="flex justify-around border-b mb-3">
        <button
          className={`w-1/3 py-5 text-center font-bold text-lg ${
            activeTab === "AUCTION"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("AUCTION")}
        >
          Quản lí đấu giá
        </button>
        <button
          className={`w-1/3 py-5 text-center font-bold text-lg ${
            activeTab === "AUCTION_REQUEST"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("AUCTION_REQUEST")}
        >
          Quản lý yêu cầu đấu giá
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "AUCTION" && <AuctionManagement />}
        {activeTab === "AUCTION_REQUEST" && <AuctionRequestManagement />}
      </div>
    </div>
  );
};

export default AuctionDashboard;
