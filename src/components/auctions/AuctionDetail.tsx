import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import "../ui/AuctionDetail.css";
import { Avatar, Button, Chip, Divider, Typography } from "@mui/material";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import ComicsDescription from "../comic/comicDetails/ComicsDescription";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import socket, { connectSocket } from "../../services/socket";
import {
  setAuctionData,
  setHighestBid,
} from "../../redux/features/auction/auctionSlice";
import CountdownFlipNumbers from "./CountDown";
import CountUp from "react-countup";
import Loading from "../loading/Loading";
import ConfettiExplosion from "react-confetti-explosion";
import { Modal, notification } from "antd";
import { auctionAnnouncement } from "../../redux/features/notification/announcementSlice";
import AuctionPublisher from "./AuctionPublisher";
import { Auction } from "../../common/base.interface";
import { AuctionResult } from "./AuctionResult";
import ModalDeposit from "../modal/ModalDeposit";
import { Popconfirm } from "antd";

interface Comic {
  id: string;
  title: string;
  coverImage: string;
  previewChapter: string[];
  sellerId: {
    id: string;
    name: string;
  };
  condition: string;
}

interface AuctionData {
  id: string;
  currentPrice: number;
  priceStep: number;
  status: string;
  winner: {
    id: string;
  } | null;
}

