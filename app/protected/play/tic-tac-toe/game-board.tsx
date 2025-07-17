import Tile from "./tile";
import { Fragment } from "react";

export default function GameBoard({
  board,
  isLightMode,
}: {
  board: string[][];
  isLightMode: boolean;
}) {
  return (
    <div className="text-center">
      <h1 className="text-3xl mb-2">Current Turn: Placeholder Value</h1>
      <div className="inline-grid grid-cols-3 gap-2">
        {board.map((row, rIndex) => (
          <Fragment key={rIndex}>
            {row.map((char, cIndex) => (
              <Tile char={char} isLightMode={isLightMode} key={cIndex} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
