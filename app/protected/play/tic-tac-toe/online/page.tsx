"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useGlobal } from "@/app/context/GlobalContext";
import ErrorBanner from "@/components/error-message";
import LobbyComponent from "./lobby-component";
import GameComponent from "./game-component";

export interface GameState {
  board: string[][];
  o: string;
  x: string;
  turn: "o" | "x";
  gameWon: string | null;
  draw: boolean;
}

export interface LobbyPlayer {
  username: string;
  id: string;
  owner: boolean;
  avatarIndex: number;
}

function OnlinePageComponent() {
  const searchParams = useSearchParams();
  const lobbyCode = searchParams.get("code");
  const router = useRouter();
  const supabase = createClient();
  const [code, setCode] = useState<string>("");
  const [partyName, setPartyName] = useState<string>("");
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[] | null>(null);
  const [lobbyName, setLobbyName] = useState<string | null>(null);
  const [localErr, setLocalErr] = useState<string | null>(null);
  const { user, loading } = useGlobal();
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [isLobbyOwner, setIsLobbyOwner] = useState<boolean | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [cd, setCd] = useState<string | null>(null); // variables that will hold the code gotten from out ws connection and passed down to lobby component
  const [gameInProgress, setGameInProgress] = useState<boolean>(false);
  const [localGameState, setLocalGameState] = useState<GameState | null>(null);

  useEffect(() => {
    if (!lobbyCode) {
      setLocalErr(null);
    }
  }, [lobbyCode]);

  const handleClick = (r: number, c: number) => {
    socketRef.current?.send(
      JSON.stringify({ type: "move", payload: { r: r, c: c } }),
    );
    return null;
  };

  useEffect(() => {
    const handleConnect = async () => {
      if (!user || loading || !lobbyCode) return;
      // try to connect to vps via ws
      try {
        if (lobbyCode.length !== 7) {
          throw new Error("Invalid join code.");
        }
        // set is lobbby owner accordingly, handle connection failures
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (!accessToken)
          throw new Error(
            "Failed to get user session. Try logging out and logging back in or refreshing the page.",
          );
        // now that they are successfully added to the lobby as the owner or a player, we can establish a web socket connection
        const ws = new WebSocket(
          process.env.NODE_ENV === "development"
            ? `ws://localhost:8080?token=${accessToken}&game=tic-tac-toe&lobby_code=${lobbyCode}`
            : `wss://ws.playskillsphere.com?token=${accessToken}&game=tic-tac-toe&lobby_code=${lobbyCode}`,
        );

        socketRef.current = ws;
        ws.onopen = () => {
          setWsConnected(true);
          setLocalErr(null);
        };
        ws.onmessage = async (event) => {
          let message = JSON.parse(event.data);

          switch (message.type) {
            case "find_owner":
              setIsLobbyOwner(message.lobbyOwner);
              break;
            case "lobby_players":
              // set lobby players accordingly
              const players: {
                username: string;
                id: string;
                owner: boolean;
                avatarIndex: number;
              }[] = [];
              for (const player of message.payload) {
                if (player.id !== user.id) {
                  const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", player.id)
                    .single();
                  if (
                    data &&
                    typeof data.username === "string" &&
                    typeof data.id === "string" &&
                    typeof player.isOwner === "boolean" &&
                    typeof data.avatar_index === "number"
                  ) {
                    players.push({
                      username: data.username,
                      id: data.id,
                      owner: player.isOwner,
                      avatarIndex: data.avatar_index,
                    });
                  }
                }
              }
              setLobbyPlayers(players);
              break;
            case "lobby_name":
              setLobbyName(message.payload);
              break;
            case "lobby_code":
              setCd(message.payload);
              break;
            case "start_game":
              setGameInProgress(true);
              const gs = message.payload.gameState;
              setLocalGameState(gs);
              break;
            case "fail_start":
              setLocalErr(message.payload);
              break;
            case "move":
              if (message.payload.success) {
                setLocalGameState(message.payload.gameState);
              } else {
                setLocalErr(message.payload.reason);
              }
              break;
            default:
              console.log("Unexcepted message from web socket: ");
              console.log(message);
          }
        };

        ws.onclose = (event) => {
          console.log("Disconnected", event.code, event.reason);
          setWsConnected(false);
          setIsLobbyOwner(false);
          setGameInProgress(false);
          socketRef.current = null;
          switch (event.code) {
            case 1008:
              setLocalErr(
                "No lobby was found with that code. Please double-check and try again.",
              );
              break;
            case 1000:
              setLocalErr(null);
              break;
            default:
              setLocalErr("Disconnected from lobby unexpectedly");
          }
        };
        ws.onerror = (err) => {
          if (
            socketRef.current?.readyState !== WebSocket.CLOSING &&
            socketRef.current?.readyState !== WebSocket.CLOSED
          ) {
            setLocalErr("Error connecting to lobby");
            setWsConnected(false);
            router.push("/protected/play/tic-tac-toe/online");
          }
        };
        // finally, on success show them the lobby-component instead of the regular joining page
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          setLocalErr(error.message);
          router.push("/protected/play/tic-tac-toe/online");
          return;
        }
      }
    };
    handleConnect();
    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close(1000, "Component unmounted");
      }
    };
  }, [searchParams, loading]);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length != 7) {
      alert("Code is 7 characters long");
      return;
    }
    router.push(`/protected/play/tic-tac-toe/online?code=${code}`);
  };

  const genCode = (): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 7; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (partyName.length > 25 || partyName.length === 0) {
      alert("Party name must be between 1 and 25 characters");
      return;
    }
    // first generate a code to insert
    const cd = genCode();
    // try creating the lobby in public.lobbies
    const { error } = await supabase.from("lobbies").insert({
      owner: user.id,
      game: "Tic-Tac-Toe",
      code: cd,
      lobby_name: partyName,
    });
    // on success forward them to the same page with ?code=... where they should be shown the lobby component and have admin privelages
    if (!error) {
      router.push(`/protected/play/tic-tac-toe/online?code=${cd}`);
      return;
    } else {
      console.log(error);
      if (error.code === "42501") {
        await supabase.from("lobbies").delete().eq("owner", user.id);
        setLocalErr(
          "You were already in an existing lobby. We've removed you from it, so you're now free to create a new one.",
        );
        return;
      }
      setLocalErr("There was an error creating the lobby. You may try again.");
    }
  };

  const backToLobby = (): void => {
    // resets all our game related variables
    // react will handle sending us back home
    // eventually I will add how this game affected your rank but for now I will not deal with that, this is an MVP
    setLocalErr(null);
    setGameInProgress(false);
    setLocalGameState(null);
  };

  if (gameInProgress)
    return (
      <GameComponent
        handleClick={handleClick}
        localGameState={localGameState}
        lobbyPlayers={lobbyPlayers}
        localErr={localErr}
        setLocalErr={setLocalErr}
        backToLobby={backToLobby}
      />
    );

  return wsConnected && lobbyCode ? (
    <LobbyComponent
      isOwner={isLobbyOwner}
      socket={socketRef}
      setError={setLocalErr}
      router={router}
      lobbyName={lobbyName}
      players={lobbyPlayers}
      code={cd}
    />
  ) : (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] items-center">
      {localErr && <ErrorBanner message={localErr} />}
      <h1 className="text-5xl mt-5 mb-5">Join a Game or Create a New One</h1>
      <div className="flex flex-row w-full h-full justify-center text-center">
        <div className="border-r border-foreground/30 h-[87.5%] flex-1">
          <h1 className="text-3xl mb-3">Enter Your Code Here:</h1>
          <form
            onSubmit={handleJoinSubmit}
            className="flex flex-col gap-4 items-center"
          >
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ex: 5w7eJlK"
              maxLength={7}
              className="appearance-none border border-foreground/30 rounded-lg px-2 outline-none bg-transparent"
            />
            <input
              type="submit"
              value="Join Game"
              className="border rounded-lg border-foreground/30 px-2 text-xl cursor-pointer"
            />
          </form>
        </div>
        <div className="h-[87.5%] flex-1">
          <h1 className="text-3xl mb-3">Create Your Game Lobby:</h1>
          <form
            onSubmit={handleCreateSubmit}
            className="flex flex-col gap-2 justify-center"
          >
            <div className="mb-2">
              <label className="flex gap-2 justify-center">
                Choose a party name:{" "}
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="ex: Tim's Tin Knights"
                  maxLength={25}
                  className="appearance-none border border-foreground/30 rounded-lg px-2 outline-none bg-transparent"
                />
              </label>
            </div>
            <div>
              <input
                type="submit"
                value="Create Game"
                className="border rounded-lg border-foreground/30 px-2 text-xl cursor-pointer"
              />
            </div>
          </form>{" "}
        </div>
      </div>
    </div>
  );
}

export default function OnlinePage() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <OnlinePageComponent />
    </Suspense>
  );
}
