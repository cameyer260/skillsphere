import Tile from "./tile";
import { Fragment } from "react";
import { GameState } from "./online/page";

export default function GameBoard({
  isLightMode,
  handleClick,
  localGameState,
}: {
  isLightMode: boolean;
  handleClick: (r: number, c: number) => string | null;
  localGameState: GameState | null;
}) {
  return (
    <div className="text-center">
      <h1 className="text-3xl mb-2">Current Turn: Placeholder Value</h1>
      <div className="inline-grid grid-cols-3 gap-2">
        {localGameState?.board.map((row, rIndex) => (
          <Fragment key={rIndex}>
            {row.map((char, cIndex) => (
              <Tile char={char} isLightMode={isLightMode} key={cIndex} r={rIndex} c={cIndex} handleClick={handleClick}/>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
