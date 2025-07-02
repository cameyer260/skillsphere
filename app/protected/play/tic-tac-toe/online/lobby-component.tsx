import { SupabaseClient } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";
import { useGlobal } from "@/app/context/GlobalContext";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function LobbyComponent({
  isOwner,
  supabase,
  socket,
  setError,
  router,
}: {
  isOwner: boolean | null;
  supabase: SupabaseClient;
  socket: React.MutableRefObject<WebSocket | null>;
  setError: Dispatch<SetStateAction<string | null>>;
  router: AppRouterInstance;
}) {
  const { user } = useGlobal();
  const startGame = async () => {};

  // TODO
  // REWRITE TO EXIT WS GRACEFULLY WITH MESSAGE AND REASON
  // HANDLE THAT ON THE VPS, NOTIFY OTHER PLAYERS AND PAUSE GAME OR WHATEVER
  const exitLobby = async () => {
    socket.current?.close(1000, "User leaving lobby");
    router.push("/protected");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex justify-center mt-6 text-2xl">
        <h1 className="text-center border border-foreground/30 rounded-lg px-2">
          Tic-Tac-Toe: Christopher's Lobby of Legitness
        </h1>
        <div className="absolute right-6">
          {isOwner && (
            <button
              onClick={startGame}
              className=" border border-foreground/30 rounded-lg px-2"
            >
              "Start Game"
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
            Christopher
            {isOwner && <button>Kick</button>}{" "}
          </div>
          <div className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4">
            Christopher
            {isOwner && <button>Kick</button>}{" "}
          </div>
          <div className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4">
            Christopher
            {isOwner && <button>Kick</button>}{" "}
          </div>
          <div className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4">
            Christopher
            {isOwner && <button>Kick</button>}{" "}
          </div>
          <div className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4">
            Christopher
            {isOwner && <button>Kick</button>}{" "}
          </div>
          <div className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4">
            Christopher
            {isOwner && <button>Kick</button>}{" "}
          </div>
          <div className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4">
            Christopher
            {isOwner && <button>Kick</button>}{" "}
          </div>
          <div className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4">
            Christopher
            {isOwner && <button>Kick</button>}{" "}
          </div>
          <div className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4">
            Christopher
            {isOwner && <button>Kick</button>}{" "}
          </div>
          <div className="border border-foreground/30 rounded-lg text-center flex items-center justify-between h-16 px-4">
            Christopher
            {isOwner && <button>Kick</button>}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
