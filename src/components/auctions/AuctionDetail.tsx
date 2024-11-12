import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import "../ui/AuctionDetail.css";
import { Avatar, Button, Chip, Divider, Typography } from "@mui/material";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import { useParams } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";
import ComicsDescription from "../comic/comicDetails/ComicsDescription";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import socket from "../../services/socket";
import { setAuctionData } from "../../redux/features/auction/auctionSlice";
import CountdownFlipNumbers from "./CountDown";
import CountUp from "react-countup";
import Loading from "../loading/Loading";

// Countdown renderer function

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

  const handleBidActionDisabled = (disabled: boolean) => {
    setIsBidDisabled(disabled);
  };
  useEffect(() => {
    setLoading(true)
    if (auctionData.endTime) {
      const endTimestamp = new Date(auctionData.endTime).getTime();
      const now = Date.now();

      if (now >= endTimestamp) {
        setAuctionEnded(true); // Đấu giá đã kết thúc
        setIsBidDisabled(true); // Vô hiệu hóa hành động đấu giá
      }
    }
    setLoading(false)
  }, [auctionData.endTime]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("Updated auctionData:", auctionData);
  }, [auctionData]); // This will log auctionData every time it is updated

  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const response = await publicAxios.get(`/auction/${id}`);
        console.log(":", response.data);
        const comicData = response.data.comics;
        setUsers(comicData.sellerId); // Assuming sellerId contains user details
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
    socket.on("bidUpdate", (data: any) => {
      // Update auction data with the new bid
      console.log("123123", data.placeBid.auction);

      dispatch(setAuctionData(data.placeBid.auction)); // Dispatch to Redux
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("bidUpdate");
    };
  }, [auctionData?.id, dispatch]);
  if (loading) return <Loading/>;
  if (!comic) return <p>Comic not found.</p>;

  const handleImageClick = (imageSrc: string) => {
    setMainImage(imageSrc);
  };

  const handleBidInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value); // Only update the bidAmount state
  };

  const handlePlaceBid = async () => {
    console.log("123");
    // Create bid payload
    const bidPayload = {
      auctionId: auctionData.id,
      userId: users.id,
      price: parseFloat(bidAmount),
    };

    // Emit bid data via socket
    socket.emit("placeBid", bidPayload);

    try {
      // If the bid is successful, update the state and make the API request
      // dispatch(placeBid({ current_bid: bidPayload.price }));
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  return (
    <div className="auction-wrapper">
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
              onBidActionDisabled={handleBidActionDisabled}
              auctionId={auctionData.id}
              endTime={auctionData.endTime}
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
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
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
              {/* <Divider sx={{ border: '1px solid grey' }} orientation="vertical" flexItem />
              <div className="current-price2" >
                <p style={{ fontFamily: "REM", fontSize: '18px' }}>Bước Giá</p>
                <h3 style={{ fontFamily: "REM", fontSize: '28px', paddingTop: '15px' }}>{(auctionData.priceStep).toLocaleString("vi-VN")}đ</h3>
              </div> */}
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

          <div className="publisher">
            {/* <div className="publisher-detail">
              <Typography style={{ fontSize: "16px", fontWeight: "bold", fontFamily: "REM" }}>
                Tác giả:{" "}
                <span style={{ fontWeight: "300" }}>{comic.author}</span>
              </Typography>
            </div> */}
            <p
              style={{
                fontSize: "17px",
                paddingTop: "10px",
                fontFamily: "REM",
                fontWeight: "400",
              }}
            >
              Tác Giả:{" "}
              <span style={{ fontWeight: "bold" }}>{comic.author}</span>
            </p>
            {/* <div className="publisher-detail">
              <Typography style={{ fontSize: "16px", fontWeight: "bold", fontFamily: "REM", paddingTop: '10px' }}>
                Phiên Bản:{" "}
                <span style={{ fontWeight: "300" }}>{comic.edition === 'REGULAR' ? 'Bản thường' : 'Bản đặc biệt'}</span>
              </Typography>
            </div> */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
              <p
                style={{
                  fontSize: "17px",
                  fontFamily: "REM",
                  fontWeight: "400",
                  marginRight: "10px",
                }}
              >
                Phiên Bản:
              </p>
              <Chip
                label={
                  comic.edition === "REGULAR" ? "Bản thường" : "Bản đặc biệt"
                }
                style={{
                  fontFamily: "REM",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "18px 10px",
                  backgroundColor:
                    comic.edition === "REGULAR" ? "#fff" : "#000",
                  color: comic.edition === "REGULAR" ? "#000" : "#fff",
                  border:
                    comic.edition === "REGULAR" ? "1px solid #000" : "none",
                  borderRadius: "20px",
                }}
              />
            </div>
          </div>
        </Grid>

        <div className="mb-10 w-full">
          <ComicsDescription currentComics={comic} fontSize="1rem" />
        </div>
      </Grid>
    </div>
  );
};

export default ComicAuction;
