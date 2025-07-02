import { WebSocketServer } from "ws";
import { URL } from "url";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const server = new WebSocketServer({ port: 8080 });

/**
 * starts the pong game loop, sends data back and forth between the two players.
 * @param socket the socket of the user
 * @param hi this is just an example param
 * @returns nothing
 */
const pongLoop = async (socket, ready) => {
  // 3. inside the tic tac toe function, start the game. send a ready message to the owner client specifically where they will not be allowed to hit start.
};

/**
 * starts the tic tac toe game loop, sends data back and forth between the two players.
 * @param socket the socket of the user
 * @param hi this is just an example param
 * @returns nothing
 */
const tttLoop = async (socket, ready) => {};

/**
 * starts the chess game loop, sends data back and forth between the two players.
 * @param socket the socket of the user
 * @param hi this is just an example param
 * @returns nothing
 */
const chessLoop = async (socket, ready) => {};

// map to hold all active client key value pairs. key=userId, value=WebSocket
const clients = new Map();

server.on("connection", async (socket, req) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  let userId = null;
  let lobbyId = null;
  let lobbyOwnerId = null;

  if (!req.url) {
    socket.close(1008, "Missing URL");
    return;
  }
  const url = new URL(req.url, "ws://localhost:443");
  const token = url.searchParams.get("token");
  const game = url.searchParams.get("game");
  const lobbyCode = url.searchParams.get("lobby_code");
  if (!token) {
    socket.close(1008, "No token provided");
    return;
  }
  if (!game) {
    socket.close(1008, "No game provided");
    return;
  }
  if (!lobbyCode) {
    socket.close(1008, "No lobby code provided");
    return;
  }
  console.log("Client connected");
  console.log(token);
  console.log(game);
  console.log(lobbyCode);

  try {
    // authenticate user
    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);
    console.log(userData);
    console.log(userError);
    if (userError || !userData) {
      socket.close(1008, "Could not authenticate user");
    }
    userId = userData.user.id;

    // try to join the user to the lobby
    if (lobbyCode.length !== 7) {
      socket.close(1008, "Invalid join code.");
    }
    // ensure lobby exists in lobbies table
    const { data: lobbyData, error: lobbyError } = await supabase
      .from("lobbies")
      .select("*")
      .eq("code", lobbyCode)
      .single();
    if (!lobbyData || lobbyError) {
      socket.close(
        1008,
        "Error finding lobby. Please double check that your join code is correct.",
      );
    }
    lobbyId = lobbyData.id;
    lobbyOwnerId = lobbyData.owner;
    let isOwner = lobbyOwnerId === userId ? true : false;
    socket.send(JSON.stringify({ type: "find_owner", lobbyOwner: isOwner }));
    const { data: inLobby } = await supabase
      .from("lobby_players")
      .select("*")
      .eq("player_id", userId)
      .eq("lobby_id", lobbyId)
      .single();
    console.log("player_id: ", userId);
    console.log("lobby_id: ", lobbyId);
    console.log("in lobby: ", inLobby);
    // if they are owner or are already in the lobby, then we can skip the following
    if (lobbyOwnerId !== userId && !inLobby) {
      // add player to lobby players table
      const { error: lobbyJoinError } = await supabase
        .from("lobby_players")
        .insert({ lobby_id: lobbyId, player_id: userId });
      console.log("lobbyJoinError: ", lobbyJoinError);
      if (lobbyJoinError && lobbyJoinError.code === "42501") {
        // case that they are already in a lobby, remove them from all lobbies (they own or dont) and then try again
        await supabase.from("lobbies").delete().eq("owner", userId);
        await supabase
          .from("lobby_players")
          .delete()
          .eq("player_id", userId);
      }
      if (lobbyJoinError)
        socket.close(1008, "Failed to join lobby. You may try again.");
    }

    // at this point we have reached a successful connection established, so we now add the user to our clients map 
    clients.set(userId, { socket: socket, lobbyId: lobbyId, isOwner: isOwner });

    // notify other players in lobby of join, first get all userIds who are in my lobby 
    const playersInLobby = Array.from(clients.entries()).filter(([id, clientData]) => clientData.lobbyId === lobbyId).map(([id, clientData]) => id);
    const { data: players } = await supabase.from("profiles").select("*").in("id", playersInLobby);
    console.log(players);
    // TODO 
    // FIX CLIENT SIDE LOBBY CREATION, RE CREATE A TEST LOBBY ON ALT ACCOUNT. CURRENT ONE DOES NOT HAVE ALT ACCOUNT IN CLIENTS MAP BECAUSE IT WAS BEFORE THE ADDITION OF IT TO THE CODE 

    let ready = false;

    // run game loop for whatever game they are playing
    switch (game) {
      case "pong":
        pongLoop(socket, ready);
        break;
      case "tic-tac-toe":
        tttLoop(socket, ready);
        break;
      case "chess":
        chessLoop(socket, ready);
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

  socket.on("close", async () => {
    // TODO
    // if they are the owner disconnect all other players
    if (userId === lobbyOwnerId) {
      const { error: deleteError } = await supabase.from("lobbies").delete().eq("id", lobbyId);
      console.log("deleteError: ", deleteError);
    } else {
      // else just remove them from lobbies_players
      const { error: leaveError } = await supabase.from("lobby_players").delete().eq("lobby_id", lobbyId).eq("player_id", userId);
      console.log("leaveError: ", leaveError);
    }
    // now remove from clients 
    clients.delete(userId);
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
 * 7. i think i should have the websocket remove them from the lobby on disconnect. if this happens mid game, we will store the game state and pause the game for 30 seconds allowing the user that left to join back and if they do not then the game will be considered forfeited by that player.
 */

/*
 * 1. just need to handle on the client side, otherwise done.
 * 2. done
 * 3.
 */
