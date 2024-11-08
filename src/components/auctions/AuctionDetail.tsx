import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import "../ui/AuctionDetail.css";
import { Button, Typography } from "@mui/material";
import Countdown from "react-countdown";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import { useParams } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";
import ComicsDescription from "../comic/comicDetails/ComicsDescription";

// Countdown renderer function
const renderer = ({
  days,
  hours,
  minutes,
  seconds,
}: Record<string, number>) => (
  <div className="countdown">
    <div className="time-box">
      <span className="time">{days.toString().padStart(2, "0")}</span>
      <span className="label1">Ngày</span>
    </div>
    <div className="time-box">
      <span className="time">{hours.toString().padStart(2, "0")}</span>
      <span className="label1">Giờ</span>
    </div>
    <div className="time-box">
      <span className="time">{minutes.toString().padStart(2, "0")}</span>
      <span className="label1">Phút</span>
    </div>
    <div className="time-box">
      <span className="time">{seconds.toString().padStart(2, "0")}</span>
      <span className="label1">Giây</span>
    </div>
  </div>
);

const ComicAuction = () => {
  const { id } = useParams<Record<string, string>>(); // Get ID from URL
  const [comic, setComic] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [auctionData, setAuctionData] = useState<any>(null);
  const [previewChapter, setPreviewChapter] = useState<string[]>([]);
  const [bidAmount, setBidAmount] = useState<string>("");

  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const response = await publicAxios.get(`/auction/${id}`);
        console.log(response.data);
        const comicData = response.data.comics;
        setUsers(comicData.sellerId); // Assuming sellerId contains user details
        setComic(comicData);
        setMainImage(comicData.coverImage);
        setPreviewChapter(comicData.previewChapter || []);
        setAuctionData(response.data);
      } catch (error) {
        console.error("Error fetching comic details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComicDetails();
  }, [id]);

  if (loading) return <p>Loading comic details...</p>;
  if (!comic) return <p>Comic not found.</p>;

  const handleImageClick = (imageSrc: string) => {
    setMainImage(imageSrc);
  };

  const handleBidInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value);
  };

  return (
    <div className="auction-wrapper">
      <div className="title-container">
        <Typography
          style={{
            paddingLeft: "50px",
            fontSize: "23px",
            fontWeight: "bold",
            flex: "3",
          }}
        >
          {comic.title}
        </Typography>
        <div className="condition-tag">
          {comic.condition === "SEALED" ? "Nguyên Seal" : "Đã qua sử dụng"}
        </div>
      </div>

      <Grid container spacing={2} className="auction-container">
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
            <p>KẾT THÚC TRONG:</p>
            <Countdown
              date={new Date(comic.endDate).getTime()}
              renderer={renderer}
            />
            <div className="current-price">
              <div className="current-price1">
                <p>Giá hiện tại</p>
                <h2>{auctionData.reservePrice.toLocaleString("vi-VN")}₫</h2>
              </div>
              <div className="current-price2">
                <p>Lượt đấu giá</p>
                <h2>10</h2>
              </div>
            </div>
          </div>

          <div className="shop-info">
            <p style={{ display: "flex", alignItems: "center" }}>
              <img
                src={
                  users?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxfSUXtB9oG6_7ZgV3gFLrqGdkv61wqYkVVw&s"
                }
                alt=""
                className="w-[1.8em] h-[1.8em] rounded-full mr-2 "
              />
              <p className="font-semibold mr-2">{users?.name}</p>
              <StoreOutlinedIcon />
            </p>
            <p style={{ fontSize: "18px", paddingTop: "10px" }}>
              Giá đấu tối thiểu tiếp theo:{" "}
              {auctionData &&
                (
                  auctionData.reservePrice + auctionData.priceStep
                ).toLocaleString("vi-VN")}
              ₫
            </p>
            <div className="bid-row">
              <input
                type="text"
                placeholder="đ"
                className="bid-input"
                value={bidAmount}
                onChange={handleBidInputChange}
              />
              <Button variant="contained" className="bid-button">
                RA GIÁ
              </Button>
            </div>
            <Button
              variant="contained"
              style={{
                color: "#fff",
                backgroundColor: "#000",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Mua ngay với giá {auctionData.maxPrice.toLocaleString("vi-VN")}₫
            </Button>
          </div>

          <div className="publisher">
            <div className="publisher-detail">
              <Typography style={{ fontSize: "16px", fontWeight: "bold" }}>
                Tác giả:{" "}
                <span style={{ fontWeight: "500" }}>{comic.author}</span>
              </Typography>
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
