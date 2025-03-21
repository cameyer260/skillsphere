"use client";

import Canvas from "@/components/ui/games/pong/canvas";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type Winner = "Left" | "Right" | null;

export default function Pong() {
	const [leftScore, setLeftScore] = useState(0);
	const [rightScore, setRightScore] = useState(0);
	const [isLandscape, setIsLandscape] = useState(false);
	const [winner, setWinner] = useState<Winner>(null);
	const [mounted, setMounted] = useState(false);
	const { theme, resolvedTheme } = useTheme();
	const [key, setKey] = useState(0);
	const [startGame, setStartGame] = useState(true);

	// Temporary useState to not allow mobile users to play. The game is currently computer-only because it requires w/s keys and up/down arrow keys
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const lightMode =
		mounted && (theme === "light" || resolvedTheme === "light");

	// handle enforcing landscape mode for mobile users
	useEffect(() => {
		const mediaQuery = window.matchMedia("(orientation: landscape)");

		const handleOrientationChange = (e: MediaQueryListEvent) => {
			setIsLandscape(e.matches);
		};

		// Initial check
		setIsLandscape(mediaQuery.matches);

		// Listen for orientation changes
		mediaQuery.addEventListener("change", handleOrientationChange);

		return () => {
			mediaQuery.removeEventListener("change", handleOrientationChange);
		};
	}, []);

	// useEffect to detect mobile users
	useEffect(() => {
		// Check for touch points - primary indicator
		const touchPoints = navigator.maxTouchPoints || 0;
		const isTouchPrimary = touchPoints > 2;

		setIsMobile(isTouchPrimary);
	}, []);

	const resetGame = () => {
		setWinner(null);
		setLeftScore(0);
		setRightScore(0);
		setKey((prev) => prev + 1);
	};

	if (isMobile)
		return (
			<div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
				<h1>
					Pong is currently available only for desktop users. Coming
					to mobile soon!
				</h1>
			</div>
		);

	return (
		<div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
			{isLandscape ? (
				<>
					{winner !== null && (
						<div
							className={`fixed inset-0 ${lightMode ? "bg-white" : "bg-black"} bg-opacity-75 flex flex-col items-center`}
						>
							<div className="h-full flex flex-col items-center pt-40 gap-3">
								<h1 className="text-8xl text-center">
									{winner} has won!
								</h1>
								<button
									className={`text-2xl border-2 ${lightMode ? "border-black" : "border-white"} rounded-lg px-2`}
									onClick={resetGame}
								>
									Play again
								</button>
							</div>
						</div>
					)}
					{startGame && (
						<div
							className={`fixed inset-0 ${lightMode ? "bg-white" : "bg-black"} bg-opacity-75 flex flex-col items-center`}
						>
							<div className="h-full flex flex-col items-center pt-40 gap-3">
								<h1 className="text-8xl text-center">
									Pong game
								</h1>
                                <p>Local play only. W/S control the left paddle, arrow up/arrow down control the right paddle.</p>
								<button
									className={`text-2xl border-2 ${lightMode ? "border-black" : "border-white"} rounded-lg px-2`}
                                    onClick={() => {
                                        setStartGame(false);
                                        resetGame();
                                    }}
								>
									Play
								</button>
							</div>
						</div>
					)}
					<h1 className="text-3xl">
						Score: {leftScore}-{rightScore}
					</h1>
					<Canvas
						leftScore={leftScore}
						setLeftScore={setLeftScore}
						rightScore={rightScore}
						setRightScore={setRightScore}
						setWinner={setWinner}
						key={key}
					/>
				</>
			) : (
				<>
					<h1>
						This game is meant to be played in landscape mode.
						Please tilt your screen to landscape mode to play.
					</h1>
				</>
			)}
		</div>
	);
}
