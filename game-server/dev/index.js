import { WebSocketServer } from "ws";
import { URL } from "url";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const server = new WebSocketServer({ port: 8080 });

/**
 * starts the pong game loop, sends data back and forth between the two players.
 * @param socket the socket of the user
 * @returns nothing
 */
const pongLoop = async (socket, ready) => {};

/**
 * starts the tic tac toe game loop, sends data back and forth between the two players.
 * @param socket the socket of the user
 * @parm userId the id of the user it is being called for
 * @returns nothing
 */
const tttLoop = async (socket, userId) => {
  // declare game state here
  const gameState = {
    turn: null,
    x: null,
    o: null,
    board: null,
  };
  socket.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      const players = getPlayersInLobby(userId, clients);

      switch (data.type) {
        // case that the owner hit the start game button
        case "ready": {
          if (players.length !== 2) {
            socket.send(
              JSON.stringify({
                type: "fail_start",
                payload:
                  "Error starting game. There must be only two players in the lobby for tic-tac-toe",
              }),
            );
            break;
          }
          if (
            clients.get(players[0].id).socket.readyState !== WebSocket.OPEN &&
            clients.get(players[1].id).socket.readyState !== WebSocket.OPEN
          ) {
            socket.send(
              JSON.stringify({
                type: "fail_start",
                payload:
                  "Error starting game. One of the players is not connected to the lobby.",
              }),
            );
            break;
          }
          if (clients.get(userId).isOwner !== true) {
            socket.send(
              JSON.stringify({
                type: "fail_start",
                payload:
                  "Error starting game. You must be the owner to start it.",
              }),
            );
            break;
          }

          console.log("this game is allowed to be started");
          // send a startgame message to both players including which player has the first turn, keep track of game state here locally which will be the offical state of the game
          const ownerFirst = Math.round(Math.random()) === 1; // randomly decide whether our owner goes first or not here
          // initialize game state
          gameState.turn = "x";
          let owner = players[0].isOwner ? players[0].id : players[1].id;
          let otherPlayer =
            players[0].isOwner === false ? players[0].id : players[1].id;
          gameState.x = ownerFirst ? owner : otherPlayer;
          gameState.o = ownerFirst ? otherPlayer : owner;
          gameState.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
          ];
          for (const player of players) {
            const s = clients.get(player.id).socket;
            if (s.readyState === WebSocket.OPEN) {
              s.send(
                JSON.stringify({
                  type: "start_game",
                  payload: {
                    gameState: gameState,
                  },
                }),
              );
            }
          }
          break;
        }

        case "move": {
          console.log(data);
          console.log(userId);
          console.log(gameState);
          break;
        }

        default: {
          console.log("default hit");
          console.log(data);
          console.log(userId);
          console.log(gameState);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};

/**
 * starts the chess game loop, sends data back and forth between the two players.
 * @param socket the socket of the user
 * @param hi this is just an example param
 * @returns nothing
 */
const chessLoop = async (socket, ready) => {};

/**
 * fetches the players who are in your lobby from the global clients map.
 * @param userId the id of the user
 * @param clients the state of the clients map
 * @returns an array of strings which are the ids of the players in the user's lobby, including their own id.
 */
const getPlayersInLobby = (userId) => {
  let lobbyId = clients.get(userId).lobbyId;
  let playersInLobby = Array.from(clients.entries())
    .filter(([id, clientData]) => clientData.lobbyId === lobbyId)
    .map(([id, clientData]) => ({ id: id, isOwner: clientData.isOwner }));
  return playersInLobby;
};

/**
 * notifies the other players in the lobby of a change to lobbyPlayers
 * @param userId the id of the user
 * @param clients the state of the clients map
 * @returns void
 */
const notifyPlayersChange = (userId) => {
  let playersInLobby = getPlayersInLobby(userId);
  for (const player of playersInLobby) {
    const client = clients.get(player.id);
    if (client && client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(
        JSON.stringify({
          type: "lobby_players",
          payload: playersInLobby,
        }),
      );
    }
  }
};

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

  try {
    // authenticate user
    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);
    if (userError || !userData) {
      socket.close(1008, "Could not authenticate user");
    }
    userId = userData.user.id;
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!profile || !profile.username)
      socket.close(1008, "User must have a username uploaded to play online");

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
      return;
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
    // if they are owner or are already in the lobby, then we can skip the following
    if (lobbyOwnerId !== userId && !inLobby) {
      // add player to lobby players table
      const { error: lobbyJoinError } = await supabase
        .from("lobby_players")
        .insert({ lobby_id: lobbyId, player_id: userId });
      if (lobbyJoinError && lobbyJoinError.code === "42501") {
        // case that they are already in a lobby, remove them from all lobbies (they own or dont) and then try again
        await supabase.from("lobbies").delete().eq("owner", userId);
        await supabase.from("lobby_players").delete().eq("player_id", userId);
      }
      if (lobbyJoinError) {
        socket.close(1008, "Failed to join lobby. You may try again.");
        return;
      }
    }

    // at this point we have reached a successful connection established, so we now add the user to our clients map
    clients.set(userId, { socket: socket, lobbyId: lobbyId, isOwner: isOwner });

    // notify other players in lobby of join, first get all userIds who are in my lobby
    notifyPlayersChange(userId);

    // now send them the lobby name and code
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({ type: "lobby_name", payload: lobbyData.lobby_name }),
      );
      socket.send(
        JSON.stringify({ type: "lobby_code", payload: lobbyData.code }),
      );
    }

    // run game loop for whatever game they are playing
    switch (game) {
      case "pong":
        pongLoop(socket, userId);
        break;
      case "tic-tac-toe":
        tttLoop(socket, userId);
        break;
      case "chess":
        chessLoop(socket, userId);
        break;
      default:
        socket.close(1008, "Game not found");
        return;
    }
  } catch (err) {
    console.log("Unexpected error: ", err);
    socket.close(1011, "Internal error");
  }

  socket.on("close", async () => {
    let playersInLobby = getPlayersInLobby(userId);
    clients.delete(userId);
    playersInLobby = playersInLobby.filter((_) => _.id !== userId);

    if (userId === lobbyOwnerId) {
      await supabase.from("lobbies").delete().eq("id", lobbyId);
      for (const player of playersInLobby) {
        const client = clients.get(player.id);
        if (client && client.socket.readyState === WebSocket.OPEN) {
          client.socket.send(
            JSON.stringify({
              type: "lobby_closed",
              payload: "The lobby owner has disconnected",
            }),
          );
          client.socket.close(1000, "Lobby closed");
        }
      }
    } else {
      await supabase
        .from("lobby_players")
        .delete()
        .eq("lobby_id", lobbyId)
        .eq("player_id", userId);
      // notify other players in lobby of change to lobby_players
      for (const player of playersInLobby) {
        const client = clients.get(player.id);
        if (client && client.socket.readyState === WebSocket.OPEN) {
          client.socket.send(
            JSON.stringify({
              type: "lobby_players",
              payload: playersInLobby,
            }),
          );
        }
      }
    }
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
