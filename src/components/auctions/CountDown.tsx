import React, { useState, useEffect } from "react";
import FlipNumbers from "react-flip-numbers";
import "../../components/ui/CountDown.css";
import Grid from "@mui/material/Grid2";
interface CountdownFlipNumbersProps {
  endTime: string | Date;
}

const CountdownFlipNumbers: React.FC<CountdownFlipNumbersProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Ensure endTime is in valid timestamp format (milliseconds)
    const endTimestamp = new Date(endTime).getTime();

    const updateTimeLeft = () => {
      const now = Date.now();
      const timeRemaining = endTimestamp - now; // Calculate remaining time

      console.log(":::::::::", timeRemaining); // Check timeRemaining in the console

      if (timeRemaining <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
  }, [endTime]); // endTime as dependency

  return (
    <Grid className="countdown" sx={{ gap: '15px' }}>
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
            numberStyle={{ fontSize: "22px", fontFamily: "REM", fontWeight: "500" }}
          />
        </div>
        <span className="label1" style={{ fontFamily: "REM", fontSize: '14px' }}>Ngày</span>
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
            backgroundColor: "#fff"
          }}
        >
          <FlipNumbers
            height={45}
            width={16}
            play
            color="#000"
            background="#fff"
            numbers={timeLeft.hours.toString().padStart(2, "0")}
            numberStyle={{ fontSize: "22px", fontFamily: "REM", fontWeight: "500" }}
          />
        </div>
        <span className="label1" style={{ fontFamily: "REM", fontSize: "14px", }}>Giờ</span>
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
            backgroundColor: "#fff"
          }}
        >
          <FlipNumbers
            height={45}
            width={16}
            play
            color="#000"
            background="#fff"
            numbers={timeLeft.minutes.toString().padStart(2, "0")}
            numberStyle={{ fontSize: "22px", fontFamily: "REM", fontWeight: "500" }}
          />
        </div>
        <span className="label1" style={{ fontFamily: "REM", fontSize: "14px", }}>Phút</span>
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
            backgroundColor: "#fff"
          }}
        >
          <FlipNumbers
            height={45}
            width={16}
            play
            color="#000"
            background="#fff"
            numbers={timeLeft.seconds.toString().padStart(2, "0")}
            numberStyle={{ fontSize: "22px", fontFamily: "REM", fontWeight: "500" }}
          />
        </div>
        <span className="label1" style={{ fontFamily: "REM", fontSize: "14px", }}>Giây</span>
      </div>
    </Grid>
  );
};

export default CountdownFlipNumbers;
