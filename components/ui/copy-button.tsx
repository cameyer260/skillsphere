import Image from "next/image";
import { useState } from "react";

export default function CopyButton({
  lightMode,
  code,
}: {
  lightMode: boolean;
  code: string | null;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://playskillsphere.com/protected/play/tic-tac-toe/online?code=${code}`,
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
