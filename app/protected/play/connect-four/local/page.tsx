"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Fragment } from "react";
import ErrorBanner from "@/components/error-message";
import { useRouter } from "next/navigation";

function GameTile({
  color,
  isLightMode,
  r,
  c,
  handleClick,
}: {
  color: string | null;
  isLightMode: boolean;
  r: number;
  c: number;
  handleClick: (r: number, c: number) => void;
}) {
  return (
    <div
      className={`flex flex-col border-2 ${isLightMode && "border-black text-black"} w-20 h-16 text-xl text-center justify-center hover:cursor-pointer hover:opacity-50 items-center`}
      onClick={() => handleClick(r, c)}
    >
      <div
        className={`w-16 h-16 rounded-full ${color === "red" ? "bg-red-500" : color === "yellow" ? "bg-yellow-500" : ""}`}
      ></div>
    </div>
  );
}

function GameBoard({
  isLightMode,
  handleClick,
  gameState,
}: {
  isLightMode: boolean;
  handleClick: (r: number, c: number) => void;
  gameState: GameState;
}) {
  return (
    <div className="text-center">
      <h1 className="text-3xl mb-2">
        Current Turn:{" "}
        {gameState.turn[0].toUpperCase() + gameState.turn.slice(1)}
      </h1>
      <div className="inline-grid grid-cols-7">
        {gameState?.board.map((row, rIndex) => (
          <Fragment key={rIndex}>
            {row.map((color, cIndex) => (
              <GameTile
                color={color}
                isLightMode={isLightMode}
                key={cIndex}
                r={rIndex}
                c={cIndex}
                handleClick={handleClick}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

interface GameState {
  board: (string | null)[][];
  turn: "red" | "yellow";
  gameWon: string | null;
  draw: boolean;
  player: string;
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  const lightMode = mounted && (theme === "light" || resolvedTheme === "light");

  const redFirst = Math.random() < 0.5 ? true : false;
  const playerIsRed = Math.random() < 0.5 ? true : false;
  const initialGs: GameState = {
    board: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
    ],
    turn: redFirst ? "red" : "yellow",
    gameWon: null,
    draw: false,
    player: playerIsRed ? "red" : "yellow",
  };

  const [localErr, setLocalErr] = useState<string | null>(null);
  const [gs, setGs] = useState<GameState>(initialGs);
  const [endGameReached, setEndGameReached] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (gs.gameWon) setEndGameReached(true);
  }, [gs.gameWon, gs.draw]);

  const cfGameWon = () => {
    // make a copy
    const newState = { ...gs, board: gs.board.map((row) => [...row]) };

    const rows = newState.board.length;
    const cols = newState.board[0].length;
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    const inBounds = (r: number, c: number) =>
      r >= 0 && r < rows && c >= 0 && c < cols;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = newState.board[r][c];
        if (!color) continue;

        for (const [dr, dc] of directions) {
          // check the next 3 cells in the direction (total run of 4)
          let k = 1;
          for (; k < 4; k++) {
            const nr = r + dr * k;
            const nc = c + dc * k;
            if (!inBounds(nr, nc) || gs.board[nr][nc] !== color) break;
          }
          if (k === 4) {
            newState.gameWon = color;
            setGs(newState);
            return;
          }
        }
      }
    }

    // check for draw
    let oneEmpty = false;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (!newState.board[r][c]) oneEmpty = true;
      }
    }
    !newState.gameWon && !oneEmpty
      ? (newState.draw = true)
      : (newState.draw = false); // if no one has one and there is not a single empty space in the board, we have reached a draw
    setGs(newState);
  };

  const handleClick = (r: number, c: number): void => {
    try {
      // first, validate move
      if (!gs || r < 0 || r > 5 || c < 0 || c > 6)
        throw new Error("Move out of bounds.");

      // second make sure the spot on the board is open
      if (gs.board[r][c]) throw new Error("Spot is not open.");

      // third make sure there is a piece under it or it's the bottom row (row 5)
      if (r < 5 && !gs.board[r + 1][c]) throw new Error("Invalid move");

      // all tests passed, move is approved
      gs.board[r][c] = gs.turn;
      gs.turn === "red" ? (gs.turn = "yellow") : (gs.turn = "red");

      // now check for win
      cfGameWon();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(err);
      setLocalErr(msg);
    }
  };

  return (
    <div className="p-8">
      {localErr && <ErrorBanner message={localErr} />}
      {endGameReached && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-60" />
          <span className="relative text-white text-6xl font-semibold flex flex-col gap-2 items-center">
            {gs.draw
              ? "Draw!"
              : `${gs && gs.gameWon && gs.gameWon[0].toUpperCase() + gs.gameWon.slice(1)} has won!`}
            <button
              onClick={() => {
                const redFirst = Math.random() < 0.5 ? true : false;
                const playerIsRed = Math.random() < 0.5 ? true : false;
                const initialGs: GameState = {
                  board: [
                    [null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null],
                  ],
                  turn: redFirst ? "red" : "yellow",
                  gameWon: null,
                  draw: false,
                  player: playerIsRed ? "red" : "yellow",
                };
                setGs(initialGs);
                setEndGameReached(false);
              }}
              className="border rounded-lg text-2xl px-2"
            >
              Play Again
            </button>
            <button
              onClick={() => router.push("/protected")}
              className="border rounded-lg text-2xl px-2"
            >
              Back to Home
            </button>
          </span>
        </div>
      )}
      <GameBoard
        isLightMode={lightMode}
        handleClick={handleClick}
        gameState={gs}
      />
    </div>
  );
}
