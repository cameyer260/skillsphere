import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useGlobal } from "@/app/context/GlobalContext";
import { LobbyPlayer, GameState  } from "./online/page";
import ErrorBanner from "@/components/error-message";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

export default function GameComponent({
  handleClick,
  localGameState,
  lobbyPlayers,
  localErr,
  setLocalErr,
  backToLobby,
}: {
  handleClick: (r: number, c: number) => string | null;
  localGameState: GameState | null;
  lobbyPlayers: LobbyPlayer[] | null;
  localErr: string | null;
  setLocalErr: Dispatch<SetStateAction<string | null>>;
  backToLobby: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  const lightMode = mounted && (theme === "light" || resolvedTheme === "light");
  const { user } = useGlobal();
  if (!lobbyPlayers || !localGameState) return;
  const [endGame, setEndGame] = useState<boolean>(false);
  const [wonMessage, setWonMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLocalErr(null);
  }, []);

  useEffect(() => {
    if (localGameState.draw) {
      setEndGame(true);
      setWonMessage("Neither player won!");
    }
    if (localGameState.gameWon) {
      setEndGame(true);
      setWonMessage(
        `${localGameState?.gameWon === lobbyPlayers[0].id ? lobbyPlayers[0].username : user?.username} has won!`,
      );
    }
  }, [localGameState.gameWon, localGameState.draw]);
  
  
  const backToHome = () => {
    // just router.push to home
    router.push("/protected");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4">
      {localErr && <ErrorBanner message={localErr} />}
      <div className="h-16 border-b border-b-foreground/30 flex justify-center gap-6 text-3xl pb-4">
        <div
          className={`flex items-center gap-4 ${localGameState[localGameState.turn] === user?.id && "bg-green-500"}`}
        >
          <h1>{user?.username}</h1>
          <Image
            src={`/account-page/avatar-icons/${user?.avatar_index === 0 ? (lightMode ? user?.avatar_index + "b" : user?.avatar_index + "w") : user?.avatar_index}.png`}
            alt="Profile Picture"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div className="flex items-center">
          <h1>vs.</h1>
        </div>
        <div
          className={`flex items-center gap-4 ${localGameState[localGameState.turn] === lobbyPlayers[0]?.id && "bg-green-500"}`}
        >
          <h1>{lobbyPlayers[0].username}</h1>
          <Image
            src={`/account-page/avatar-icons/${lobbyPlayers[0].avatarIndex === 0 ? (lightMode ? lobbyPlayers[0].avatarIndex + "b" : lobbyPlayers[0].avatarIndex + "w") : lobbyPlayers[0].avatarIndex}.png`}
            alt="Profile Picture"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
      </div>
      <div>
      </div>
      {endGame && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 flex-col text-4xl gap-4">
          <h1>{wonMessage}</h1>
          <button onClick={backToLobby} className="border-2 rounded-lg px-2">Back to The Lobby</button>
          <button onClick={backToHome} className="border-2 rounded-lg px-2">Back to Home</button>
        </div>
      )}
    </div>
  );
}
