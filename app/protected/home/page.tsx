export default function Home() {
	return (
		<div className="w-screen bg-white m-0">
			<div className="flex w-full h-screen">
				<div className="w-1/3 bg-red">
					<h1>Games</h1>
				</div>
				<div className="w-1/3 bg-green">
					<h1>Friends</h1>
				</div>
				<div className="w-1/3 bg-blue">
					<h1>Leaderboard</h1>
				</div>
			</div>
			<div className="p-4">
				<h2>More Content Below</h2>
				<p>Your extra text or sections go here...</p>
			</div>
		</div>
	);
}
