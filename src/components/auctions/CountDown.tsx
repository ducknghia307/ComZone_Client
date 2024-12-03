import React, { useState, useEffect } from "react";
import FlipNumbers from "react-flip-numbers";
import "../../components/ui/CountDown.css";
import Grid from "@mui/material/Grid2";
import { publicAxios } from "../../middleware/axiosInstance";
import Loading from "../loading/Loading";
import { useAppSelector } from "../../redux/hooks";

interface CountdownFlipNumbersProps {
  auction: { id: string; status: string; endTime: string };
  onBidActionDisabled: (disabled: boolean) => void; // Optional prop to notify parent component
  onAuctionEnd: (ended: boolean) => void;
}

const CountdownFlipNumbers: React.FC<CountdownFlipNumbersProps> = ({
  auction,
  onBidActionDisabled,
  onAuctionEnd,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const auctionData = useAppSelector((state: any) => state.auction.auctionData);
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

  useEffect(() => {
    const endTimestamp = new Date(auctionData.endTime).getTime();

    // Function to update time left
    const updateTimeLeft = () => {
      const now = Date.now();
      const timeRemaining = endTimestamp - now;

      const days = Math.max(
        0,
        Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
      );
      const hours = Math.max(
        0,
        Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      );
      const minutes = Math.max(
        0,
        Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
      );
      const seconds = Math.max(
        0,
        Math.floor((timeRemaining % (1000 * 60)) / 1000)
      );

      setTimeLeft({ days, hours, minutes, seconds });

      // Handle auction end
      if (timeRemaining <= 0) {
        onAuctionEnd(true);
        setAuctionEnded(true);
        onBidActionDisabled?.(true);
      }
    };

    // Start the countdown using setInterval
    const intervalId = setInterval(updateTimeLeft, 1000);
    setLoading(false);

    // Cleanup the interval when the component unmounts or auctionData.endTime changes
    return () => {
      clearInterval(intervalId);
    };
  }, [auctionData.endTime]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : auctionData.status === "UPCOMING" ? ( // Auction is not active yet
        <p
          style={{
            fontFamily: "REM",
            fontSize: "20px",
            paddingBottom: "15px",
          }}
        >
          Phiên đấu giá sẽ bắt đầu {formatEndTime(auctionData.startTime)}
        </p>
      ) : (
        <>
          {auctionEnded && (
            <p
              style={{
                fontFamily: "REM",
                fontSize: "20px",
                paddingBottom: "10px",
                color: "red",
              }}
            >
              Phiên đấu giá đã kết thúc vào {formatEndTime(auctionData.endTime)}
            </p>
          )}
          <p
            style={{
              fontFamily: "REM",
              fontSize: "20px",
              paddingBottom: "15px",
            }}
          >
            {!auctionEnded &&
              `KẾT THÚC VÀO: ${formatEndTime(auctionData.endTime)}`}
          </p>
          <Grid className="countdown" sx={{ gap: "15px" }}>
            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div key={unit} className="time-box">
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
                    numbers={timeLeft[unit as keyof typeof timeLeft]
                      .toString()
                      .padStart(2, "0")}
                    numberStyle={{
                      fontSize: "22px",
                      fontFamily: "REM",
                      fontWeight: "500",
                    }}
                  />
                </div>
                <span className="label1">
                  {unit === "days"
                    ? "Ngày"
                    : unit === "hours"
                    ? "Giờ"
                    : unit === "minutes"
                    ? "Phút"
                    : "Giây"}
                </span>
              </div>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default CountdownFlipNumbers;
