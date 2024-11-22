import React, { useEffect, useState } from "react";
import { Typography, Button, TextField } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import Countdown from "react-countdown";
import "../ui/AuctionHistory.css";
import { Auction, OrderDetailData } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";

interface AuctionHistoryProps {
  auctions: Auction[];
}

const AuctionHistory: React.FC<AuctionHistoryProps> = () => {
  const [selectedAuctionStatus, setSelectedAuctionStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const userId = useAppSelector((state) => state.auth.userId);
  console.log("userid", userId);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrdersWithItems = async () => {
      try {
        if (!userId) {
          console.error("User ID not found");
          setLoading(false);
          return;
        }
        const response = await privateAxios.get(`/auction/user/joined`, {
          params: { userId },
        });

        console.log("API Response:", response);
        const auctionsData = response.data;

        if (!Array.isArray(auctionsData) || auctionsData.length === 0) {
          console.error("No auctions data or unexpected format:", auctionsData);
          setLoading(false);
          return;
        }

        setAuctions(auctionsData);
        console.log("Auctions user:", auctionsData);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithItems();
  }, [userId]); // Chạy lại khi userId thay đổi

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
      // case 'UPCOMING':
      //     return { color: '#6226EF', backgroundColor: '#EDE7F6', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
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
  console.log("123", auctions);

  const handleBuy = (auction: Auction, type: string) => {
    if (!auction) return;

    sessionStorage.setItem(
      "selectedComics",
      JSON.stringify({
        [auction.comics?.sellerId?.id]: {
          sellerName: auction.comics?.sellerId?.name,
          comics: [
            {
              comic: auction.comics,
              currentPrice: auction.currentPrice,
              auctionId: auction.id,
              quantity: 1,
              type,
            },
          ],
        },
      })
    );

    navigate("/checkout");
  };
  const getAuctionResultColor = (isWin: boolean) => {
    return isWin ? "#D6FFD8" : "red"; // Xanh lá cho win, xám cho lose
  };

  const renderAuctionContent = () => {
    // Ensure data is loaded before rendering
    if (loading) {
      return <Typography>Loading...</Typography>;
    }

    // If there are no auctions after filtering, display a message
    const filteredAuctions =
      selectedAuctionStatus === "all"
        ? auctions
        : auctions.filter(
            (auction: Auction) => auction.status === selectedAuctionStatus
          );

    if (filteredAuctions.length === 0) {
      return <Typography>Không có dữ liệu đấu giá phù hợp.</Typography>;
    }

    // Map through the filtered auctions and render each auction
    return filteredAuctions.map((auction: Auction) => {
      const isWin =
        auction.status === "SUCCESSFUL" && auction.winner.id === userId;

      return (
        <div
          key={auction.id}
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            marginBottom: "20px",
            padding: "16px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            borderLeft:
              isWin || auction.isWin === false
                ? `5px solid ${getAuctionResultColor(isWin)}`
                : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // marginBottom: '10px',
              padding: "10px 30px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <StoreOutlinedIcon style={{ marginRight: "8px" }} />
              <Typography sx={{ fontSize: "18px" }} variant="subtitle1">
                {auction.comics.sellerId.name}
              </Typography>
            </div>

            {/* Chip màu cho trạng thái đấu giá */}
            <div style={getStatusChipStyles(auction.status)}>
              <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                {translateStatus(auction.status)}
              </Typography>
            </div>
          </div>

          <div style={{ padding: "0px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "20px" }}>
                <img
                  src={auction.comics.coverImage}
                  style={{ width: "150px", marginRight: "16px" }}
                />
                <div>
                  <Typography
                    sx={{ fontSize: "28px", fontWeight: "bold" }}
                    variant="body1"
                  >
                    {auction.comics.title}
                  </Typography>

                  {auction.status === "ONGOING" && (
                    <div>
                      <Typography
                        sx={{ fontSize: "20px", marginTop: "12px" }}
                        variant="body2"
                      >
                        Giá hiện tại:{" "}
                        <span style={{ color: "#0000FF" }}>
                          {auction.currentPrice?.toLocaleString("vi-VN")} đ
                        </span>
                      </Typography>
                      {/* <Typography
                        sx={{ fontSize: "20px", marginTop: "8px" }}
                        variant="body2"
                      >
                        Bạn đã đặt giá:{" "}
                        <span style={{ color: "#FF7F00" }}>1.100.000 đ</span>
                      </Typography> */}
                    </div>
                  )}

                  {auction.status === "SUCCESSFUL" && (
                    <div>
                      <>
                        <Typography
                          sx={{ fontSize: "20px", marginTop: "8px" }}
                          variant="body2"
                        >
                          Giá cuối cùng:{" "}
                          <span style={{ color: "#FF0000" }}>
                            {auction.currentPrice?.toLocaleString("vi-VN")}
                          </span>
                        </Typography>
                      </>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "12px",
              paddingBottom: "20px",
              paddingRight: "20px",
            }}
          >
            {auction.status === "ONGOING" || auction.status === "SUCCESSFUL" ? (
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  fontSize: "15px",
                }}
                onClick={() => navigate(`/auctiondetail/${auction.id}`)}
              >
                TRỞ LẠI CUỘC ĐẤU GIÁ
              </Button>
            ) : (
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  fontSize: "16px",
                }}
              >
                XEM CHI TIẾT ĐẤU GIÁ
              </Button>
            )}
            {auction.status === "SUCCESSFUL" &&
            auction.winner?.id === userId ? (
              <div>
                <Button
                  size="large"
                  variant="contained"
                  style={{
                    backgroundColor: "green",
                    color: "#FFFFFF",
                    fontSize: "17px",

                    marginLeft: "10px",
                  }}
                  onClick={() => handleBuy(auction, "currentPrice")}
                >
                  <ShoppingCartOutlined className="mr-2" />
                  <Typography>Thanh toán</Typography>
                </Button>
              </div>
            ) : auction.status === "SUCCESSFUL" ? (
              <Typography
                sx={{ fontSize: "20px", marginTop: "8px", color: "#E91E63" }}
                variant="body2"
              >
                Đấu giá thất bại
              </Typography>
            ) : null}
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="status-auction-tabs">
        <span
          className={`status-auction-tab ${
            selectedAuctionStatus === "all" ? "active" : ""
          }`}
          onClick={() => setSelectedAuctionStatus("all")}
        >
          Tất cả
        </span>
        {/* <span
                    className={`status-auction-tab ${selectedAuctionStatus === 'UPCOMING' ? 'active' : ''}`}
                    onClick={() => setSelectedAuctionStatus('UPCOMING')}
                >
                    Sắp diễn ra
                </span> */}
        <span
          className={`status-auction-tab ${
            selectedAuctionStatus === "PROCESSING" ? "active" : ""
          }`}
          onClick={() => setSelectedAuctionStatus("PROCESSING")}
        >
          Đang xử lí
        </span>
        <span
          className={`status-auction-tab ${
            selectedAuctionStatus === "ONGOING" ? "active" : ""
          }`}
          onClick={() => setSelectedAuctionStatus("ONGOING")}
        >
          Đang diễn ra
        </span>
        <span
          className={`status-auction-tab ${
            selectedAuctionStatus === "SUCCESSFUL" ? "active" : ""
          }`}
          onClick={() => setSelectedAuctionStatus("SUCCESSFUL")}
        >
          Kết Thúc
        </span>
        <span
          className={`status-auction-tab ${
            selectedAuctionStatus === "FAILED" ? "active" : ""
          }`}
          onClick={() => setSelectedAuctionStatus("FAILED")}
        >
          Bị Hủy
        </span>
      </div>
      <div className="searchauctionbar">
        <SearchOutlinedIcon />
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          placeholder="Bạn có thể tìm kiếm theo Tên Sản phẩm đấu giá"
          InputProps={{
            disableUnderline: true,
            sx: { "& fieldset": { border: "none" } },
          }}
        />
      </div>
      <div className="auction-history-content">{renderAuctionContent()}</div>
    </div>
  );
};

export default AuctionHistory;
