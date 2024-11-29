import React, { useEffect, useState } from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/sellermanagement/Sidebar";
import SellerManagement from "../components/sellermanagement/SellerManagement";
import { SellerSubscription } from "../common/interfaces/seller-subscription.interface";
import { privateAxios } from "../middleware/axiosInstance";
const ComicSeller: React.FC = () => {
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

  return (
    <div className="w-full flex items-start justify-center gap-4 md:px-8 py-4 bg-gray-50">
      <div className="min-w-fit rounded-md self-stretch pb-8">
        <Sidebar
          currentUrl={currentUrl}
          handleMenuItemClick={handleMenuItemClick}
          sellerSubscription={sellerSubscription}
          fetchSellerSubscription={fetchSellerSubscription}
        />
      </div>

      <div className="grow max-w-[80vw]">
        <SellerManagement
          sellerSubscription={sellerSubscription}
          fetchSellerSubscription={fetchSellerSubscription}
        />
      </div>
    </div>
  );
};
export default ComicSeller;
