import React, { useEffect, useState } from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/accountmanagement/Sidebar";
import ProfileUser from "./ProfileUser";
import RegisterSellerModal from "../components/RegisterSeller/RegisterSellerModal";
import { privateAxios } from "../middleware/axiosInstance";
import { notification } from "antd";

const Profile: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("purchase");
  const [isRegisteringSeller, setIsRegisteringSeller] =
    useState<boolean>(false);

  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);
  };

  const handleSubscribePlan = async (planId: string) => {
    await privateAxios
      .post("seller-subscriptions", {
        planId,
      })
      .then(() => {
        notification.success({
          key: "buy-plan",
          message: "Đăng ký gói bán ComZone thành công!",
          description: (
            <p className="text-xs REM">
              Giờ đây bạn có thể tiến hành bán và đấu giá truyện tranh trên hệ
              thống với số lượt của gói đăng ký.
            </p>
          ),
          duration: 8,
        });
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          key: "buy-plan",
          message: "Đã có lỗi xảy ra!",
          duration: 5,
        });
      });
  };

  useEffect(() => {
    const sessionRedirect = sessionStorage.getItem("registeringSellerPlan");
    if (sessionRedirect) {
      const params: any = new Proxy(
        new URLSearchParams(window.location.search),
        {
          get: (searchParams, prop) => searchParams.get(prop.toString()),
        }
      );
      const paymentStatus = params ? params.payment_status : null;
      if (paymentStatus && paymentStatus === "SUCCESSFUL") {
        handleSubscribePlan(sessionRedirect);
      }
      sessionStorage.removeItem("registeringSellerPlan");
    }
  }, []);

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

      {isRegisteringSeller && (
        <RegisterSellerModal
          isRegisterSellerModal={isRegisteringSeller}
          setIsRegisterSellerModal={setIsRegisteringSeller}
        />
      )}
    </div>
  );
};

export default Profile;
