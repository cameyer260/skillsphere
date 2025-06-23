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

  const exitLobby = async () => {
    if (!user) return;
    if (isOwner) {
      const { error } = await supabase
        .from("lobbies")
        .delete()
        .eq("owner", user.id);
      if (error) {
        setError("Failed to disband lobby");
        return;
      }
      // send data that lobby has been closed to web socket
      // that data will then be used to close the web socket connection to the other users
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.close(1000, "Lobby has been disbanded");
      }
      router.push("/protected/play/tic-tac-toe/online");
    } else {
      const { error } = await supabase
        .from("lobby_players")
        .delete()
        .eq("player_id", user.id);
      if (error) {
        setError("Failed to leave lobby");
        return;
      }
      // send data that user has left
      // that data will be used to inform the other players
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.close(1000, "Lobby has been disbanded");
      }
      router.push("/protected/play/tic-tac-toe/online");
    }
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
