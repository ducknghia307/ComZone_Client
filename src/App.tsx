import React, { useEffect } from "react";

import Navbar from "./components/navbar/Navbar";
import AppRouter from "./components/appRouter/AppRouter";
import Footer from "./components/footer/Footer";
import { ConfigProvider } from "antd";
import socket, { connectSocket } from "./services/socket";
import { useAppSelector } from "./redux/hooks";

function App() {
  // Get accessToken and userId from the Redux store
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    if (accessToken && userId) {
      connectSocket();
    }
    socket.emit("joinRoom", userId);

    return () => {
      socket.disconnect();
    };
  }, [accessToken, userId]); // Run this effect only when accessToken or userId changes

  return (
    <ConfigProvider
      theme={{
        components: {
          Steps: {
            colorPrimary: "black",
            colorPrimaryBorder: "#859F3D",
            lineWidth: 2,
            dotSize: 10,
            dotCurrentSize: 16,
          },
          Checkbox: {
            colorPrimary: "#000000",
            colorPrimaryHover: "#000000",
          },
          Radio: {
            colorPrimary: "#000000",
          },
          Select: {
            hoverBorderColor: "#ccc",
            colorPrimary: "#ccc",
          },
          Input: {
            activeBorderColor: "#000",
            colorPrimaryHover: "#ccc",
          },
        },
        token: {
          fontFamily: "REM",
        },
      }}
    >
      <div className="w-full min-h-screen flex flex-col justify-between ">
        <Navbar />
        <div className="grow">
          <AppRouter />
        </div>
        <Footer />
      </div>
    </ConfigProvider>
  );
}

export default App;
