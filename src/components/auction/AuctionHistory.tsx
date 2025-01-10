import React, { useEffect, useState } from "react";
import { Typography, Button, TextField, Avatar, Chip } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import "../ui/AuctionHistory.css";
import { Auction } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import EmptyIcon from "../../assets/notFound/empty.png";

import {
  ExclamationCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { convertToVietnameseDate } from "../../utils/convertDateVietnamese";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import AuctionDetailModal from "../modal/AuctionDetailModal";
import Loading from "../loading/Loading";
interface AuctionHistoryProps {
  auctions?: Auction[];
}

const AuctionHistory: React.FC<AuctionHistoryProps> = () => {
  const [selectedAuctionStatus, setSelectedAuctionStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const userId = useAppSelector((state) => state.auth.userId);
  const [highestBid, setHighestBid] = useState<any[]>([]);
  const buttonStyles = {
    contained: {
      backgroundColor: "black",
      color: "white",
      fontFamily: "REM",
      padding: "5px 15px",
      fontSize: "16px",
      textTransform: "uppercase",
      letterSpacing: "1px",
      boxShadow: "5px 5px 0 white",
    },
  };
  console.log("highestbid", highestBid);

  console.log("userid", userId);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctionsAndBids = async () => {
      try {
        setLoading(true);

        if (!userId) {
          console.error("User ID not found");
          return;
        }

        // Fetch deposits with auctions
        const response = await privateAxios.get(`deposits/user/auction`);
        console.log("Deposits response:", response);

        const depositsData = response.data;

        if (!Array.isArray(depositsData) || depositsData.length === 0) {
          console.error("No deposits data or unexpected format:", depositsData);
          return;
        }

        // Extract auctions from deposits
        const auctionsData = depositsData.map((deposit) => deposit.auction);

        if (!Array.isArray(auctionsData) || auctionsData.length === 0) {
          console.error("No auctions found in deposits:", auctionsData);
          return;
        }
        const filteredAuctions = auctionsData.filter(
          (auction) => auction.status !== "UPCOMING"
        );

        if (filteredAuctions.length === 0) {
          console.error("No auctions available that are not 'UPCOMING'");
          return;
        }

        setAuctions(filteredAuctions);
        // Fetch the highest bid for each auction
        const highestBids = await Promise.all(
          auctionsData.map(async (auction) => {
            try {
              const responseBid = await privateAxios.get(
                `/bids/highest-bid/${auction.id}`
              );
              return responseBid.data;
            } catch (error) {
              console.error(
                `Error fetching highest bid for auction ${auction.id}:`,
                error
              );
              return null; // Handle missing data gracefully
            }
          })
        );

        console.log("Highest bids for auctions:", highestBids);

        // Set the highest bids to state
        setHighestBid(highestBids);
      } catch (error) {
        console.error("Error fetching auctions or bids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionsAndBids();
  }, [userId]);

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
      case "CANCELED":
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
      case "UPCOMING":
        return "Sắp diễn ra";
      case "CANCELED":
        return "Bị hủy";
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
    return isWin ? "#D6FFD8" : "rgb(255 173 201)"; // Xanh lá cho win, đỏ cho lose
  };

  const renderAuctionContent = () => {
    // Ensure data is loaded before rendering
    if (loading) {
      return <Loading />;
    }

    // If there are no auctions after filtering, display a message
    const filteredAuctions =
      selectedAuctionStatus === "all"
        ? auctions
        : auctions.filter(
            (auction: Auction) => auction.status === selectedAuctionStatus
          );

    if (filteredAuctions.length === 0) {
      return (
        <div className="text-center text-gray-500 p-4">
          <img
            className="h-64 w-full object-contain"
            src={EmptyIcon}
            alt="No Announcements"
          />
          <p>Không có dữ liệu phù hợp</p>
        </div>
      );
    }

    // Map through the filtered auctions and render each auction
    return filteredAuctions.map((auction: Auction) => {
      const vietnameseDate = convertToVietnameseDate(auction?.paymentDeadline);
      const isWin =
        auction.status === "SUCCESSFUL" && auction.winner?.id === userId;

      // Cập nhật logic cho statusText
      const statusText = isWin
        ? "Đấu giá thành công"
        : auction.status === "SUCCESSFUL" ||
          (auction.status === "COMPLETED" && auction.winner?.id !== userId)
        ? "Đấu giá thất bại"
        : translateStatus(auction.status);

      // Cập nhật logic cho statusStyles
      const statusStyles = isWin
        ? getStatusChipStyles("SUCCESSFUL")
        : auction.status === "SUCCESSFUL" ||
          (auction.status === "COMPLETED" && auction.winner?.id !== userId)
        ? getStatusChipStyles("FAILED")
        : getStatusChipStyles(auction.status);

      // Cập nhật logic cho borderColor
      const borderColor =
        auction.status === "COMPLETED" && auction.winner?.id !== userId
          ? getStatusChipStyles("FAILED")
          : auction.status === "COMPLETED"
          ? "transparent"
          : auction.status === "ONGOING"
          ? getStatusChipStyles("ONGOING")
          : getAuctionResultColor(isWin);

      return (
        <div
          key={auction.id}
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            marginBottom: "20px",
            padding: "16px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            borderLeft: `8px solid ${borderColor}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "15px 30px",
              borderBottom: "1px solid #EAEAEA",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate(`/seller/shop/all/${auction.comics.sellerId.id}`)
              }
            >
              <Chip
                avatar={
                  <Avatar
                    src={auction.comics.sellerId?.avatar}
                    alt="Vendor Avatar"
                    style={{ width: "30px", height: "30px" }}
                  />
                }
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "16px",
                      paddingLeft: "5px",
                    }}
                  >
                    {auction.comics.sellerId?.name}
                    <StoreOutlinedIcon
                      style={{ fontSize: "24px", color: "#000" }}
                    />
                  </div>
                }
                style={{
                  fontFamily: "REM",
                  fontWeight: "500",
                  fontSize: "20px",
                  padding: "20px 5px",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid black",
                  boxShadow: "4px 4px #ccc",
                }}
              />
            </div>

            {/* Chip màu cho trạng thái đấu giá */}
            <div style={statusStyles}>
              <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                {statusText}
              </Typography>
            </div>
          </div>

          <div style={{ padding: "10px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "20px" }}>
                <div
                  style={{
                    height: "200px",
                    width: "150px",
                    border: "4px solid #C0C0C0",
                  }}
                >
                  <img
                    src={auction.comics.coverImage}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

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
                    </div>
                  )}

                  {highestBid &&
                  highestBid.some((bid) => bid.auction?.id === auction.id) ? (
                    <div>
                      <Typography
                        sx={{ fontSize: "20px", marginTop: "8px" }}
                        variant="body2"
                      >
                        {highestBid.find(
                          (bid) => bid.auction?.id === auction.id
                        )?.price === auction.currentPrice ? (
                          <div className="inline-block text-lg text-green-600 font-bold py-2 px-4 rounded-md bg-green-100 mb-2 max-w-full">
                            Bạn là người đặt giá cao nhất với{" "}
                            {highestBid
                              .find((bid) => bid.auction?.id === auction.id)
                              ?.price.toLocaleString("vi-VN")}{" "}
                            đ
                          </div>
                        ) : (
                          // Otherwise, show the normal bid message
                          <span>
                            Bạn đã đặt giá:{" "}
                            <span style={{ color: "#FF7F00" }}>
                              {highestBid
                                .find((bid) => bid.auction?.id === auction.id)
                                ?.price.toLocaleString("vi-VN")}{" "}
                              đ
                            </span>
                          </span>
                        )}
                      </Typography>
                    </div>
                  ) : (
                    // Fallback when there is no highest bid
                    <Typography
                      sx={{ fontSize: "20px", marginTop: "8px" }}
                      variant="body2"
                      className="inline-block text-lg text-orange-500 font-bold  rounded-md mb-2 max-w-full flex align-middle"
                    >
                      <ExclamationCircleOutlined className="mr-2" />
                      Bạn chưa ra giá
                    </Typography>
                  )}
                  {(auction.status === "SUCCESSFUL" ||
                    auction.status === "COMPLETED") && (
                    <div>
                      <>
                        <Typography
                          sx={{ fontSize: "20px", marginTop: "8px" }}
                          variant="body2"
                        >
                          Giá cuối cùng:{" "}
                          <span style={{ color: "blue" }}>
                            {auction.currentPrice?.toLocaleString("vi-VN")}đ
                          </span>
                        </Typography>
                      </>
                    </div>
                  )}
                  {auction?.winner?.id === userId &&
                  auction.status === "SUCCESSFUL" ? (
                    <Typography
                      sx={{
                        fontSize: "16px",
                        marginTop: "8px",
                        color: "grey",
                        display: "flex",
                        alignItems: "center",
                      }}
                      variant="body2"
                    >
                      <ReportGmailerrorredIcon
                        sx={{ marginRight: "8px", color: "orange" }}
                      />
                      <span style={{ color: "orange" }}>
                        {" "}
                        Vui lòng thanh toán trước {vietnameseDate} nếu không bạn
                        sẽ mất cọc
                      </span>
                    </Typography>
                  ) : auction?.winner?.id === userId &&
                    auction.status === "FAILED" ? (
                    <Typography
                      sx={{
                        fontSize: "16px",
                        marginTop: "8px",
                        color: "grey",
                        display: "flex",
                        alignItems: "center",
                      }}
                      variant="body2"
                    >
                      <ReportGmailerrorredIcon
                        sx={{ marginRight: "8px", color: "red" }}
                      />
                      <span style={{ color: "#FF0000" }}>
                        Bạn đã mất cọc do không thanh toán trước{" "}
                        {vietnameseDate}
                      </span>
                    </Typography>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between", // Align "TRỞ LẠI CUỘC ĐẤU GIÁ" to the left and other buttons to the right
              marginTop: "12px",
              padding: "15px 30px",
              borderTop: "1px solid #dbdbdb",
              gap: 8,
            }}
          >
            {/* Left-aligned button */}
            <Button
              variant="contained"
              sx={buttonStyles.contained}
              onClick={() => navigate(`/auctiondetail/${auction.id}`)}
            >
              TRỞ LẠI CUỘC ĐẤU GIÁ
            </Button>

            {/* Right-aligned buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={() => handleOpenModal(auction)}
                variant="contained"
                sx={buttonStyles.contained}
              >
                XEM CHI TIẾT ĐẤU GIÁ
              </Button>

              {auction.status === "SUCCESSFUL" &&
              auction.winner?.id === userId ? (
                <Button
                  onClick={() => handleBuy(auction, "currentPrice")}
                  variant="contained"
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    fontFamily: "REM",
                    padding: "5px 15px",
                    fontSize: "16px",
                    letterSpacing: "1px",
                    boxShadow: "5px 5px 0 white",
                  }}
                >
                  <ShoppingCartOutlined className="mr-2" />
                  THANH TOÁN
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      );
    });
  };

  const handleOpenModal = (auction: Auction) => {
    setSelectedAuction(auction);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAuction(null);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="hidden lg:flex status-auction-tabs">
        <span
          className={`status-auction-tab ${
            selectedAuctionStatus === "all" ? "active" : ""
          }`}
          onClick={() => setSelectedAuctionStatus("all")}
        >
          Tất cả
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
            selectedAuctionStatus === "COMPLETED" ? "active" : ""
          }`}
          onClick={() => setSelectedAuctionStatus("COMPLETED")}
        >
          Hoàn thành
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
      <div className="auction-history-content">
        {renderAuctionContent()}
        {selectedAuction && (
          <AuctionDetailModal
            open={isModalOpen}
            onClose={handleCloseModal}
            auction={selectedAuction}
          />
        )}
      </div>
    </div>
  );
};

export default AuctionHistory;
