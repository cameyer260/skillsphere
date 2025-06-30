import { WebSocketServer } from "ws";
import { URL } from "url";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const server = new WebSocketServer({ port: 8080 });

const pongLoop = async () => {

};

const tttLoop = async () => {

};

const chessLoop = async () => {

};

server.on("connection", async (socket, req) => {
  if (!req.url) {
    socket.close(1008, "Missing URL");
    return;
  }
  const url = new URL(req.url, "ws://localhost:443");
  const token = url.searchParams.get("token");
  const game = url.searchParams.get("game");
  if (!token) {
    socket.close(1008, "No token provided");
    return;
  }
  if (!game) {
    socket.close(1008, "No game provided");
    return;
  }
  console.log("Client connected");
  console.log(token);
  console.log(game);

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await supabase.auth.getUser(token);
    console.log(data);
    console.log(error);
    if (error || !data) {
      console.log("User is not signed in.");
      socket.close(1008, "Could not authenticate user");
    }
    switch (game) {
      case "pong":
        pongLoop();
        break;
      case "tic-tac-toe":
        tttLoop();
        break;
      case "chess":
        chessLoop();
        break;
      default:
        socket.close(1008, "Game not found");
    }
  } catch (err) {
    console.log("Unexpected error: ", err);
    socket.close(1011, "Internal error");
  }

  socket.on("message", (message) => {
    console.log("Received:", message.toString());
    socket.send(`Roger that! ${message}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

/**
 * 1. user auth:
 *  - check if user is signed in, if not close the web socket and handle that response/error on client side (so far we have the socket being closed if the user is not signed in in the prod/index.js file)
 *  - make sure the user is in the correct lobby
 * 2. check what game is being played and call a different function for each, maybe pass a param with a gamename variable that the ws-server can harvest to get this info
 * 3. inside the tic tac toe function, start the game. send a ready message to the owner client specifically where they will not be allowed to hit start.
 * 4. listen to a start game message from the owner, verify that the game is startable, and start it.
 * 5. decide who goes first randomly, the owner or the player (2 person game so just use mathrandom) and keep a turn counter varaible in the code. listen to moves on both sides and accept or reject them based on their validity and whose turn it is. on successful moves, send it to the other client (the owner or the player)
 * 6. handle game won logic and record the info in some game records table that you create that just ties. games record table will have an id, a user_id foregin key that ties to a user, a game that was played, and who won. this will be used to determine the user's rank following the rules on the whiteboard in your room.
 * 7. handle weird use cases. user leaves the website mid game and comes back, maybe they leave the site entirely or go somehwere else on it. ask chatgpt on how to handle this, whether you should remove them from the lobby and end them game or maybe put in a timeout counter to end the game if they do not try to re join in that time.
 */

/*
 * 1. just need to handle on the client side, otherwise done.
 * 2. done
 * 3. 
 */
