"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useGlobal } from "@/app/context/GlobalContext";
import ErrorBanner from "@/components/error-message";
import LobbyComponent from "./lobby-component";

export default function OnlinePage() {
  const searchParams = useSearchParams();
  const lobbyCode = searchParams.get("code");
  const router = useRouter();
  const supabase = createClient();
  const [code, setCode] = useState<string>("");
  const [partyName, setPartyName] = useState<string>("");
  const [localErr, setLocalErr] = useState<string | null>(null);
  const { user, loading } = useGlobal();
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [isLobbyOwner, setIsLobbyOwner] = useState<boolean | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!lobbyCode) setLocalErr(null);
    const handleLobbyJoin = async () => {
      if (!user || loading || !lobbyCode) return;
      // try to join the lobby if it exists, if not forward them to another page
      try {
        if (lobbyCode.length !== 7) {
          throw new Error("Invalid join code.");
        }
        // ensure lobby exists in lobbies table
        const { data, error } = await supabase
          .from("lobbies")
          .select("*")
          .eq("code", lobbyCode)
          .single();
        if (!data || error) {
          throw new Error(
            "Error finding lobby. Please double check that your join code is correct.",
          );
        }
        setIsLobbyOwner(data.owner === user.id ? true : false);
        const { data: inLobby } = await supabase
          .from("lobby_players")
          .select("*")
          .eq("player_id", user.id)
          .eq("lobby_id", data.id)
          .single();
        // if they are owner or are already in the lobby, then we can skip the following
        if (data.owner !== user.id && !inLobby) {
          // add player to lobby players table
          const { error } = await supabase
            .from("lobby_players")
            .insert({ lobby_id: data.id, player_id: user.id });
          if (error && error.code === "42501") {
            // case that they are already in a lobby, remove them from all lobbies (they own or dont) and then try again
            await supabase.from("lobbies").delete().eq("owner", user.id);
            await supabase
              .from("lobby_players")
              .delete()
              .eq("player_id", user.id);
          }
          if (error)
            throw new Error("Failed to join lobby. You may try again.");
        }
        // now that they are successfully added to the lobby as the owner or a player, we can establish a web socket connection

        const ws = new WebSocket(
          process.env.NODE_ENV === "development"
            ? "ws://localhost:8080"
            : "wss://ws.playskillsphere.com:443", // make sure your VPS supports SSL
        );
        socketRef.current = ws;
        ws.onopen = () => {
          setWsConnected(true);
          console.log("Connected to websocket server");
          ws.send("Hello server!");
        };
        ws.onmessage = (event) => {
          console.log(event);
        };
        ws.onclose = () => {
          setWsConnected(false);
          console.log("Disconnected from server");
        };
        ws.onerror = (err) => {
          setWsConnected(false);
          console.log("WebSocket error");
          console.log(err);
          setLocalErr("Error connecting to lobby");
          router.push("/protected/play/tic-tac-toe/online");
        };
        return () => ws.close();
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
    handleLobbyJoin();
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
        setLocalErr(
          "You were already in an existing lobby. We've removed you from it, so you're now free to create a new one.",
        );
        return;
      }
      setLocalErr("There was an error creating the lobby. You may try again.");
    }
  };

  return wsConnected ? (
    <LobbyComponent
      isOwner={isLobbyOwner}
      supabase={supabase}
      socket={socketRef}
      setError={setLocalErr}
      router={router}
    />
  ) : !lobbyCode ? (
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
              placeholder="ex:5w7eJlK"
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
  ) : (
    <div>loading...</div>
  );
}
