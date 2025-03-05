"use client"

import { useState, useEffect, MouseEvent } from "react";
import Link from "next/link";
import { Users } from "lucide-react";

export default function FriendsSidebar() {
	const [biggerScreen, setBiggerScreen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

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

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	// Close sidebar when clicking outside
	const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			setIsOpen(false);
		}
	};

	// Desktop version
	if (biggerScreen) {
		return (
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
		);
	}

	// Mobile version
	return (
		<>
			{/* Button that sticks out from the left side */}
			<button
				onClick={toggleSidebar}
				className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-r-lg shadow-lg z-40"
				aria-label="Open friends list"
			>
				<Users size={24} />
			</button>

			{/* Overlay that appears when button is clicked */}
			{isOpen && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-50 z-40 flex"
					onClick={handleOverlayClick}
				>
					<div className="bg-background w-64 h-full overflow-y-auto shadow-lg animate-slide-in-left z-50">
						<div className="flex justify-between items-center p-4 border-b border-b-foreground/30">
							<h1 className="text-xl font-semibold">Friends</h1>
							<button 
								onClick={toggleSidebar}
								className="p-1 rounded-full hover:bg-muted"
							>
								✕
							</button>
						</div>
						<div className="flex flex-col [&>a]:border-b [&>a]:border-b-foreground/10 [&>a]:py-2 [&>a]:px-4">
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
					</div>
				</div>
			)}

			{/* Add animation for the sidebar */}
			<style jsx global>{`
				@keyframes slide-in-left {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(0);
					}
				}
				.animate-slide-in-left {
					animation: slide-in-left 0.3s ease-out;
				}
			`}</style>
		</>
	);
}
