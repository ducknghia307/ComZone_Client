import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { publicAxios } from "../../middleware/axiosInstance";

interface AuctionDetailModalProps {
  open: boolean;
  onClose: () => void;
  auction: {
    id: string;
    comics: { id: string; title: string; coverImage: string };
    currentPrice?: number;
    maxPrice: number;
    reservePrice: number;
    depositAmount: number;
    startTime: string;
    endTime: string;
    status: string;
    winner?: { id: string; createdAt: string; name: string };
    currentCondition?: string;
  };
}

const AuctionDetailModalSeller: React.FC<AuctionDetailModalProps> = ({
  open,
  onClose,
  auction,
}) => {
  const [bids, setBids] = useState<any[]>([]);
  const fetchBidsOfAuction = async () => {
    try {
      const responseBid = await publicAxios.get(`/bids/auction/${auction?.id}`);
      const bidData = responseBid.data;
      setBids(bidData);
    } catch (error) {
      console.error("Error fetching bid details:", error);
    }
  };
  console.log("1", bids);

  useEffect(() => {
    if (auction?.id) {
      fetchBidsOfAuction();
    }
  }, [auction?.id]);

  if (!auction) return null;

  const getStatusChipStyles = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return {
          color: "#4caf50",
          backgroundColor: "#e8f5e9",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
        };
      case "UPCOMING":
        return {
          color: "#ff9800",
          backgroundColor: "#fff3e0",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
        };
      case "PENDING_APPROVAL":
        return {
          color: "#a64dff",
          backgroundColor: "#f2e6ff",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "ONGOING":
        return {
          color: "#2196f3",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
        };
      case "FAILED":
        return {
          color: "#e91e63",
          backgroundColor: "#fce4ec",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
        };
      case "REJECTED":
        return {
          color: "#f44336",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
        };
      case "COMPLETED":
        return {
          color: "#009688",
          backgroundColor: "#e0f2f1",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
        };
      case "CANCELED":
        return {
          color: "#f44336",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
        };
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return "Thành công";
      case "COMPLETED":
        return "Hoàn thành";
      case "PENDING_APPROVAL":
        return "Chờ duyệt";
      case "ONGOING":
        return "Đang diễn ra";
      case "UPCOMING":
        return "Sắp diễn ra";
      case "FAILED":
        return "Thất bại";
      case "CANCELED":
        return "Bị hủy";
      default:
        return status;
    }
  };

  const formattedStartTime = new Date(auction.startTime).toLocaleString(
    "vi-VN"
  );
  const formattedEndTime = new Date(auction.endTime).toLocaleString("vi-VN");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "#ffffff",
          color: "#333",
          borderRadius: "12px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
        },
      }}
    >
      <DialogTitle
        style={{
          backgroundColor: "#f5f5f5",
          color: "#000",
          fontWeight: 700,
          borderBottom: "1px solid #e0e0e0",
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <span style={{ flex: 1, textAlign: "left" }}></span>
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "REM",
          }}
        >
          Chi tiết đấu giá
        </span>

        {/* Status at the end */}
        <div
          style={{
            ...getStatusChipStyles(auction.status),
            display: "inline-block",
            textAlign: "center",
            fontSize: "14px",
            fontFamily: "REM",
          }}
        >
          {translateStatus(auction.status)}
        </div>
      </DialogTitle>

      <DialogContent>
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "0 10px",
            backgroundColor: "#ffffff",
            // border: '1px solid #e0e0e0',
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <img
            src={auction.comics.coverImage}
            alt="Comic cover"
            style={{
              width: "250px",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              objectFit: "cover",
              border: "1px solid #e0e0e0",
            }}
          />
          <div style={{ flex: 1, padding: "15px" }}>
            <Typography
              variant="h5"
              style={{ color: "#000", marginBottom: "15px", fontWeight: 600, fontFamily: "REM" }}
            >
              {auction.comics.title}
            </Typography>
            {[
              {
                label: "Giá hiện tại",
                value: auction.currentPrice,
                highlight: true,
              },
              { label: "Giá mua ngay", value: auction.maxPrice },
              { label: "Giá đặt cọc", value: auction.depositAmount },
              { label: "Giá khởi điểm", value: auction.reservePrice },
              { label: "Thời gian bắt đầu", value: formattedStartTime },
              { label: "Thời gian kết thúc", value: formattedEndTime },
            ].map(({ label, value, highlight }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  borderBottom: "1px solid #e0e0e0",
                  paddingBottom: "8px",
                }}
              >
                <Typography style={{ color: "#666", fontWeight: 500, fontFamily: "REM" }}>
                  {label}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "500",
                    color: highlight ? "#d32f2f" : "#000",
                    fontFamily: "REM"
                  }}
                >
                  {typeof value === "number"
                    ? value.toLocaleString("vi-VN") + " đ"
                    : value}
                </Typography>
              </div>
            ))}
            {/* Display bids */}{" "}
            {bids.length === 0 ? null : (
              <div style={{ marginTop: "20px" }}>
                <Chip
                  label="Lịch sử ra giá"
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "1px solid black",
                    fontWeight: 600,
                    padding: "10px",
                    marginBottom: "10px",
                    boxShadow: "3px 3px rgba(0,0,0,0.3)",
                    fontFamily: "REM",
                  }}
                />

                <div className="max-h-[100px] overflow-y-auto border border-[#e0e0e0] rounded-lg p-2 scrollbar-thin ">
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex justify-between py-2 border-b border-[#f0f0f0]"
                    >
                      <Typography className="text-[#666]" sx={{ fontFamily: "REM" }}>
                        {new Date(bid.createdAt).toLocaleString("vi-VN")}
                      </Typography>
                      <Typography className="font-bold text-[#000]" sx={{ fontFamily: "REM" }}>
                        {bid.user.name} - {bid.price.toLocaleString("vi-VN")} đ
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {auction.winner && (
              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #e0e0e0",
                  paddingBottom: "15px",
                }}
              >
                <Typography style={{ color: "#666", fontWeight: 500, fontFamily: "REM" }}>
                  Người thắng
                </Typography>
                <Typography style={{ color: "#000", fontWeight: 600, fontFamily: "REM" }}>
                  {auction.winner.name}
                </Typography>
              </div>
            )}
            {auction.currentCondition && (
              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography style={{ color: "#666", fontWeight: 500, fontFamily: "REM" }}>
                  Lý do
                </Typography>
                <Typography style={{ color: "#000", fontWeight: 600, fontFamily: "REM" }}>
                  {auction.currentCondition}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          justifyContent: "center",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          style={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "4px",
            padding: "10px 30px",
            fontWeight: 600,
            textTransform: "none",
            fontFamily: "REM",
            // '&:hover': { backgroundColor: '#333' }
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuctionDetailModalSeller;
