import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { publicAxios } from "../../middleware/axiosInstance";
import StarIcon from "@mui/icons-material/Star";
import TimerIcon from "@mui/icons-material/Timer";
import GavelIcon from "@mui/icons-material/Gavel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import CardMembershipOutlined from "@mui/icons-material/CardMembershipOutlined";
import BuyPlan from "../RegisterSeller/BuyPlan";
import { UserInfo } from "../../common/base.interface";

export interface MembershipPlan {
  id: string;
  price: number;
  duration: number;
  sellTime: number;
  auctionTime: number;
}

const ComicZoneMembership = ({
  user,
  setIsRegisterSellerModal,
  redirect,
}: {
  user?: UserInfo;
  setIsRegisterSellerModal?: React.Dispatch<React.SetStateAction<boolean>>;
  redirect?: string;
}) => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isBuyingPlan, setIsBuyingPlan] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await publicAxios.get("/seller-subs-plans");
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching membership plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const getPlanIcon = (index: number) => {
    switch (index) {
      case 0:
        return <AccessTimeIcon sx={{ fontSize: 40, color: "#333" }} />;
      case 1:
        return <StarIcon sx={{ fontSize: 40, color: "#fff" }} />;
      case 2:
        return <AutoAwesomeIcon sx={{ fontSize: 40, color: "#fff" }} />;
      default:
        return <StarIcon sx={{ fontSize: 40 }} />;
    }
  };

  const getPlanTitle = (index: number) => {
    switch (index) {
      case 0:
        return "GÓI DÙNG THỬ";
      case 1:
        return "GÓI NÂNG CẤP";
      case 2:
        return "KHÔNG GIỚI HẠN";
      default:
        return "GÓI DÙNG THỬ";
    }
  };

  const getPlanDescription = (index: number) => {
    switch (index) {
      case 0:
        return "Bắt đầu trải nghiệm";
      case 1:
        return "Nâng tầm cuộc chơi";
      case 2:
        return "Bứt phá giới hạn";
      default:
        return "Mô tả gói";
    }
  };

  const getPlanColor = (index: number) => {
    switch (index) {
      case 0:
        return "#F9F9F9";
      case 1:
        return "#4A4A4A";
      case 2:
        return "#000";
      default:
        return "#F9F9F9";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: "REM" }}>
          Đang tải gói thành viên...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className="membership-container"
      sx={{
        padding: "40px 20px",
        backgroundColor: "#FFF",
        borderRadius: "16px",
        margin: "10px auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(135deg, #000 0%, #808080 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 60%, 0 100%)",
          zIndex: 0,
        }}
      />

      <Chip
        label="GÓI ĐĂNG KÝ CHO NGƯỜI BÁN COMZONE"
        icon={<AutoAwesomeIcon sx={{ color: "#FFFFFF !important" }} />}
        sx={{
          fontSize: "1.5em",
          fontWeight: "bold",
          backgroundColor: "#000",
          color: "#FFFFFF",
          padding: "20px 20px",
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          fontFamily: "REM",
          boxShadow: "0 4px 20px #808080",
          "& .MuiChip-icon": {
            fontSize: "28px",
          },
          border: "2px solid white",
        }}
      />

      <Grid
        container
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
        sx={{ paddingTop: "40px", position: "relative", zIndex: 1 }}
      >
        {plans.map((plan, index) => (
          <Grid key={plan.id} size={4} sx={{ display: "flex" }}>
            <Box
              sx={{
                flex: 1,
                borderRadius: "24px",
                padding: "20px 10px",
                backgroundColor: getPlanColor(index),
                color: index === 0 ? "#333" : "#FFFFFF",
                border: index === 0 ? "2px solid #E0E0E0" : "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                fontFamily: "REM",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-12px)",
                  boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Box sx={{ textAlign: "center", mb: 3 }}>
                {getPlanIcon(index)}
                <Typography
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    fontFamily: "REM",
                    fontSize: "1.2em",
                  }}
                >
                  {getPlanTitle(index)}
                </Typography>
                <Typography
                  sx={{
                    opacity: 0.9,
                    fontFamily: "REM",
                  }}
                >
                  {getPlanDescription(index)}
                </Typography>
              </Box>

              <div className="flex flex-col gap-1 rounded-md p-2 mb-4">
                {plan.sellTime > 0 && (
                  <div className="flex items-center justify-start gap-2">
                    <CardMembershipOutlined />
                    <p>Số lượt bán:</p>
                    <p>{plan.sellTime}</p>
                  </div>
                )}

                {plan.sellTime > 0 && (
                  <div className="flex items-center justify-start gap-2">
                    <GavelIcon />
                    <p>Số lượt mở đấu giá:</p>
                    <p>{plan.auctionTime}</p>
                  </div>
                )}

                {plan.sellTime === 0 &&
                  plan.auctionTime === 0 &&
                  plan.duration > 0 && (
                    <div className="flex flex-col items-center justify-center text-center">
                      <AllInclusiveIcon />
                      <p className="font-bold text-lg py-2">
                        Bán & Đấu giá truyện không giới hạn
                      </p>
                    </div>
                  )}

                {plan.duration > 0 && (
                  <div className="flex items-center justify-start gap-2">
                    <AccessTimeIcon />
                    <p>Thời hạn:</p>
                    <p>{plan.duration * 30} ngày</p>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setIsBuyingPlan(plan.id)}
                variant="contained"
                sx={{
                  mt: "auto",
                  backgroundColor: index === 0 ? "#444" : "#FFFFFF",
                  color: index === 0 ? "#FFFFFF" : getPlanColor(index),
                  fontWeight: index > 0 && "bold",
                  padding: "12px 32px",
                  borderRadius: "50px",
                  fontSize: "1em",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  fontFamily: "REM",
                  boxShadow:
                    index === 0
                      ? "0 4px 20px #808080"
                      : index === 1
                      ? "0 4px 20px #d9d3d2"
                      : index === 2
                      ? "0 4px 20px #FFFFFF"
                      : "0 4px 20px rgba(255,255,255,0.4)",
                  "&:hover": {
                    backgroundColor: index === 0 ? "#000" : "#FFFFFF",
                    transform: "scale(1.05)",
                  },
                }}
              >
                {plan.price > 0
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(plan.price)
                  : "Bắt đầu dùng thử"}
              </Button>
            </Box>
            <BuyPlan
              user={user}
              index={index}
              plan={plan}
              isOpen={isBuyingPlan === plan.id}
              setIsOpen={setIsBuyingPlan}
              setIsRegisterSellerModal={setIsRegisterSellerModal}
              redirect={redirect}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ComicZoneMembership;
