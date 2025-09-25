import { WebSocketServer } from "ws";
import { URL } from "url";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const wss = new WebSocketServer({ port: 3003 });

/**
 * starts the connect four game loop, sends data back and forth between the two players
 * @param socket the socket of the user
 * @parm userId the id of the user it is being called for
 * @returns nothing
 */
const cfLoop = async (socket, userId) => {
  // declare game state here
  const initialGameState = {
    board: null,
    red: null,
    yellow: null,
    turn: null,
    gameWon: null,
    draw: false,
  };

  /**
   * maps the turn of the gameState to the id of the player who's turn it currently is. used for deciding who's turn it is on a move message.
   * @param the global gameState
   * @returns the string player
   */
  const mapTurn = () => {
    const lobbyId = clients.get(userId)?.lobbyId;
    const gameState = gameStates.get(lobbyId);

    return gameState.turn === "red" ? gameState.red : gameState.yellow;
  };

  /**
   * maps the player character to their player id by fetching the game state. used in tttGameWon.
   * @param playerColor the color string ("red" or "yellow") of the player whose id needs to be fetched.
   * @param gameState the gameState that this needs to be done on.
   * @returns the string id of the player.
   */
  const mapPlayer = (playerColor, gameState) => {
    // in connect four, the players are "red" and "yellow"
    return playerColor === "red" ? gameState.red : gameState.yellow;
  };

  const validateMove = (gameState, row, column) => {
    // first run some basic checks for row and column being in range and gameState not null
    if (!gameState || row < 0 || row > 5 || column < 0 || column > 6)
      return false;

    // second make sure the spot on the board is open
    if (gameState.board[row][column]) return false;

    // third make sure there is a piece under it or it's the bottom row (row 5)
    if (row < 5 && !gameState.board[row + 1][column]) return false;

    // all tests passed, move is approved
    return true;
  };

  /**
   * helper function for cfLoop(). scans the board for a win and sets the gameState's gameWon to the id of the winner if someone has won or null if no one has.
   * @param gameState the gameState that you would like to find a win on
   * @returns nothing
   */
  const cfGameWon = (gameState) => {
    if (!gameState || !gameState.board) return;

    const rows = gameState.board.length;
    const cols = gameState.board[0].length;

    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    const inBounds = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = gameState.board[r][c];
        if (!color) continue;

        for (const [dr, dc] of directions) {
          // check the next 3 cells in the direction (total run of 4)
          let k = 1;
          for (; k < 4; k++) {
            const nr = r + dr * k;
            const nc = c + dc * k;
            if (!inBounds(nr, nc) || gameState.board[nr][nc] !== color) break;
          }
          if (k === 4) {
            gameState.gameWon = mapPlayer(color, gameState);
            return;
          }
        }
      }
    }

    // check for draw
    let oneEmpty = false;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (!gameState.board[r][c]) oneEmpty = true;
      }
    }
    !gameState.gameWon && !oneEmpty
      ? (gameState.draw = true)
      : (gameState.draw = false); // if no one has one and there is not a single empty space in the board, we have reached a draw
  };

  socket.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      const players = getPlayersInLobby(userId);

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

          const lobbyId = clients.get(userId)?.lobbyId;

          // send a startgame message to both players including which player has the first turn, keep track of game state here locally which will be the offical state of the game
          const ownerFirst = Math.round(Math.random()) === 1; // randomly decide whether our owner goes first or not here
          // initialize game state
          initialGameState.turn = "red"; // red always goes first
          let owner = players[0].isOwner ? players[0].id : players[1].id;
          let otherPlayer =
            players[0].isOwner === false ? players[0].id : players[1].id;
          initialGameState.red = ownerFirst ? owner : otherPlayer;
          initialGameState.yellow = ownerFirst ? otherPlayer : owner;
          initialGameState.board = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
          ];
          initialGameState.gameWon = null;
          initialGameState.draw = false;
          gameStates.set(lobbyId, initialGameState); // set global gameStates accordingly.
          for (const player of players) {
            const s = clients.get(player.id).socket;
            if (s.readyState === WebSocket.OPEN) {
              s.send(
                JSON.stringify({
                  type: "start_game",
                  payload: {
                    gameState: initialGameState,
                  },
                }),
              );
            }
          }
          break;
        }

        case "move": {
          const lobbyId = clients.get(userId)?.lobbyId;
          const gameState = gameStates.get(lobbyId);
          if (userId !== mapTurn()) {
            socket.send(
              JSON.stringify({
                type: "move",
                payload: {
                  success: false,
                  reason: "It is not your turn to move",
                },
              }),
            );
            break;
          }

          // 2. validate the move
          if (!validateMove(gameState, data.payload.r, data.payload.c)) {
            socket.send(
              JSON.stringify({
                type: "move",
                payload: {
                  success: false,
                  reason: "Invalid move",
                },
              }),
            );
            break;
          }

          // 3. at this point we have a success, we check for gamewon and send back a success message to all players of the lobby informing them of the new move. we send our updated gameState back to them.
          gameState.board[data.payload.r][data.payload.c] = gameState.turn;
          gameState.turn === "red"
            ? (gameState.turn = "yellow")
            : (gameState.turn = "red");
          cfGameWon(gameState); // will either return the id of the user who won or null if no one has won yet
          const players = getPlayersInLobby(userId);
          for (const player of players) {
            const s = clients.get(player.id).socket;
            if (s.readyState === WebSocket.OPEN) {
              s.send(
                JSON.stringify({
                  type: "move",
                  payload: { success: true, gameState: gameState },
                }),
              );
            }
          }
          break;
        }

        case "kick_player": {
          // 1. is the player who sent this message the lobby owner? if not send error message back
          const lobbyId = clients.get(userId)?.lobbyId;
          const gameState = gameStates.get(lobbyId);
          if (clients.get(userId).isOwner !== true) {
            socket.send(
              JSON.stringify({
                type: "kick_player_error",
                payload: {
                  reason: "You must be owner to kick someone from the lobby.",
                },
              }),
            );
          }
          // 2. end their socket connection. socket.onClose will handle removing them from states and lobbies.
          clients
            .get(data.payload.id)
            .socket.close(4000, "You have been kicked from the lobby");
          // TODO: leave gamestate alone for now and set timer for the player to be able to join back
          break;
        }

        default: {
          console.log("default hit");
          console.log(data);
          console.log(userId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
};

/**
 * starts the tic tac toe game loop, sends data back and forth between the two players.
 * @param socket the socket of the user
 * @parm userId the id of the user it is being called for
 * @returns nothing
 */
const tttLoop = async (socket, userId) => {
  // declare game state here
  const initialGameState = {
    turn: null,
    x: null,
    o: null,
    board: null,
    gameWon: null,
    draw: false,
  };

  /**
   * maps the turn of the gameState to the id of the player who's turn it currently is. used for deciding who's turn it is on a move message.
   * @param the global gameState
   * @returns the string player
   */
  const mapTurn = () => {
    const lobbyId = clients.get(userId)?.lobbyId;
    const gameState = gameStates.get(lobbyId);

    return gameState.turn === "x" ? gameState.x : gameState.o;
  };

  /**
   * maps the player character to their player id by fetching the game state. used in tttGameWon.
   * @param character the character of the player whose id needs to be fetched.
   * @param gameState the gameState that this needs to be done on.
   * @returns the string id of the player.
   */
  const mapPlayer = (character, gameState) => {
    return character === "x" ? gameState.x : gameState.o;
  };

  /**
   * helper function for tttLoop(). scans the board for a win and sets the gameState's gameWon to the id of the winner if someone has won or null if no one has.
   * @param gameState the gameState that you would like to find a win on
   */
  const tttGameWon = (gameState) => {
    if (!gameState) return;

    // first check for horizontal win (by row)
    for (let row = 0; row < 3; row++) {
      if (
        gameState.board[row][0] &&
        gameState.board[row][0] === gameState.board[row][1] &&
        gameState.board[row][1] === gameState.board[row][2]
      ) {
        gameState.gameWon = mapPlayer(gameState.board[row][0], gameState);
        return;
      }
    }
    // then check for vertical win (by column)
    for (let col = 0; col < 3; col++) {
      if (
        gameState.board[0][col] &&
        gameState.board[0][col] === gameState.board[1][col] &&
        gameState.board[1][col] === gameState.board[2][col]
      ) {
        gameState.gameWon = mapPlayer(gameState.board[0][col], gameState);
        return;
      }
    }
    // then check for diagonal win. first check top left to bottom right, then top right to bottom left.
    if (
      gameState.board[0][0] &&
      gameState.board[0][0] === gameState.board[1][1] &&
      gameState.board[1][1] === gameState.board[2][2]
    ) {
      gameState.gameWon = mapPlayer(gameState.board[0][0], gameState);
      return;
    }
    if (
      gameState.board[0][2] &&
      gameState.board[0][2] === gameState.board[1][1] &&
      gameState.board[1][1] === gameState.board[2][0]
    ) {
      gameState.gameWon = mapPlayer(gameState.board[0][2], gameState);
      return;
    }
    gameState.gameWon = null;
    // check for draw
    let oneEmpty = false;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (!gameState.board[r][c]) oneEmpty = true;
      }
    }
    !gameState.gameWon && !oneEmpty
      ? (gameState.draw = true)
      : (gameState.draw = false); // if no one has one and there is not a single empty space in the board, we have reached a draw
  };

  socket.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      const players = getPlayersInLobby(userId);

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

          const lobbyId = clients.get(userId)?.lobbyId;

          // send a startgame message to both players including which player has the first turn, keep track of game state here locally which will be the offical state of the game
          const ownerFirst = Math.round(Math.random()) === 1; // randomly decide whether our owner goes first or not here
          // initialize game state
          initialGameState.turn = "x";
          let owner = players[0].isOwner ? players[0].id : players[1].id;
          let otherPlayer =
            players[0].isOwner === false ? players[0].id : players[1].id;
          initialGameState.x = ownerFirst ? owner : otherPlayer;
          initialGameState.o = ownerFirst ? otherPlayer : owner;
          initialGameState.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
          ];
          initialGameState.gameWon = null;
          initialGameState.draw = false;
          gameStates.set(lobbyId, initialGameState); // set global gameStates accordingly.
          for (const player of players) {
            const s = clients.get(player.id).socket;
            if (s.readyState === WebSocket.OPEN) {
              s.send(
                JSON.stringify({
                  type: "start_game",
                  payload: {
                    gameState: initialGameState,
                  },
                }),
              );
            }
          }
          break;
        }

        case "move": {
          const lobbyId = clients.get(userId)?.lobbyId;
          const gameState = gameStates.get(lobbyId);
          if (userId !== mapTurn()) {
            socket.send(
              JSON.stringify({
                type: "move",
                payload: {
                  success: false,
                  reason: "It is not your turn to move",
                },
              }),
            );
            break;
          }

          // 2. make sure the spot on the board is open
          if (gameState.board[data.payload.r][data.payload.c]) {
            socket.send(
              JSON.stringify({
                type: "move",
                payload: {
                  success: false,
                  reason: "That spot is already taken",
                },
              }),
            );
            break;
          }

          // 3. at this point we have a success, we check for gamewon and send back a success message to all players of the lobby informing them of the new move. we send our updated gameState back to them.
          gameState.board[data.payload.r][data.payload.c] = gameState.turn;
          gameState.turn === "x"
            ? (gameState.turn = "o")
            : (gameState.turn = "x");
          tttGameWon(gameState); // will either return the id of the user who won or null if no one has won yet
          const players = getPlayersInLobby(userId);
          for (const player of players) {
            const s = clients.get(player.id).socket;
            if (s.readyState === WebSocket.OPEN) {
              s.send(
                JSON.stringify({
                  type: "move",
                  payload: { success: true, gameState: gameState },
                }),
              );
            }
          }
          break;
        }

        case "kick_player": {
          // 1. is the player who sent this message the lobby owner? if not send error message back
          const lobbyId = clients.get(userId)?.lobbyId;
          const gameState = gameStates.get(lobbyId);
          if (clients.get(userId).isOwner !== true) {
            socket.send(
              JSON.stringify({
                type: "kick_player_error",
                payload: {
                  reason: "You must be owner to kick someone from the lobby.",
                },
              }),
            );
          }
          // 2. end their socket connection. socket.onClose will handle removing them from states and lobbies.
          clients
            .get(data.payload.id)
            .socket.close(1000, "Owner has removed you from the lobby");
          // TODO: leave gamestate alone for now and set timer for the player to be able to join back
          break;
        }

        default: {
          console.log("default hit");
          console.log(data);
          console.log(userId);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};

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
// map to hold all lobby gameStates, they will follow this schema: {key=lobby, value=data. data={game: "tic-tac-toe (or pong or whatever else)", gameState=gameState object}}
const gameStates = new Map();

wss.on("connection", async (socket, req) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  let userId = null;
  let lobbyId = null;
  let lobbyOwnerId = null;

  if (!req.url) {
    socket.close(1008, "Missing URL");
    return;
  }
  const url = new URL(req.url, "wss://ws.playskillsphere.com");
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
      case "tic-tac-toe":
        tttLoop(socket, userId);
        break;
      case "connect-four":
        cfLoop(socket, userId);
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
    const lobbyId = clients.get(userId)?.lobbyId;
    clients.delete(userId);
    playersInLobby = playersInLobby.filter((_) => _.id !== userId);

    if (userId === lobbyOwnerId) {
      await supabase.from("lobbies").delete().eq("id", lobbyId);
      gameStates.delete(lobbyId);
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
