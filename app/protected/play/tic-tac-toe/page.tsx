"use client";

import { useState } from "react";
import Board, {
	BoardValues,
} from "@/components/ui/games/tic-tac-toe/game-board";

export default function TicTacToe() {
	const [winOverlay, setWinOverlay] = useState<BoardValues | null>(null);
	const [reset, setReset] = useState(false);

	return (
		<div className="h-[calc(100vh-4rem)] flex justify-center items-center z-50">
			{winOverlay !== null && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center">
					<div className="h-full flex flex-col items-center pt-40 gap-3">
						<h1 className="text-8xl text-center">
							{winOverlay === BoardValues.None
								? "No one"
								: winOverlay}{" "}
							has won!
						</h1>
						<button
							className="text-2xl border-2 border-white rounded-lg px-2"
							onClick={() => {
								setWinOverlay(null);
								setReset(!reset);
                                document.body.style.overflow = "auto"; // re-enable scrolling
							}}
						>
							Play again
						</button>
					</div>
				</div>
			)}
			<Board
				handleWin={(val) => {
					setWinOverlay(val);
                    document.body.style.overflow = "hidden"; // disable scrolling
				}}
				resetB={reset}
			/>
		</div>
	);
}
