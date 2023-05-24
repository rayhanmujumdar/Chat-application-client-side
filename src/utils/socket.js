
import { io } from "socket.io-client";
// console.log(import.meta.env.VITE_API_URL)
const socket = io(import.meta.env.VITE_LOCAL_HOST_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
  
});

export default socket