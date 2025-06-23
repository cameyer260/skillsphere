import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 443 });

server.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (message) => {
    console.log("Received:", message);
    socket.send(`Roger that! ${message}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});
