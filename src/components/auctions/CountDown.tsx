import React, { useState, useEffect } from "react";
import FlipNumbers from "react-flip-numbers";
import "../../components/ui/CountDown.css";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { publicAxios } from "../../middleware/axiosInstance";

interface CountdownFlipNumbersProps {
  endTime: string | Date;
  auctionId: string; // Pass auctionId for the API call
}

const CountdownFlipNumbers: React.FC<CountdownFlipNumbersProps> = ({
  endTime,
  auctionId,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
    // Ensure endTime is in valid timestamp format (milliseconds)
    const endTimestamp = new Date(endTime).getTime();

    const updateTimeLeft = () => {
      const now = Date.now();
      const timeRemaining = endTimestamp - now; // Calculate remaining time

      if (timeRemaining <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        declareWinner(); // Call declareWinner when countdown ends
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

    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer); // Cleanup the interval on unmount
  }, [endTime, auctionId]); // auctionId is added as a dependency to ensure the latest auctionId is used

  return (
    <Grid className="countdown">
      <div className="time-box">
        <div
          className="flip-wrapper"
          style={{ borderRadius: "5px", overflow: "hidden" }}
        >
          <FlipNumbers
            height={70}
            width={40}
            play
            color="#000"
            background="#fff"
            numbers={timeLeft.days.toString().padStart(2, "0")}
            numberStyle={{ fontSize: "50px" }} // Adjust font size here
          />
        </div>
        <span className="label1">Ngày</span>
      </div>
      <div className="time-box">
        <div
          className="flip-wrapper"
          style={{ borderRadius: "5px", overflow: "hidden" }}
        >
          <FlipNumbers
            height={70}
            width={40}
            play
            color="#000"
            background="#fff"
            numbers={timeLeft.hours.toString().padStart(2, "0")}
            numberStyle={{ fontSize: "50px" }}
          />
        </div>
        <span className="label1">Giờ</span>
      </div>
      <div className="time-box">
        <div
          className="flip-wrapper"
          style={{ borderRadius: "5px", overflow: "hidden" }}
        >
          <FlipNumbers
            height={70}
            width={40}
            play
            color="#000"
            background="#fff"
            numbers={timeLeft.minutes.toString().padStart(2, "0")}
            numberStyle={{ fontSize: "50px" }}
          />
        </div>
        <span className="label1">Phút</span>
      </div>
      <div className="time-box">
        <div
          className="flip-wrapper"
          style={{ borderRadius: "5px", overflow: "hidden" }}
        >
          <FlipNumbers
            height={70}
            width={40}
            play
            color="#000"
            background="#fff"
            numbers={timeLeft.seconds.toString().padStart(2, "0")}
            numberStyle={{ fontSize: "50px" }}
          />
        </div>
        <span className="label1">Giây</span>
      </div>
    </Grid>
  );
};

export default CountdownFlipNumbers;