interface auctionAnnounce {
  id: string;
}
const ComicAuction = () => {
  const { id } = useParams<Record<string, string>>();
  const [comic, setComic] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const auctionData = useAppSelector((state: any) => state.auction.auctionData);
  const [previewChapter, setPreviewChapter] = useState<string[]>([]);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isBidDisabled, setIsBidDisabled] = useState(false);
  const userId = useAppSelector((state) => state.auth.userId);
  const highestBid = useAppSelector((state) => state.auction.highestBid);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [winner, setWinner] = useState<boolean | null>(null);
  const [isHighest, setIsHighest] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [hasDeposited, setHasDeposited] = useState(false);
  console.log("auctiondata", auctionData);
  const navigate = useNavigate();
  const auctionAnnounce = useAppSelector(
    (state) => state.annoucement.auctionAnnounce
  );
  const handleBidActionDisabled = (disabled: boolean) => {
    setIsBidDisabled(disabled);
  };
  const handleDepositSuccess = () => {
    setHasDeposited(true);
    notification.success({
      key: "success",
      message: "Thành công",
      description: "Cọc tiền thành công!",
      duration: 5,
    });
  };
  const handleBuy = (auctionData: Auction, price: any, type: string) => {
    if (!auctionData) return;
    sessionStorage.setItem(
      "selectedComics",
      JSON.stringify({
        [auctionData.comics?.sellerId?.id]: {
          sellerName: auctionData.comics?.sellerId?.name,
          comics: [
            {
              comic: auctionData.comics,
              currentPrice: price,
              auctionId: auctionData.id,
              quantity: 1,
              type,
            },
          ],
        },
      })
    );
    navigate("/checkout");
  };

  const handleModalClose = () => {
    privateAxios
      .post(`/announcements/${auctionAnnounce?.id}/read`)
      .then(() => {
        console.log("Announcement marked as read.");
        // fetchComicDetails();
      })
      .catch((error) => {
        console.error("Error marking announcement as read:", error);
      });
    console.log("winner", auctionData?.winner?.id);
    if (auctionAnnounce?.status === "SUCCESSFUL") {
      setWinner(true);
      console.log("123");
    } else {
      setWinner(false);
      console.log("456");
    }
    setIsModalVisible(false);
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkDepositStatus = async () => {
      try {
        const response = await privateAxios.get(
          `deposits/auction/user/${auctionData?.id}`
        );
        console.log("RESPONSE", response.data);

        if (response.data) {
          setHasDeposited(true); // Set true if deposit exists
        } else {
          setHasDeposited(false); // Revert to false if no deposit
        }
      } catch (error) {
        console.error("Error checking deposit status:", error);
        setHasDeposited(false); // Handle errors gracefully
      }
    };

    checkDepositStatus();
  }, [auctionData]);

  useEffect(() => {
    fetchUnreadAnnouncementForAuction();
  }, [auctionData]);

  useEffect(() => {
    if (highestBid?.user?.id === userId) {
      setIsHighest(true);
    } else {
      setIsHighest(false);
    }
  }, [highestBid, userId]);

  useEffect(() => {
    if (socket && socket.connected) {
      console.log("Socket connected, emitting joinRoom");
      socket.emit("joinRoom", userId);
    } else {
      connectSocket(); // Ensure the socket is connected
    }

    socket.on("notification", (data) => {
      dispatch(auctionAnnouncement(data));
    });
    socket.on("auctionUpdated", (data) => {
      dispatch(setAuctionData(data));
      dispatch(setHighestBid(data.bids[0].price));
    });
    // Clean up the listener on component unmount
    return () => {
      if (socket) {
        socket.off("notification");
        socket.off("auctionUpdated");
      }
    };
  }, [userId, socket, dispatch]);

  const fetchUnreadAnnouncementForAuction = async () => {
    try {
      const response = await privateAxios.get(
        `/announcements/auction/${auctionData?.id}/unread`
      );
      if (response.data !== "") {
        dispatch(auctionAnnouncement(response.data));
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

        const responseBid = await publicAxios.get(`/bids/auction/${id}`);
        dispatch(setHighestBid(responseBid.data[0]));
      } catch (error) {
        console.error("Error fetching comic details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComicDetails();
  }, [id, auctionAnnounce, dispatch]);
  useEffect(() => {
    if (auctionData?.status === "SUCCESSFUL") {
      if (auctionData.winner?.id === userId) {
        setWinner(true);
      } else {
        setWinner(false);
      }
    } else {
      setWinner(null);
    }
  }, [auctionData?.status, auctionData?.winner, userId]);

  useEffect(() => {
    if (userId) {
      setIsModalVisible(true);
    }
  }, [userId]);

  useEffect(() => {
    socket.on("bidUpdate", (data: any) => {
      console.log("123123", data.placeBid.auction);
      dispatch(setHighestBid(data.placeBid));
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

  const handleBidInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBidAmount(value);
    if (
      value &&
      parseFloat(value) >= auctionData.currentPrice + auctionData.priceStep
    ) {
      setError("");
    }
  };

  const handlePlaceBid = async () => {
    if (
      parseFloat(bidAmount) <
      auctionData?.currentPrice + auctionData?.priceStep
    ) {
      // Set error message if the bid is too low
      setError("Yêu cầu ra giá tối thiểu hoặc cao hơn.");
      return; // Prevent further execution if bid is too low
    }
    setError("");
    setBidAmount("");

    const bidPayload = {
      auctionId: auctionData.id,
      userId: userId,
      price: parseFloat(bidAmount),
    };

    socket.emit("placeBid", bidPayload);
  };

  const handleOpenDepositModal = () => {
    setIsDepositModalOpen(true);
  };

  const handleCloseDepositModal = () => {
    setIsDepositModalOpen(false);
  };

  return (
    <div className="auction-wrapper" style={{ position: "relative" }}>
      <AuctionResult isWinner={winner} />
      {auctionAnnounce && auctionAnnounce.auction.id === id && (
        <>
          {auctionAnnounce.status === "SUCCESSFUL" && (
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
            title={`${auctionAnnounce?.title}`}
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
                color:
                  auctionAnnounce.status === "SUCCESSFUL" ? "green" : "red",
                lineHeight: "1.5",
              }}
            >
              {auctionAnnounce?.message}{" "}
              {auctionAnnounce.status === "SUCCESSFUL" ? "🎊" : ""}
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
              {[comic?.coverImage, ...previewChapter].map((img, index) => (
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
                  }
                  end={auctionData.currentPrice}
                  duration={1}
                  separator="."
                  decimals={0}
                  suffix="₫"
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
            {auctionData.status === "ONGOING" && hasDeposited && (
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
            )}
            {!hasDeposited ? (
              <div
                style={{
                  paddingTop: "15px",
                  paddingBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <p
                  style={{
                    fontSize: "17px",
                    fontFamily: "REM",
                    fontWeight: "400",
                  }}
                >
                  Số tiền cần cọc:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {typeof auctionData?.depositAmount === "number" &&
                      auctionData?.depositAmount.toLocaleString("vi-VN")}
                    đ
                  </span>
                </p>
                <Chip
                  label="Đặt cọc tại đây"
                  onClick={handleOpenDepositModal}
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    fontFamily: "REM",
                    border: "1px solid black",
                    boxShadow: "2px 2px",
                  }}
                />
              </div>
            ) : isHighest ? (
              <div className="highest-bid-message REM">
                Bạn là người có giá cao nhất!
              </div>
            ) : (
              <div className="bid-row">
                <input
                  type="text"
                  placeholder="đ"
                  className="bid-input"
                  value={bidAmount}
                  onChange={handleBidInputChange}
                  disabled={isBidDisabled}
                />
                <Popconfirm
                  title={
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
                      Bạn có chắc chắn muốn ra giá{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {parseFloat(bidAmount).toLocaleString("vi-VN")}₫
                      </span>{" "}
                      không?
                    </Typography>
                  }
                  onConfirm={handlePlaceBid}
                  onCancel={() => console.log("Bid canceled")}
                  okText="Xác nhận"
                  cancelText="Hủy"
                  overlayStyle={{
                    width: "450px",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                  okButtonProps={{
                    style: {
                      backgroundColor: "#000",
                      color: "#fff",
                      fontSize: "18px",
                      fontWeight: "bold",
                      padding: "15px 30px",
                      borderRadius: "10px",
                      marginRight: "15px",
                    },
                  }}
                  cancelButtonProps={{
                    style: {
                      backgroundColor: "#fff",
                      color: "#000",
                      fontSize: "18px",
                      fontWeight: "bold",
                      padding: "15px 30px",
                      border: "2px solid #000",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    className="bid-button"
                    sx={{
                      width: "250px",
                      height: "60px",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                    disabled={isBidDisabled || !bidAmount || error !== ""}
                  >
                    RA GIÁ
                  </Button>
                </Popconfirm>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
            <div className="flex justify-between my-4 ">
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {auctionData.status === "ONGOING" && hasDeposited ? (
                  <Button
                    variant="contained"
                    style={{
                      color: "#fff",
                      backgroundColor: "#000",
                      fontWeight: "500",
                      fontSize: "18px",
                      fontFamily: "REM",
                    }}
                    onClick={() =>
                      handleBuy(auctionData, auctionData.maxPrice, "maxPrice")
                    }
                  >
                    Mua ngay với {auctionData.maxPrice.toLocaleString("vi-VN")}₫
                  </Button>
                ) : auctionData.winner?.id === userId &&
                  auctionData.status === "SUCCESSFUL" ? (
                  <Button
                    variant="contained"
                    style={{
                      color: "#fff",
                      backgroundColor: "#000",
                      fontWeight: "500",
                      fontSize: "18px",
                      fontFamily: "REM",
                    }}
                    onClick={() =>
                      handleBuy(
                        auctionData,
                        auctionData?.currentPrice,
                        "currentPrice"
                      )
                    }
                  >
                    Thanh toán ngay
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <AuctionPublisher comic={comic} />
        </Grid>
        <div className="mb-10 w-full">
          <ComicsDescription currentComics={comic} fontSize="1rem" />
        </div>
      </Grid>
      <ModalDeposit
        open={isDepositModalOpen}
        onClose={handleCloseDepositModal}
        depositAmount={auctionData?.depositAmount}
        onDepositSuccess={handleDepositSuccess}
        auctionId={auctionData?.id}
      />
    </div>
  );
};
export default ComicAuction;
