import { WebSocketServer } from 'ws';
import { URL } from "url";
import { createClient } from '@supabase/supabase-js';
import "dotenv/config";

const server = new WebSocketServer({ port: 8080 });

server.on("connection", async (socket, req) => {
  if (!req.url) {
    server.close(1008, "Missing URL");
    return;
  }
  const url = new URL(req.url, "ws://localhost:443");
  const token = url.searchParams.get("token");
  if (!token) {
    server.close(4001, "No token provided");
    return;
  }
  console.log("Client connected");
  console.log(token);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data, error } = await supabase.auth.getUser(token);
  console.log(data, error);

  socket.on("message", (message) => {
    console.log("Received:", message.toString());
    socket.send(`Roger that! ${message}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});
