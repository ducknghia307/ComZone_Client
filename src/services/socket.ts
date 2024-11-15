import { io } from "socket.io-client";
import { privateAxios } from "../middleware/axiosInstance";

const socket = io("http://localhost:3000", {
  autoConnect: false, // Delay connection until explicitly connected
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect(); // Only connect if not already connected
  }
};

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
  privateAxios.patch("users/active-status/online");
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

export default socket;
