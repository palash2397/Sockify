import { io } from "socket.io-client";

export const connectSocket = (token) =>
  io("http://localhost:3001", {
    extraHeaders: { Authorization: `Bearer ${token}` },
  });
