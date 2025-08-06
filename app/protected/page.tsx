"use client";

import Link from "next/link";
import Image from "next/image";
import FriendsSidebar from "@/components/ui/friends-sidebar";
import { useState } from "react";

const localGames = ["pong", "tic-tac-toe", "connect-four"];
const onlineGames = ["tic-tac-toe", "connect-four"];

export default function Home() {
  const [mode, setMode] = useState<"online" | "local">("online");
  return (
    <div>
      <div className="flex flex-col sm:flex-row w-full min-h-screen">
        <FriendsSidebar />
        <div className="w-full sm:w-9/12 px-2 text-xl flex justify-center">
          <div className="w-full">
            <div className="text-3xl border-b border-b-foreground/30 py-2 pl-2">
              <button
                onClick={() => setMode(mode === "online" ? "local" : "online")}
                className={`border-r border-r-foreground/30 pr-8 ${mode === "local" && "opacity-50"}`}
              >
                Online
              </button>
              <button
                onClick={() => setMode(mode === "online" ? "local" : "online")}
                className={`pl-8 ${mode === "online" && "opacity-50"}`}
              >
                Local
              </button>
            </div>
            <div className="m-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 [&>div]:text-center [&>div]:border [&>div]:rounded-lg [&>div]:border-current [&>div]:py-2">
              {mode === "local" ? (
                <>
                  <div>
                    <Link href="/protected/play/tic-tac-toe/local">
                      <Image
                        src="/game-icons/tic-tac-toe/universal.png"
                        width={512}
                        height={256}
                        alt="tic-tac-toe-icon"
                      />
                    </Link>
                    <p>Tic-Tac-Toe</p>
                  </div>
                  <div>
                    <Link href="/protected/play/pong/local">
                      <Image
                        src="/game-icons/pong/universal.png"
                        width={512}
                        height={256}
                        alt="pong-icon"
                      />
                    </Link>
                    <p>Pong</p>
                  </div>
                  <div>
                    <Link href="/protected/play/connect-four/local">
                      <Image
                        src="/game-icons/connect-four/universal.png"
                        width={512}
                        height={256}
                        alt="connect-four-icon"
                      />
                    </Link>
                    <p>Connect Four</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Link href="/protected/play/tic-tac-toe/online">
                      <Image
                        src="/game-icons/tic-tac-toe/universal.png"
                        width={512}
                        height={256}
                        alt="tic-tac-toe-icon"
                      />
                    </Link>
                    <p>Tic-Tac-Toe</p>
                  </div>
                  <div>
                    <Link href="/protected/play/connect-four/online">
                      <Image
                        src="/game-icons/connect-four/universal.png"
                        width={512}
                        height={256}
                        alt="connect-four-icon"
                      />
                    </Link>
                    <p>Connect Four</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center flex flex-col"></footer>
    </div>
  );
}
