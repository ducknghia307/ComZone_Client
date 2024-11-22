import { io } from "socket.io-client";
import { privateAxios } from "../middleware/axiosInstance";
import { makeStore } from "../redux/store";

const { store } = makeStore();

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  autoConnect: false, // Delay connection until explicitly connected
});

export const connectSocket = () => {
  const state = store.getState();
  const user = state.auth.userId;

  if (user) {
    console.log(socket.io);
    
    socket.io.opts.query = { user };
    if (!socket.connected) {
      socket.connect();
    }
  }
};

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);

  privateAxios
    .patch("users/active-status/online")
    .catch((error) => console.error("Error updating active status:", error));
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

export default socket;
