"use client";

import { Fragment, useState, useEffect } from "react";
import Tile from "./game-tile";

export enum BoardValues {
	X = "X",
	O = "O",
	None = "",
}

export type Player = BoardValues.X | BoardValues.O;

export default function Board({
	handleWin,
	resetB,
}: {
	handleWin: (val: BoardValues) => void;
	resetB: boolean;
}) {
	const [turn, setTurn] = useState<Player>(BoardValues.X);
	const [board, setBoard] = useState([
		[BoardValues.None, BoardValues.None, BoardValues.None],
		[BoardValues.None, BoardValues.None, BoardValues.None],
		[BoardValues.None, BoardValues.None, BoardValues.None],
	]);

	useEffect(() => {
		checkBoard();
	}, [board]);

    useEffect(() => {
        resetBoard();
    }, [resetB])

	const checkBoard = () => {
		// first check for vertical win
		if (
			// left col
			board[0][0] === board[1][0] &&
			board[1][0] === board[2][0] &&
			board[0][0] !== BoardValues.None
		) {
			handleWin(board[0][0]);
		}
		if (
			// middle col
			board[0][1] === board[1][1] &&
			board[1][1] === board[2][1] &&
			board[0][1] !== BoardValues.None
		) {
			handleWin(board[0][1]);
		}
		if (
			// right col
			board[0][2] === board[1][2] &&
			board[1][2] === board[2][2] &&
			board[0][2] !== BoardValues.None
		) {
			handleWin(board[0][2]);
		}

		// second check for horizontal win
		for (let row of board) {
			if (
				row[0] === row[1] &&
				row[1] === row[2] &&
				row[0] !== BoardValues.None
			) {
				handleWin(row[0]);
			}
		}

		// lastly check for diagonal
		if (
			board[0][0] === board[1][1] &&
			board[1][1] === board[2][2] &&
			board[0][0] !== BoardValues.None
		) {
			handleWin(board[0][0]);
		}
		if (
			board[2][0] === board[1][1] &&
			board[1][1] === board[0][2] &&
			board[2][0] !== BoardValues.None
		) {
			handleWin(board[2][0]);
		}

        // check if board is full
        let count = 0;
        for (let row of board) {
            if(row[0] !== BoardValues.None && row[1] !== BoardValues.None && row[2] !== BoardValues.None) {
                count++;
            }
        }
        if (count === 3) handleWin(BoardValues.None);

		return null;
	};

	const resetBoard = () => {
		setBoard([
			[BoardValues.None, BoardValues.None, BoardValues.None],
			[BoardValues.None, BoardValues.None, BoardValues.None],
			[BoardValues.None, BoardValues.None, BoardValues.None],
		]);
        setTurn(BoardValues.X);
	};

	return (
		<div className="text-center">
			<h1 className="text-3xl mb-2">Current Turn: {turn}</h1>
			<div className="grid grid-cols-3 gap-2">
				{board.map((row, rIndex) => (
					<Fragment key={rIndex}>
						{row.map((char, cIndex) => (
							<Tile
								digit={char}
								key={cIndex}
								clickHandler={function (): void {
									if (char !== BoardValues.None) return;
									setBoard((prev) => {
										const newBoard = prev.map((row) => [
											...row,
										]);
										newBoard[rIndex][cIndex] = turn;
										return newBoard;
									});
									setTurn(
										turn === BoardValues.X
											? BoardValues.O
											: BoardValues.X
									);
								}}
							/>
						))}
					</Fragment>
				))}
			</div>
		</div>
	);
}
