import Link from "next/link";
import Image from "next/image";

export default function Home() {
	return (
		<div>
			<div className="flex flex-row w-full">
				<div className="w-3/12 border-r border-r-foreground/30 flex flex-col text-xl px-2 [&>a]:border-b [&>a]:border-b-foreground/10 [&>a]:py-2">
					<h1 className="text-3xl border-b border-b-foreground/30 py-2">
						Friends
					</h1>
					<Link href={"/DNE"}>catalina</Link>
					<Link href={"/DNE"}>christopher</Link>
					<Link href={"/DNE"}>leon</Link>
					<Link href={"/DNE"}>paola</Link>
					<Link href={"/DNE"}>catalina</Link>
					<Link href={"/DNE"}>christopher</Link>
					<Link href={"/DNE"}>leon</Link>
					<Link href={"/DNE"}>paola</Link>
					<Link href={"/DNE"}>catalina</Link>
					<Link href={"/DNE"}>christopher</Link>
					<Link href={"/DNE"}>leon</Link>
					<Link href={"/DNE"}>paola</Link>
					<Link href={"/DNE"}>catalina</Link>
					<Link href={"/DNE"}>christopher</Link>
					<Link href={"/DNE"}>leon</Link>
					<Link href={"/DNE"}>paola</Link>
					<Link href={"/DNE"}>catalina</Link>
					<Link href={"/DNE"}>christopher</Link>
					<Link href={"/DNE"}>leon</Link>
					<Link href={"/DNE"}>paola</Link>
					<Link href={"/DNE"}>catalina</Link>
					<Link href={"/DNE"}>christopher</Link>
					<Link href={"/DNE"}>leon</Link>
					<Link href={"/DNE"}>paola</Link>
					<Link href={"/DNE"}>catalina</Link>
					<Link href={"/DNE"}>christopher</Link>
					<Link href={"/DNE"}>leon</Link>
					<Link href={"/DNE"}>paola</Link>
					<Link href={"/DNE"}>catalina</Link>
					<Link href={"/DNE"}>christopher</Link>
					<Link href={"/DNE"}>leon</Link>
					<Link href={"/DNE"}>paola</Link>
					<Link href={"/DNE"}>catalina</Link>
					<Link href={"/DNE"}>christopher</Link>
					<Link href={"/DNE"}>leon</Link>
					<Link href={"/DNE"}>paola</Link>
				</div>
				<div className="w-9/12 px-2 text-xl">
					<h1 className="text-3xl border-b border-b-foreground/30 py-2">
						Top Games
					</h1>
					<div className="m-2 grid grid-cols-4 gap-4 p-4 [&>div]:text-center [&>div]:border [&>div]:rounded-lg [&>div]:border-current [&>div]:py-2">
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
						<div>
							<Link href={"/protected/play/hangman"}>
								<Image
									src={"/game-icons/hangman/universal.png"}
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
							<Link href={"/protected/play/breakout"}>
								<Image
									src={"/game-icons/breakout/universal.png"}
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
						</div>
					</div>
				</div>
			</div>
			<footer className="text-center flex flex-col">
				<h1>
					this is the footer that is only for this page, it's not
					finished yet and i need to create the footer for the whole
					website too
				</h1>
				<a
					href="https://www.flaticon.com/free-icons/chess"
					title="chess icons"
				>
					Chess icons created by bqlqn - Flaticon
				</a>
				<a
					href="https://www.flaticon.com/free-icons/hangman"
					title="hangman icons"
				>
					Hangman icons created by Freepik - Flaticon
				</a>
				<a
					href="https://www.flaticon.com/free-icons/snake"
					title="snake icons"
				>
					Snake icons created by Freepik - Flaticon
				</a>
				<a
					href="https://www.flaticon.com/free-icons/tic-tac-toe"
					title="tic tac toe icons"
				>
					Tic tac toe icons created by Freepik - Flaticon
				</a>
				<a
					href="https://www.flaticon.com/free-icons/scrabble"
					title="scrabble icons"
				>
					Scrabble icons created by Flat Icons - Flaticon
				</a>
				<a
					href="https://www.flaticon.com/free-icons/sudoku"
					title="sudoku icons"
				>
					Sudoku icons created by Freepik - Flaticon
				</a>
				<a
					href="https://www.flaticon.com/free-icons/ping-pong"
					title="ping pong icons"
				>
					Ping pong icons created by Freepik - Flaticon
				</a>
				<a
					href="https://www.flaticon.com/free-icons/breakout-room"
					title="breakout room icons"
				>
					Breakout room icons created by Creatype - Flaticon
				</a>
				<a
					href="https://www.flaticon.com/free-icons/space-invaders"
					title="space invaders icons"
				>
					Space invaders icons created by Freepik - Flaticon
				</a>
			</footer>
		</div>
	);
}
