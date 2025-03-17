"use client";

import { useEffect, useRef, useCallback } from "react";
import Paddle from "./paddle";
import Ball from "./ball";
import { Winner } from "@/app/protected/play/pong/page";

export default function Canvas({
	leftScore,
	setLeftScore,
	rightScore,
	setRightScore,
	setWinner,
}: {
	leftScore: number;
	setLeftScore: (n: number) => void;
	rightScore: number;
	setRightScore: (n: number) => void;
	setWinner: (w: Winner) => void;
}) {
	// Container, parent div, and animationFrame refs
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationFrameId = useRef<number>();

	// Paddle and ball refs
	const leftPaddleRef = useRef<Paddle | null>(null);
	const rightPaddleRef = useRef<Paddle | null>(null);
	const gameBallRef = useRef<Ball | null>(null);
    const turnRef = useRef(false);

	// Object to keep track of what key is currently pressed (used for movement)
	const keysPressed = useRef({
		w: false,
		s: false,
		ArrowUp: false,
		ArrowDown: false,
	});

	// Store score state in refs to avoid closure issues
	const leftScoreRef = useRef(leftScore);
	const rightScoreRef = useRef(rightScore);

	// Update refs when props change
	useEffect(() => {
		leftScoreRef.current = leftScore;
		rightScoreRef.current = rightScore;
	}, [leftScore, rightScore]);

	const handleScore = useCallback(() => {
		if (!gameBallRef.current) return;

        turnRef.current = !turnRef.current;

		if (gameBallRef.current.xVelocity > 0) {
			// Ball is moving right, thus left paddle has scored
			setLeftScore(leftScoreRef.current + 1);
		} else {
			// Ball is moving left, thus right paddle has scored
			setRightScore(rightScoreRef.current + 1);
		}

		// Cancel the current animation frame
		if (animationFrameId.current) {
			cancelAnimationFrame(animationFrameId.current);
			animationFrameId.current = undefined;
		}

		// Re-initialize game objects
		gameBallRef.current = new Ball(canvasRef.current, turnRef.current);

		// Restart the game loop after a short delay
		setTimeout(() => {
			if (!animationFrameId.current) {
				animationFrameId.current = requestAnimationFrame(gameLoop);
			}
		}, 3000);
	}, [setLeftScore, setRightScore]);

	const gameLoop = useCallback(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");

		if (
			!canvas ||
			!context ||
			!leftPaddleRef.current ||
			!rightPaddleRef.current ||
			!gameBallRef.current
		)
			return;

		// Clear canvas
		context.fillStyle = "black";
		context.fillRect(0, 0, canvas.width, canvas.height);

		// Move paddles and ball
		if (keysPressed.current.w) leftPaddleRef.current?.moveUp();
		if (keysPressed.current.s) leftPaddleRef.current?.moveDown(canvas);
		if (keysPressed.current.ArrowUp) rightPaddleRef.current?.moveUp();
		if (keysPressed.current.ArrowDown)
			rightPaddleRef.current?.moveDown(canvas);
		gameBallRef.current.move(canvas, handleScore);

		// Detect collision between ball and paddles
		leftPaddleRef.current.detectCollision(gameBallRef.current);
		rightPaddleRef.current.detectCollision(gameBallRef.current);

		// Draw game objects
		context.fillStyle = "white";
		leftPaddleRef.current.draw(context);
		rightPaddleRef.current.draw(context);
		gameBallRef.current.draw(context);

		// Continue the game loop
		animationFrameId.current = requestAnimationFrame(gameLoop);
	}, [handleScore]);

	useEffect(() => {
		const updateCanvas = () => {
			const canvas = canvasRef.current;
			const container = containerRef.current;

			if (!canvas || !container) return;

			const rect = container.getBoundingClientRect();
			canvas.width = rect.width;
			canvas.height = rect.height;
		};

		updateCanvas();

		const handleKeydown = (event: KeyboardEvent) => {
			const key = event.key.toLowerCase();
			if (
				key === "w" ||
				key === "s" ||
				key === "arrowup" ||
				key === "arrowdown"
			) {
				event.preventDefault();
				keysPressed.current[
					key === "arrowup"
						? "ArrowUp"
						: key === "arrowdown"
							? "ArrowDown"
							: key
				] = true;
			}
		};

		const handleKeyup = (event: KeyboardEvent) => {
			const key = event.key.toLowerCase();
			if (
				key === "w" ||
				key === "s" ||
				key === "arrowup" ||
				key === "arrowdown"
			) {
				event.preventDefault();
				keysPressed.current[
					key === "arrowup"
						? "ArrowUp"
						: key === "arrowdown"
							? "ArrowDown"
							: key
				] = false;
			}
		};

		// Initialize game objects
		gameBallRef.current = new Ball(canvasRef.current, turnRef.current);
		leftPaddleRef.current = new Paddle("left", canvasRef.current);
		rightPaddleRef.current = new Paddle("right", canvasRef.current);

		// Add event listeners
		window.addEventListener("keydown", handleKeydown);
		window.addEventListener("keyup", handleKeyup);

		// Start game loop
		animationFrameId.current = requestAnimationFrame(gameLoop);

		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
			window.removeEventListener("keydown", handleKeydown);
			window.removeEventListener("keyup", handleKeyup);
		};
	}, [gameLoop]);

    useEffect(() => {
        if (leftScore >= 5) {
            setWinner("Left");
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        } else if (rightScore >= 5) {
            setWinner("Right");
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }
    }, [leftScore, rightScore])

	return (
		<div
			ref={containerRef}
			className="border-2 w-[50vw] md:w-[65vw] max-w-[1200px] aspect-[16/9]"
		>
			<canvas ref={canvasRef} className="w-full h-full" />
		</div>
	);
}
