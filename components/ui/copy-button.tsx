import { Game } from "@/types/game";
import Image from "next/image";
import { useState } from "react";

export default function CopyButton({
  lightMode,
  code,
  game,
}: {
  lightMode: boolean;
  code: string | null;
  game: Game;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/protected/play/${game}/online?code=${code}`,
      );
      setCopied(true);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (!code) return;
  return !copied ? (
    <button onClick={handleCopy}>
      <Image
        src={`/lobby-page/${lightMode ? "black" : "white"}-copy.png`}
        alt="Copy"
        width={25}
        height={25}
      />
    </button>
  ) : (
    <button onClick={handleCopy}>
      <Image
        src={`/lobby-page/${lightMode ? "black" : "white"}-check.png`}
        alt="Copy"
        width={25}
        height={25}
      />
    </button>
  );
}
