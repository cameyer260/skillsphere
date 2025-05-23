"use client";

import Link from "next/link";
import Image from "next/image";
import FriendsSidebar from "@/components/ui/friends-sidebar";

export default function Home() {
	return (
		<div>
			<div className="flex flex-col sm:flex-row w-full min-h-screen">
				<FriendsSidebar />
				<div className="w-full sm:w-9/12 px-2 text-xl flex justify-center">
					<div className="w-full">
						<h1 className="text-3xl border-b border-b-foreground/30 py-2">
							Top Games
						</h1>
						<div className="m-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 [&>div]:text-center [&>div]:border [&>div]:rounded-lg [&>div]:border-current [&>div]:py-2">
							<div>
								<Link href={"/protected/play/pong"}>
									<Image
										src={"/game-icons/pong/universal.png"}
										width={512}
										height={256}
										alt="pong-icon"
									/>
									<p>Pong</p>
								</Link>
							</div>
							<div>
								<Link href={"/protected/play/tic-tac-toe"}>
									<Image
										src={
											"/game-icons/tic-tac-toe/universal.png"
										}
										width={512}
										height={256}
										alt="tic-tac-toe-icon"
									/>
									<p>Tic Tac Toe</p>
								</Link>
							</div>
							<div>
								<Link href={"/protected/play/chess"}>
									<Image
										src={"/game-icons/chess/universal.png"}
										width={512}
										height={256}
										alt="chess-icon"
									/>
									<p>Chess</p>
								</Link>
							</div>
							{/* <div>
								<Link href={"/protected/play/hangman"}>
									<Image
										src={
											"/game-icons/hangman/universal.png"
										}
										width={512}
										height={256}
										alt="hangman-icon"
									/>
									<p>Hangman</p>
								</Link>
							</div>
							<div>
								<Link href={"/protected/play/snake"}>
									<Image
										src={"/game-icons/snake/universal.png"}
										width={512}
										height={256}
										alt="snake-icon"
									/>
									<p>Snake</p>
								</Link>
							</div>
							<div>
								<Link href={"/protected/play/word"}>
									<Image
										src={"/game-icons/word/universal.png"}
										width={512}
										height={256}
										alt="word-icon"
									/>
									<p>Word</p>
								</Link>
							</div>
							<div>
								<Link href={"/protected/play/sudoku"}>
									<Image
										src={"/game-icons/sudoku/universal.png"}
										width={512}
										height={256}
										alt="sudoku-icon"
									/>
									<p>Sudoku</p>
								</Link>
							</div>
							<div>
								<Link href={"/protected/play/breakout"}>
									<Image
										src={
											"/game-icons/breakout/universal.png"
										}
										width={512}
										height={256}
										alt="breakout-icon"
									/>
									<p>Breakout</p>
								</Link>
							</div>
							<div>
								<Link href={"/protected/play/space-invaders"}>
									<Image
										src={
											"/game-icons/space-invaders/universal.png"
										}
										width={512}
										height={256}
										alt="space-invaders-icon"
									/>
									<p>Space Invaders</p>
								</Link>
							</div> */}
						</div>
					</div>
				</div>
			</div>
			<footer className="text-center flex flex-col"></footer>
		</div>
	);
}
