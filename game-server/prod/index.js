import https from "https";
import fs from "fs";
import { WebSocketServer } from "ws";
import { URL } from "url";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const server = https.createServer({
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/ws.playskillsphere.com/fullchain.pem",
  ),
  key: fs.readFileSync(
    "/etc/letsencrypt/live/ws.playskillsphere.com/privkey.pem",
  ),
});

const wss = new WebSocketServer({ server });

wss.on("connection", async (socket, req) => {
  console.log("Secure WebSocket connected");
  if (!req.url) {
    console.log("MISING URL");
    socket.close(1008, "Missing URL");
    return;
  }
  const url = new URL(req.url, "wss://ws.playskillsphere.com");
  const token = url.searchParams.get("token");
  if (!token) {
    console.log("MISSING TOKEN");
    socket.close(4001, "No token provided");
    return;
  }
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    const { data, error } = await supabase.auth.getUser(token);
    console.log(data, error);
  } catch (err) {
    console.error("Unexpected error: ", err);
    socket.close(1011, "Internal error");
  }

  socket.on("message", (message) => {
    console.log("Message:", message.toString());
  });
  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(443, () => {
  console.log("HTTPS + WSS server running on port 443");
});

