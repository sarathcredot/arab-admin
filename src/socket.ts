import { io } from "socket.io-client";

// Replace with your backend WebSocket server URL
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;
const socket = io(SOCKET_SERVER_URL);



export default socket;
