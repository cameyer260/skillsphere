"use client"

import { useState } from "react";

export default function Pong() {

    const [score, setScore] = useState(0);
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
            <h1 className="text-3xl">Score: {score}</h1>
            <div className="border-2 p-0">
                <canvas>

                </canvas>
            </div>
        </div>
    )
}