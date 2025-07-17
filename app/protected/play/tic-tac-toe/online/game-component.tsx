import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useGlobal } from "@/app/context/GlobalContext";
import GameBoard from "../game-board";

export default function GameComponent() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  const lightMode = mounted && (theme === "light" || resolvedTheme === "light");
  const { user } = useGlobal();
  const [board, setBoard] = useState<string[][]>(() =>
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => "X")),
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4">
      <div className="h-16 border-b border-b-foreground/30 flex justify-center gap-6 text-3xl pb-4">
        <div className="flex items-center gap-4">
          <h1>Christopher Main</h1>
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
        <div className="flex items-center gap-4">
          <h1>Christopher Alt</h1>
          <Image
            src={`/account-page/avatar-icons/${user?.avatar_index === 0 ? (lightMode ? user?.avatar_index + "b" : user?.avatar_index + "w") : user?.avatar_index}.png`}
            alt="Profile Picture"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="max-w-sm mx-auto">
        <GameBoard board={board} isLightMode={lightMode} />
      </div>
    </div>
  );
}
