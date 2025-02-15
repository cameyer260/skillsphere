import { useState, useEffect } from "react";
import Link from "next/link";

export default function FriendsSidebar() {
	const [biggerScreen, setBiggerScreen] = useState(false);

	useEffect(() => {
		// Function to check screen size
		const checkScreenSize = () => {
			setBiggerScreen(window.innerWidth >= 768); // 768px is Tailwind's 'md' breakpoint
		};

		// Check screen size on mounts and resize
		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		// Cleanup event listener
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	return (
		<>
			{biggerScreen ? (
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
			) : (
				<div></div>
			)}
		</>
	);
}
