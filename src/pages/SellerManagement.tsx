import React, { useEffect, useState } from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/sellermanagement/Sidebar";
import SellerManagement from "../components/sellermanagement/SellerComicsManagement";
import { SellerSubscription } from "../common/interfaces/seller-subscription.interface";
import { privateAxios } from "../middleware/axiosInstance";
import SellerComicsManagement from "../components/sellermanagement/SellerComicsManagement";
import OrderManagement from "../components/sellermanagement/OrderManagement";
import AuctionManagement from "../components/auctions/AuctionManagement";
import FeedbackManagement from "../components/feedback/FeedbackManagement";
const SellerManagementPage: React.FC = () => {
  const currentUrl = window.location.pathname;
  console.log("URL", currentUrl);

  const [selectedMenuItem, setSelectedMenuItem] = useState("comic");
  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);
  };

  const [sellerSubscription, setSellerSubscription] =
    useState<SellerSubscription | null>();

  const fetchSellerSubscription = async () => {
    await privateAxios
      .get("seller-subscriptions/user")
      .then((res) => {
        setSellerSubscription(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchSellerSubscription();
  }, []);

  const getTable = () => {
    switch (window.location.pathname) {
      case "/sellermanagement/comic":
        return (
          <SellerComicsManagement
            sellerSubscription={sellerSubscription}
            fetchSellerSubscription={fetchSellerSubscription}
          />
        );
      case "/sellermanagement/order":
        return <OrderManagement />;
      case "/sellermanagement/auction":
        return <AuctionManagement />;
      case "/sellermanagement/feedback":
        return <FeedbackManagement />;
    }
  };

  return (
    <div className="w-full flex items-stretch justify-center gap-4 md:px-8 py-4 bg-gray-50">
      <div className="min-w-fit rounded-md">
        <Sidebar
          currentUrl={currentUrl}
          handleMenuItemClick={handleMenuItemClick}
          sellerSubscription={sellerSubscription}
          fetchSellerSubscription={fetchSellerSubscription}
        />
      </div>

      <div className="grow max-w-[80vw] flex items-stretch">
        {getTable()}
      </div>
    </div>
  );
};
export default SellerManagementPage;
