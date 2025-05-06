"use client"

import Board from "@/components/ui/games/chess/game-board"

export default function Chess() {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
            <Board />
        </div>
    )
}
