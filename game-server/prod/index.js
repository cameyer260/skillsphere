import https from "https";
import fs from "fs";
import { WebSocketServer } from "ws";

const server = https.createServer({
  cert: fs.readFileSync("/etc/letsencrypt/live/ws.playskillsphere.com/fullchain.pem"),
  key: fs.readFileSync("/etc/letsencrypt/live/ws.playskillsphere.com/privkey.pem"),
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Secure WebSocket connected");
  socket.on("message", (message) => {
    console.log("Message:", message);
  });
  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(443, () => {
  console.log("HTTPS + WSS server running on port 443");
});
