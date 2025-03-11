"use client";

import React from "react";
import { BoardValues } from "./game-board";

interface TileProps {
	digit: BoardValues;
	clickHandler: () => void;
    isLightMode: boolean;
}

const Tile: React.FC<TileProps> = ({ digit, clickHandler, isLightMode }) => {

	return (
		<div
        suppressHydrationWarning
			className={`flex flex-col border-2 rounded-lg ${isLightMode && 'border-black text-black'} w-20 h-24 text-8xl text-center justify-center hover:cursor-pointer hover:opacity-50`}
			onClick={clickHandler}
		>
			{digit}
		</div>
	);
};

export default Tile;
