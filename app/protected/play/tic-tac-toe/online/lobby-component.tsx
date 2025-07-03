import { SupabaseClient } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";
import { useGlobal } from "@/app/context/GlobalContext";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function LobbyComponent({
  isOwner,
  supabase,
  socket,
  setError,
  router,
  lobbyName,
  players,
}: {
  isOwner: boolean | null;
  supabase: SupabaseClient;
  socket: React.MutableRefObject<WebSocket | null>;
  setError: Dispatch<SetStateAction<string | null>>;
  router: AppRouterInstance;
  lobbyName: string | null;
  players:
    | { username: string; id: string; owner: boolean; avatarIndex: number }[]
    | null;
}) {
  const { user } = useGlobal();
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  const lightMode = mounted && (theme === "light" || resolvedTheme === "light");

  const startGame = async () => {
    socket.current?.send(
      JSON.stringify({
        type: "ready",
      }),
    );
  };

  // TODO
  // REWRITE TO EXIT WS GRACEFULLY WITH MESSAGE AND REASON
  // HANDLE THAT ON THE VPS, NOTIFY OTHER PLAYERS AND PAUSE GAME OR WHATEVER
  const exitLobby = async () => {
    socket.current?.close(1000, "User leaving lobby");
    router.push("/protected/play/tic-tac-toe/online");
  };

  if (!user) {
    router.push("/protected/play/tic-tac-toe/online");
    setError("Please logout and log back in and try rejoining the lobby");
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex justify-center mt-6 text-2xl">
        <h1 className="text-center border border-foreground/30 rounded-lg px-2">
          {lobbyName}
        </h1>
        <div className="absolute right-6">
          {isOwner && (
            <button
              onClick={startGame}
              className=" border border-foreground/30 rounded-lg px-2"
            >
              Start Game
            </button>
          )}
          <button
            onClick={exitLobby}
            className="border border-foreground/30 rounded-lg px-2"
          >
            {isOwner ? "Delete Lobby" : "Leave Lobby"}
          </button>
        </div>
      </div>
      <div className="flex-1 w-full p-6">
        <div className="border border-foreground/30 rounded-lg h-full grid grid-cols-2 gap-4 p-4 text-2xl">
          <div className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4">
            <div className="flex flex-row items-center gap-2">
              {user?.username}
              <Image
                src={`/account-page/avatar-icons/${user?.avatar_index === 0 ? (lightMode ? user?.avatar_index + "b" : user?.avatar_index + "w") : user?.avatar_index}.png`}
                alt="Profile Picture"
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
            {isOwner && (
              <Image
                src="/game-icons/universal/lobby_owner_crown.png"
                alt="crown image"
                width={50}
                height={50}
              />
            )}
          </div>
          {players?.map((_, index) => (
            <div
              className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4"
              key={index}
            >
              <div className="flex flex-row items-center gap-2">
                {_.username}
                <Image
                  src={`/account-page/avatar-icons/${_.avatarIndex === 0 ? (lightMode ? _.avatarIndex + "b" : _.avatarIndex + "w") : _.avatarIndex}.png`}
                  alt="Profile Picture"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              {_.owner ? (
                <Image
                  src="/game-icons/universal/lobby_owner_crown.png"
                  alt="crown image"
                  width={50}
                  height={50}
                />
              ) : isOwner ? (
                <button>Kick</button>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
