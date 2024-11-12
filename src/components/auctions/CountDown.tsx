import React, { useState, useEffect } from "react";
import FlipNumbers from "react-flip-numbers";
import "../../components/ui/CountDown.css";
import Grid from "@mui/material/Grid2";
import { publicAxios } from "../../middleware/axiosInstance";
import Loading from "../loading/Loading";

interface CountdownFlipNumbersProps {
  endTime: string;
  auctionId: string; // Pass auctionId for the API call
  onBidActionDisabled: (disabled: boolean) => void; // Optional prop to notify parent component
}

const CountdownFlipNumbers: React.FC<CountdownFlipNumbersProps> = ({
  endTime,
  auctionId,
  onBidActionDisabled,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [auctionEnded, setAuctionEnded] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const formatEndTime = (endTime: string) => {
    const date = new Date(endTime);
    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      weekday: "short",
      year: "numeric",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const declareWinner = async () => {
    try {
      const response = await publicAxios.get(
        `/auction/declare-winner/${auctionId}`
      );
      console.log("Winner Declared:", response.data);
    } catch (error) {
      console.error("Error declaring winner:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    // Ensure endTime is in valid timestamp format (milliseconds)
    const endTimestamp = new Date(endTime).getTime();

    const updateTimeLeft = () => {
      const now = Date.now();
      const timeRemaining = endTimestamp - now; // Calculate remaining time

      if (timeRemaining <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setAuctionEnded(true); // Đấu giá đã kết thúc
        onBidActionDisabled(true);
        declareWinner(); // Call declareWinner when countdown ends
        onBidActionDisabled?.(true); // Notify parent component to disable bidding
        return;
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Set loading to false once the countdown setup starts

    const timer = setInterval(updateTimeLeft, 1000);
    setLoading(false);
    return () => clearInterval(timer); // Cleanup the interval on unmount
  }, [endTime, auctionId]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : auctionEnded ? (
        <p
          style={{
            fontFamily: "REM",
            fontSize: "20px",
            paddingBottom: "15px",
            color: "red",
          }}
        >
          Phiên đấu giá đã kết thúc
        </p>
      ) : (
        <p
          style={{
            fontFamily: "REM",
            fontSize: "20px",
            paddingBottom: "15px",
          }}
        >
          KẾT THÚC VÀO: {formatEndTime(endTime)}
        </p>
      )}
      <Grid className="countdown" sx={{ gap: "15px" }}>
        {/* The rest of your countdown logic */}
        <div className="time-box">
          <div
            className="flip-wrapper"
            style={{
              borderRadius: "5px",
              overflow: "hidden",
              width: "54px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <FlipNumbers
              height={45}
              width={16}
              play
              color="#000"
              background="#fff"
              numbers={timeLeft.days.toString().padStart(2, "0")}
              numberStyle={{
                fontSize: "22px",
                fontFamily: "REM",
                fontWeight: "500",
              }}
            />
          </div>
          <span
            className="label1"
            style={{ fontFamily: "REM", fontSize: "14px" }}
          >
            Ngày
          </span>
        </div>

        <div className="time-box">
          <div
            className="flip-wrapper"
            style={{
              borderRadius: "5px",
              overflow: "hidden",
              width: "54px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <FlipNumbers
              height={45}
              width={16}
              play
              color="#000"
              background="#fff"
              numbers={timeLeft.hours.toString().padStart(2, "0")}
              numberStyle={{
                fontSize: "22px",
                fontFamily: "REM",
                fontWeight: "500",
              }}
            />
          </div>
          <span
            className="label1"
            style={{ fontFamily: "REM", fontSize: "14px" }}
          >
            Giờ
          </span>
        </div>
        <div className="time-box">
          <div
            className="flip-wrapper"
            style={{
              borderRadius: "5px",
              overflow: "hidden",
              width: "54px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <FlipNumbers
              height={45}
              width={16}
              play
              color="#000"
              background="#fff"
              numbers={timeLeft.minutes.toString().padStart(2, "0")}
              numberStyle={{
                fontSize: "22px",
                fontFamily: "REM",
                fontWeight: "500",
              }}
            />
          </div>
          <span
            className="label1"
            style={{ fontFamily: "REM", fontSize: "14px" }}
          >
            Phút
          </span>
        </div>
        <div className="time-box">
          <div
            className="flip-wrapper"
            style={{
              borderRadius: "5px",
              overflow: "hidden",
              width: "54px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <FlipNumbers
              height={45}
              width={16}
              play
              color="#000"
              background="#fff"
              numbers={timeLeft.seconds.toString().padStart(2, "0")}
              numberStyle={{
                fontSize: "22px",
                fontFamily: "REM",
                fontWeight: "500",
              }}
            />
          </div>
          <span
            className="label1"
            style={{ fontFamily: "REM", fontSize: "14px" }}
          >
            Giây
          </span>
        </div>
      </Grid>
    </div>
  );
};

export default CountdownFlipNumbers;
