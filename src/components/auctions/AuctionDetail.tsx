import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import "../ui/AuctionDetail.css";
import { Avatar, Button, Chip, Divider, Typography } from "@mui/material";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import { useParams } from "react-router-dom";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import ComicsDescription from "../comic/comicDetails/ComicsDescription";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import socket, { connectSocket } from "../../services/socket";
import { setAuctionData } from "../../redux/features/auction/auctionSlice";
import CountdownFlipNumbers from "./CountDown";
import CountUp from "react-countup";
import Loading from "../loading/Loading";
import ConfettiExplosion from "react-confetti-explosion";
import { Modal } from "antd";
import { io } from "socket.io-client";
import { auctionAnnoucement } from "../../redux/features/notification/announcementSlice";
import AuctionPublisher from "./AuctionPublisher";

const ComicAuction = () => {
  const { id } = useParams<Record<string, string>>(); // Get ID from URL
  const [comic, setComic] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const auctionData = useAppSelector((state: any) => state.auction.auctionData);
  const [previewChapter, setPreviewChapter] = useState<string[]>([]);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [isBidDisabled, setIsBidDisabled] = useState(false);
  const userId = useAppSelector((state) => state.auth.userId);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWinner, setIsWinner] = React.useState(false);
  React.useEffect(() => {
    const mockAuctionResult = Math.random() > 0.5; // Randomly simulate win or lose
    setIsWinner(mockAuctionResult);
  }, []);
  const auctionAnnouce = useAppSelector(
    (state) => state.annoucement.auctionAnnounce
  );
  const handleBidActionDisabled = (disabled: boolean) => {
    setIsBidDisabled(disabled);
  };

  const handleModalClose = () => {
    privateAxios
      .post(`/announcements/${auctionAnnouce?.id}/read`)
      .then(() => {
        console.log("Announcement marked as read.");
      })
      .catch((error) => {
        console.error("Error marking announcement as read:", error);
      });

    setIsModalVisible(false);
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchUnreadAnnouncementForAuction();
  }, [auctionData]);

  useEffect(() => {
    if (socket && socket.connected) {
      console.log("Socket connected, emitting joinRoom");
      socket.emit("joinRoom", userId);
    } else {
      connectSocket(); // Ensure the socket is connected
    }

    socket.on("notification", (data) => {
      dispatch(auctionAnnoucement(data));
    });
    socket.io.on("reconnect", () => {
      console.log("Reconnected to the server");
    });
    // Clean up the listener on component unmount
    return () => {
      if (socket) {
        socket.off("notification");
      }
    };
  }, [userId, socket]);

  const fetchUnreadAnnouncementForAuction = async () => {
    try {
      const response = await privateAxios.get(
        `/announcements/auction/${auctionData.id}/unread`
      );
      if (response.data) {
        dispatch(auctionAnnoucement(response.data));
      }
    } catch (error) {
      console.error("Failed to fetch unread announcement:", error);
    }
  };
  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const response = await publicAxios.get(`/auction/${id}`);
        const comicData = response.data.comics;
        setUsers(comicData.sellerId);
        setComic(comicData);
        setMainImage(comicData.coverImage);
        setPreviewChapter(comicData.previewChapter || []);
        dispatch(setAuctionData(response.data));
      } catch (error) {
        console.error("Error fetching comic details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComicDetails();
  }, [id]);

  useEffect(() => {
    setLoading(true);
    if (auctionData?.endTime) {
      const endTimestamp = new Date(auctionData.endTime).getTime();
      const now = Date.now();

      if (now >= endTimestamp) {
        setAuctionEnded(true);
        setIsBidDisabled(true);

        if (userId) {
          setIsModalVisible(true);
        }
      }
    }
    setLoading(false);
  }, [auctionData?.endTime, auctionData?.winnerId]);

  useEffect(() => {
    socket.on("bidUpdate", (data: any) => {
      console.log("123123", data.placeBid.auction);

      dispatch(setAuctionData(data.placeBid.auction));
    });

    return () => {
      socket.off("bidUpdate");
    };
  }, [auctionData?.id, dispatch]);
  if (loading) return <Loading />;
  if (!comic) return <p>Comic not found.</p>;

  const handleImageClick = (imageSrc: string) => {
    setMainImage(imageSrc);
  };

  const handleBidInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value);
  };

  const handlePlaceBid = async () => {
    console.log("123");

    const bidPayload = {
      auctionId: auctionData.id,
      userId: userId,
      price: parseFloat(bidAmount),
    };

    socket.emit("placeBid", bidPayload);
  };
  const AuctionResult = ({ isWinner }: { isWinner: boolean }) => {
    return (
      <div
        className="auction-result"
        style={{
          backgroundColor: isWinner ? "#d4edda" : "#f8d7da",
          color: isWinner ? "#155724" : "#721c24",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            margin: 0,
            lineHeight: "50px",
            textAlign: "center",
            transform: "translateX(100%)",
            animation: "scroll-left 10s linear infinite",
            fontSize: "18px",
            fontWeight: "500",
            fontFamily: "REM",
          }}
        >
          {isWinner
            ? "🎉 Bạn đã đấu giá thành công!"
            : "😞 Bạn đã đấu giá thất bại."}
        </div>
      </div>
    );
  };

  return (
    <div className="auction-wrapper" style={{ position: "relative" }}>
      <AuctionResult isWinner={isWinner} />
      {auctionAnnouce && (
        <>
          {auctionAnnouce.status === "SUCCESSFUL" && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <ConfettiExplosion
                force={0.8}
                duration={5000}
                particleCount={400}
                width={1600}
              />
            </div>
          )}
          <Modal
            title={`${auctionAnnouce?.title}`}
            open={isModalVisible}
            onOk={handleModalClose}
            onCancel={handleModalClose}
            centered
            cancelButtonProps={{ style: { display: "none" } }}
            width={600}
            styles={{
              body: {
                paddingTop: "10px",
                paddingBottom: "20px",
                fontSize: "18px",
              },
            }}
            okButtonProps={{
              style: {
                color: "white",
                backgroundColor: "black",
                fontWeight: "bold",
                fontSize: "16px",
              },
            }}
          >
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                textAlign: "center",
                color: auctionAnnouce.status === "SUCCESSFUL" ? "green" : "red",
                lineHeight: "1.5",
              }}
            >
              {auctionAnnouce?.message}{" "}
              {auctionAnnouce.status === "SUCCESSFUL" ? "🎊" : ""}
            </Typography>
          </Modal>
        </>
      )}
      <div
        className="title-container"
        style={{ borderBottom: "1px solid #ccc" }}
      >
        <Typography
          style={{
            paddingLeft: "50px",
            fontSize: "23px",
            fontWeight: "bold",
            flex: "3",
            fontFamily: "REM",
            textShadow: "2px 2px #ccc",
          }}
        >
          {comic.title}
        </Typography>
        <div
          className="condition-tag"
          style={{
            fontFamily: "REM",
            textShadow: "3px 3px #000",
            fontSize: "23px",
          }}
        >
          {comic.condition === "SEALED" ? "Nguyên Seal" : "Đã qua sử dụng"}
        </div>
      </div>

      <Grid container spacing={3} className="auction-container">
        <Grid size={7} className="comic-info">
          <div className="comic-images">
            <div style={{ width: "400px", height: "600px" }}>
              <img
                className="main-comic-image"
                src={mainImage}
                alt="Main Comic Cover"
              />
            </div>

            <div className="small-images">
              {[comic.coverImage, ...previewChapter].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="small-comic-image"
                  onClick={() => handleImageClick(img)}
                />
              ))}
            </div>
          </div>
        </Grid>

        <Grid size={5} className="auction-info">
          <div className="timer">
            <CountdownFlipNumbers
              auction={auctionData}
              onBidActionDisabled={handleBidActionDisabled}
            />
            <div
              className="current-price"
              style={{
                display: "flex",
                justifyContent: "space-around",
                padding: "10px 15px",
              }}
            >
              <div
                className="current-price1"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <p
                  style={{
                    fontFamily: "REM",
                    paddingBottom: "0",
                    fontSize: "18px",
                  }}
                >
                  Giá hiện tại:
                </p>
                <CountUp
                  style={{
                    fontFamily: "REM",
                    fontSize: "28px",
                    fontWeight: "bold",
                    textShadow: "4px 4px #000",
                  }}
                  start={
                    auctionData.currentPrice - auctionData.currentPrice / 2
                  } // Start from the previous price
                  end={auctionData.currentPrice} // The current price to animate to
                  duration={1} // Duration of the animation in seconds
                  separator="." // Optional: Add thousands separator
                  decimals={0} // Optional: Set the number of decimals
                  suffix="₫" // Optional: Add a suffix (e.g., "₫")
                />
              </div>
              <Divider
                sx={{ border: "1px solid grey" }}
                orientation="vertical"
                flexItem
              />
              <div className="current-price2">
                <p style={{ fontFamily: "REM", fontSize: "18px" }}>Bước Giá</p>
                <h3
                  style={{
                    fontFamily: "REM",
                    fontSize: "28px",
                    fontWeight: "bold",
                    textShadow: "4px 4px #000",
                  }}
                >
                  {auctionData.priceStep.toLocaleString("vi-VN")}đ
                </h3>
              </div>
            </div>
          </div>

          <div className="shop-info">
            <Chip
              avatar={
                <Avatar
                  src={users?.avatar}
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
                  {users?.name}
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

            <p
              style={{
                fontSize: "17px",
                paddingTop: "10px",
                fontFamily: "REM",
                fontWeight: "400",
              }}
            >
              Giá đấu tối thiểu tiếp theo:{" "}
              {auctionData && (
                <span style={{ fontWeight: "bold" }}>
                  {(
                    auctionData.currentPrice + auctionData.priceStep
                  ).toLocaleString("vi-VN")}
                  đ
                </span>
              )}
            </p>

            <div className="bid-row">
              <input
                type="text"
                placeholder="đ"
                className="bid-input"
                value={bidAmount}
                onChange={handleBidInputChange}
                disabled={isBidDisabled}
              />
              <Button
                variant="contained"
                className="bid-button"
                onClick={handlePlaceBid}
                sx={{ fontFamily: "REM" }}
                disabled={isBidDisabled}
              >
                RA GIÁ
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "25px",
              }}
            >
              <Button
                variant="contained"
                style={{
                  color: "#fff",
                  backgroundColor: "#000",
                  fontWeight: "500",
                  fontSize: "18px",
                  fontFamily: "REM",
                }}
              >
                Mua ngay với giá {auctionData.maxPrice.toLocaleString("vi-VN")}₫
              </Button>
            </div>
          </div>
          <AuctionPublisher comic={comic} />
        </Grid>
        <div className="mb-10 w-full">
          <ComicsDescription currentComics={comic} fontSize="1rem" />
        </div>
      </Grid>
    </div>
  );
};
export default ComicAuction;
