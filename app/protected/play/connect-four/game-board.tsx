import GameTile from "./game-tile";
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
      <div className="inline-grid grid-cols-7">
        {localGameState?.board.map((row, rIndex) => (
          <Fragment key={rIndex}>
            {row.map((color, cIndex) => (
              <GameTile color={color} isLightMode={isLightMode} key={cIndex} r={rIndex} c={cIndex} handleClick={handleClick}/>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
