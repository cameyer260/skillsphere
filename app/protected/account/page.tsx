"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/app/context/UserContext";
import DOMPurify from "dompurify";

export default function Account() {
  const supabase = createClient();
  const [nfOveraly, setNfOverlay] = useState<boolean>(false);
  const [editUsernameOverlay, setEditUsernameOverlay] =
    useState<boolean>(false);
  const [editFavGamesOverlay, setEditFavGamesOverlay] =
    useState<boolean>(false);
  const [editPictureOverlay, setEditPictureOverlay] = useState<boolean>(false);
  const [overallSearch, setOverallSearch] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [games, setGames] = useState<string[]>([
    "Pong",
    "Tic-Tac-Toe",
    "Chess",
  ]);
  const [clickedGames, setClickedGames] = useState<number[]>([]);
  const [clickedAvatar, setClickedAvatar] = useState<number | null>(null);
  // theme stuff
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const { user, loading } = useUser();
  useEffect(() => {
    setMounted(true);
  }, []);
  const lightMode = mounted && (theme === "light" || resolvedTheme === "light");

  const handleUsernameSubmit = async () => {
    try {
      if (!user) throw new Error("Error getting session");
      const { error } = await supabase
        .from("profiles")
        .update({ username: newUsername })
        .eq("id", user.id);
      if (error) throw new Error("Error uploading username");
    } catch (err) {
      alert(err);
      return;
    }
  };
  const handleGamesSubmit = async () => {
    try {
      if (!user) throw new Error("Error getting session");
      const result = clickedGames.map((i) => games[i]).join(", ");
      const { error } = await supabase
        .from("profiles")
        .update({ favorite_games: result })
        .eq("id", user.id);
      if (error) throw new Error("Error uploading favorite games");
    } catch (err) {
      alert(err);
      return;
    }
  };
  const handlePictureSubmit = async () => {
    try {
      if (!user) throw new Error("Error getting session");
      if (!clickedAvatar) throw new Error("No avatar has been selected");
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_index: clickedAvatar + 1 })
        .eq("id", user.id);
      if (error) throw new Error("Error uploading avatar");
    } catch (err) {
      alert(err);
      return;
    }
  };

  return (
    <div className="min-h-screen px-4">
      <div className="flex flex-row gap-4 border-b border-b-foreground/30 w-full justify-evenly p-4">
        <div className="border-r border-r-foreground/30 p-4">
          <button
            onClick={() => {
              setEditPictureOverlay(true);
              setEditFavGamesOverlay(false);
              setEditUsernameOverlay(false);
              setNfOverlay(false);
            }}
          >
            {!loading && user && (
              <Image
                src={`/account-page/avatar-icons/${user.avatar_index === 0 ? (lightMode ? user.avatar_index + "b" : user.avatar_index + "w") : user.avatar_index}.png`}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full"
              />
            )}
          </button>
        </div>
        <div className="flex flex-col gap-2 justify-center p-4">
          <div className="flex flex-row gap-2">
            <p>
              {loading
                ? ""
                : user
                  ? user.username.length !== 0
                    ? DOMPurify.sanitize(user.username)
                    : "Add a username here"
                  : ""}
            </p>
            <button
              onClick={() => {
                setEditUsernameOverlay(true);
                // set all other overlays to false so that the user is unable to have multiple open at one time
                setEditFavGamesOverlay(false);
                setNfOverlay(false);
                setEditPictureOverlay(false);
              }}
            >
              <Image
                src={`/account-page/${lightMode ? "black_edit" : "white_edit"}.png`}
                alt="Edit"
                width={25}
                height={25}
              />
            </button>
          </div>
          <p>
            {loading ? "" : user ? DOMPurify.sanitize(user.joined_date) : ""}
          </p>
          <div className="flex flex-row gap-2">
            <p>
              {loading ? "Their favorite games are..." : user ? user.favorite_games ? "Their favorite games are " + DOMPurify.sanitize(user.favorite_games) : "Add your favorite games here" : ""}
            </p>
            <button
              onClick={() => {
                setEditFavGamesOverlay(true);
                // set all other overlays to false so that the user is unable to have multiple open at one time
                setEditUsernameOverlay(false);
                setNfOverlay(false);
                setEditPictureOverlay(false);
              }}
            >
              <Image
                src={`/account-page/${lightMode ? "black_edit" : "white_edit"}.png`}
                alt="Edit"
                width={25}
                height={25}
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center border-l border-l-foreground/30 p-4">
          <p>Rank: {loading ? "..." : user ? user.rank : ""}</p>
          <p>Matches Played: {loading ? "..." : user ? user.matches_played : ""}</p>
          <p className="flex flex-row items-center gap-2">
            Friends: 1000
            <button
              onClick={() => {
                setNfOverlay(true);
                setEditFavGamesOverlay(false);
                setEditPictureOverlay(false);
                setEditUsernameOverlay(false);
              }}
            >
              <Image
                src={`/account-page/${lightMode ? "black_edit_friend" : "white_edit_friend"}.png`}
                alt="Add new friend"
                width={25}
                height={25}
              />
            </button>
          </p>
        </div>

        {nfOveraly && (
          <div className="absolute w-1/2 h-3/4 border backdrop-blur-md flex flex-row">
            <button
              className="absolute px-4 border-l border-b right-0"
              onClick={() => setNfOverlay(false)}
            >
              X
            </button>
            <div className="flex-1 border-r flex flex-col p-2">
              <div className="flex-1 border-b flex flex-row">
                <div className="flex-[2] flex flex-col px-2 gap-1 justify-center">
                  <h1 className="text-xl">Add New Friend</h1>
                  <input
                    type="text"
                    placeholder="username"
                    value={overallSearch}
                    onChange={(e) => setOverallSearch(e.target.value)}
                    className="border px-2 outline-none"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <h1 className="text-xl">1000</h1>
                  <p>Results</p>
                </div>
              </div>
              <div className="flex-[6] overflow-auto">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div key={i}>Box # {i + 1}</div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col p-2">
              <div className="flex-1 border-b flex flex-row">
                <div className="flex-[2] flex flex-col px-2 gap-1 justify-center">
                  <h1 className="text-xl">Your Friends</h1>
                  <input
                    type="text"
                    placeholder="username"
                    value={overallSearch}
                    onChange={(e) => setOverallSearch(e.target.value)}
                    className="border px-2 outline-none"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <h1 className="text-xl">1000</h1>
                  <p>Friends</p>
                </div>
              </div>
              <div className="flex-[6] overflow-auto">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div key={i}>Box # {i + 1}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {editUsernameOverlay && (
          <div className="absolute w-1/2 h-1/5 border backdrop-blur-md flex flex-col p-4">
            <div className="flex justify-between text-3xl mb-2">
              <h1 className="text-3xl">New Username</h1>
              <button
                className="border border-foreground/30 px-2 rounded-lg"
                onClick={() => setEditUsernameOverlay(false)}
              >
                X
              </button>
            </div>
            <div className="w-full h-full border-t border-t-foreground/30 p-2">
              <form
                onSubmit={handleUsernameSubmit}
                className="space-x-4 space-y-4"
              >
                <input
                  type="text"
                  placeholder="username"
                  name="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="px-2 outline-none text-2xl"
                />
                <button
                  className="text-lg border border-foreground/30 px-2 rounded-lg"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {editFavGamesOverlay && (
          <div className="absolute w-1/2 h-3/4 border backdrop-blur-md flex flex-row">
            <button
              className="absolute px-4 border-l border-b right-0"
              onClick={() => setEditFavGamesOverlay(false)}
            >
              X
            </button>
            <div className="flex-1 flex flex-col p-2">
              <div className="flex-1 border-b flex justify-center items-center text-4xl gap-4">
                <h1>Choose Your Favorite Games!</h1>
                <form onSubmit={handleGamesSubmit}>
                  <button
                    type="submit"
                    className="text-3xl border border-foreground/30 rounded-lg px-2"
                  >
                    Submit
                  </button>
                </form>
              </div>
              <div className="flex-[6] overflow-auto grid grid-cols-3 p-4 gap-4">
                {games.map((game, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg ${clickedGames.includes(i) && "bg-gray-700"} self-start pt-2`}
                  >
                    <button
                      onClick={() => {
                        !clickedGames.includes(i)
                          ? setClickedGames([...clickedGames, i])
                          : setClickedGames(
                              clickedGames.filter((item) => item !== i),
                            );
                      }}
                    >
                      <Image
                        src={`/game-icons/${game.toLowerCase()}/universal.png`}
                        width={256}
                        height={128}
                        alt="game-icon"
                      />
                      <h1 className="text-center text-xl pb-1">{game}</h1>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {editPictureOverlay && (
          <div className="absolute w-1/2 h-3/4 border backdrop-blur-md flex flex-row">
            <button
              className="absolute px-4 border-l border-b right-0"
              onClick={() => setEditPictureOverlay(false)}
            >
              X
            </button>
            <div className="flex-1 flex flex-col p-2">
              <div className="flex-1 border-b flex justify-center items-center text-4xl gap-4">
                <h1>Choose Your Avatar!</h1>
                <form onSubmit={handlePictureSubmit}>
                  <button
                    type="submit"
                    className="text-3xl border border-foreground/30 rounded-lg px-2"
                  >
                    Submit
                  </button>
                </form>
              </div>
              <div className="flex-[6] overflow-auto grid grid-cols-5 p-4 gap-4">
                {Array.from({ length: 27 }).map((_, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg ${clickedAvatar === i && "bg-gray-700"} self-start pt-2`}
                  >
                    <button
                      onClick={() => {
                        clickedAvatar !== i
                          ? setClickedAvatar(i)
                          : setClickedAvatar(null);
                      }}
                    >
                      <Image
                        src={`/account-page/avatar-icons/${i + 1}.png`}
                        width={256}
                        height={128}
                        alt="game-icon"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row p-4">
        <div className="border-b border-b-foreground/30 w-full p-4">
          <h1 className="text-2xl">Monthly Summary</h1>
        </div>
      </div>
    </div>
  );
}
