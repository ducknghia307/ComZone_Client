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
import { privateAxios } from "../../middleware/axiosInstance";
import { useAppSelector } from "../../redux/hooks";

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
  };
}

interface Bid {
  id: string;
  price: number;
  createdAt: string;
}

const AuctionDetailModal: React.FC<AuctionDetailModalProps> = ({
  open,
  onClose,
  auction,
}) => {
  const [userBids, setUserBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    const fetchUserBids = async () => {
      if (!open || !auction.id) return;

      try {
        setLoading(true);
        const response = await privateAxios.get(`/bids/user/auction/${auction.id}`);
        setUserBids(response.data);
      } catch (error) {
        console.error("Error fetching user bids:", error);
        setUserBids([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBids();
  }, [open, auction.id]);

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
          display: "inline-block",
        };
      case "UPCOMING":
        return {
          color: "#ff9800",
          backgroundColor: "#fff3e0",
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
          display: "inline-block",
        };
      case "FAILED":
        return {
          color: "#e91e63",
          backgroundColor: "#fce4ec",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "REJECTED":
        return {
          color: "#f44336",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "COMPLETED":
        return {
          color: "#009688",
          backgroundColor: "#e0f2f1",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return "Đấu giá thành công";
      case "COMPLETED":
        return "Hoàn thành";
      case "ONGOING":
        return "Đang diễn ra";
      case "FAILED":
        return "Đấu giá thất bại";
      case "REJECTED":
        return "Bị từ chối";
      default:
        return status;
    }
  };

  const formattedStartTime = new Date(auction.startTime).toLocaleString(
    "vi-VN"
  );
  const formattedEndTime = new Date(auction.endTime).toLocaleString("vi-VN");

  const isWin = auction.status === "SUCCESSFUL" && auction.winner?.id === userId;

  const statusText = isWin
    ? "Đấu giá thành công"
    : auction.status === "SUCCESSFUL" ||
      (auction.status === "COMPLETED" && auction.winner?.id !== userId)
      ? "Đấu giá thất bại"
      : translateStatus(auction.status);

  const statusStyles = isWin
    ? getStatusChipStyles("SUCCESSFUL")
    : auction.status === "SUCCESSFUL" ||
      (auction.status === "COMPLETED" && auction.winner?.id !== userId)
      ? getStatusChipStyles("FAILED")
      : getStatusChipStyles(auction.status);

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
          }}
        >
          Chi tiết đấu giá
        </span>

        {/* Status at the end */}
        <div style={statusStyles}>
          <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
            {statusText}
          </Typography>
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
          <div style={{ flex: 1, padding: "20px" }}>
            <Typography
              variant="h5"
              style={{ color: "#000", marginBottom: "15px", fontWeight: 600 }}
            >
              {auction.comics.title}
            </Typography>
            {[
              {
                label: "Giá hiện tại",
                value: auction.currentPrice,
                highlight: true,
              },
              { label: "Giá tối đa", value: auction.maxPrice },
              { label: "Giá đặt cọc", value: auction.depositAmount },
              { label: "Giá khởi điểm", value: auction.reservePrice },
              // { label: "Thời gian bắt đầu", value: formattedStartTime },
              // { label: "Thời gian kết thúc", value: formattedEndTime },
              {
                label: "Thời gian",
                value: (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      fontWeight: "bold",
                    }}
                  >
                    <span>{formattedStartTime}</span>
                    <span style={{ margin: "0 10px", color: "#000" }}>-</span>
                    <span>{formattedEndTime}</span>
                  </div>
                ),
              },
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
                <Typography style={{ color: "#666", fontWeight: 500 }}>
                  {label}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "bold",
                    color: highlight ? "#d32f2f" : "#000",
                  }}
                >
                  {typeof value === "number"
                    ? value.toLocaleString("vi-VN") + " đ"
                    : value}
                </Typography>
              </div>
            ))}
            <div style={{ marginTop: "20px" }}>
              <Chip
                label="Lịch sử ra giá của bạn"
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid black",
                  fontWeight: 600,
                  padding: "10px",
                  marginBottom: "10px",
                  boxShadow: "3px 3px rgba(0,0,0,0.3)",
                }}
              />
              {loading ? (
                <Typography>Đang tải...</Typography>
              ) : userBids.length === 0 ? (
                <Typography>Chưa có lượt đấu giá</Typography>
              ) : (
                <div
                  style={{
                    maxHeight: "100px",
                    overflowY: "auto",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  {userBids.map((bid) => (
                    <div
                      key={bid.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Typography style={{ color: "#666" }}>
                        {new Date(bid.createdAt).toLocaleString("vi-VN")}
                      </Typography>
                      <Typography style={{ fontWeight: "bold", color: "#000" }}>
                        {bid.price.toLocaleString("vi-VN")} đ
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
            // '&:hover': { backgroundColor: '#333' }
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuctionDetailModal;
