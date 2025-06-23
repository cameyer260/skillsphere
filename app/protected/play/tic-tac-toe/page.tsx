"use client"

import React from 'react';
import { useRouter } from "next/navigation";

export default function TicTacToeModeSelect() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] items-center mt-5 gap-6">
      <h1 className="text-7xl">Chose Your Mode!</h1>
      <div className="flex gap-6 text-4xl [&>button]:shadow-md [&>button]:transition [&>button:hover]:scale-105">
        <button onClick={() => router.push("/protected/play/tic-tac-toe/local")}>Local Play</button>
        <button onClick={() => router.push("/protected/play/tic-tac-toe/online")}>Online Play</button>
      </div>
    </div>
  );
}
