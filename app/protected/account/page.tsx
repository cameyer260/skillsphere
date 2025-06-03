"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useGlobal } from "@/app/context/GlobalContext";
import DOMPurify from "dompurify";
import _ from "lodash";
import { addFriendAction } from "@/app/actions";

export default function Account() {
  const supabase = createClient();
  const [nfOverlay, setNfOverlay] = useState<boolean>(false);
  const [editUsernameOverlay, setEditUsernameOverlay] =
    useState<boolean>(false);
  const [editFavGamesOverlay, setEditFavGamesOverlay] =
    useState<boolean>(false);
  const [editPictureOverlay, setEditPictureOverlay] = useState<boolean>(false);
  const [newFriendSearch, setNewFriendSearch] = useState<string>("");
  const [friendSearch, setFriendSearch] = useState<string>("");
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
  const { user, friends, loading, trigger, setTrigger } = useGlobal();
  useEffect(() => {
    setMounted(true);
  }, []);
  const lightMode = mounted && (theme === "light" || resolvedTheme === "light");
  const [newFriendResult, setNewFriendResults] = useState<string[]>([]);
  const [frOverlay, setFrOverlay] = useState<boolean>(false); // use to handle showing current friends or friend requests in nf overlay
  const [frResult, setFrResult] = useState<string[]>([]);

  const handleUsernameSubmit = async () => {
    try {
      if (!user) throw new Error("Error getting session");
      const { error } = await supabase
        .from("profiles")
        .update({ username: newUsername })
        .eq("id", user.id);
      console.log(error);
      if (error?.code === "22001")
        throw new Error("Max length for username is 25 characters");
      if (error?.code === "23505") throw new Error("Username is taken");
      if (error?.code === "23514")
        throw new Error("Username must be at least 4 characters long");
      if (error) throw new Error("Error uploading username");
    } catch (err) {
      if (err instanceof Error) alert(err.message);
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

  const handleSearchNewFriendChange = useCallback(
    _.debounce(async function (searchTerm: string, user) {
      if (searchTerm === "") {
        setNewFriendResults([]);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .ilike("username", `%${searchTerm}%`)
        .not("username", "eq", user?.username);
      if (data) {
        console.log(data);
        const filtered = data
          .filter((el) => !friends?.includes(el.username))
          .map((el) => el.username);
        console.log(filtered);
        setNewFriendResults(filtered);
      }
    }, 400),
    [friends],
  );

  const handleSearchFriendChange = async () => {
    if (friendSearch.length === 0) return;
    // FINISH THIS METHOD
  };

  const removeFriend = async (i: number) => {
    if (!user) return null;
    if (!friends) return null;
    console.log(friends[i]);
    console.log("removeFriend called");
    console.log(user.username);
    // try different approach
    console.log(friends[i].id);
    console.log(user.id);
    const { error } = await supabase
      .from("friends")
      .delete()
      .or(
        `and(requester.eq.${friends[i].id},receiver.eq.${user.id}),and(requester.eq.${user.id},receiver.eq.${friends[i].id})`
      );
    setTrigger(!trigger);
    if (error) alert("There was an error trying to remove the friend. Please try again later.");
  };

  const denyFr = async (i: number) => {
    if (!user) return null;
    const { data: them, error: theirError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", frResult[i])
      .single();
    if (!them) return;
    const { data, error } = await supabase
      .from("friends")
      .delete()
      .eq("receiver", user.id)
      .eq("requester", them.id);
    if (error) alert("Failed to deny request");
    setTrigger(!trigger);
  };

  const acceptFr = async (i: number) => {
    if (!user) return null;
    const { data: them, error: theirError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", frResult[i])
      .single();
    if (!them) return;
    const { data, error } = await supabase
      .from("friends")
      .update({ status: "accepted" })
      .eq("receiver", user.id)
      .eq("requester", them.id);
    if (error) alert("Failed to accept request");
    setTrigger(!trigger);
  };

  // use effect for fetching friend requests
  useEffect(() => {
    if (!user) return;
    const fetchRequests = async () => {
      const { data: frData, error: frError } = await supabase
        .from("friends")
        .select("*")
        .eq("status", "pending")
        .eq("receiver", user.id);
      if (frError) {
        alert("There was an error fetching your friend requests");
        return;
      }
      setFrResult(frData.map((el) => el.requester_username));
      setTimeout(() => {
        handleSearchNewFriendChange("", user); // update new friend search so that we do not accidentally keep displaying or not display a new or old friend
      }, 0);
    };
    fetchRequests();
  }, [trigger, user, friends]);

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
              {loading
                ? "Their favorite games are..."
                : user
                  ? user.favorite_games
                    ? "Their favorite games are " +
                      DOMPurify.sanitize(user.favorite_games)
                    : "Add your favorite games here"
                  : ""}
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
          <p>
            Matches Played: {loading ? "..." : user ? user.matches_played : ""}
          </p>
          <p className="flex flex-row items-center gap-2">
            Friends: {friends?.length}
            <button
              onClick={() => {
                setNfOverlay(true);
                setTrigger(true);
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

        {nfOverlay && user?.username && (
          <div className="absolute w-3/5 h-3/4 border backdrop-blur-md flex flex-row">
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
                    value={newFriendSearch}
                    onChange={(e) => {
                      setNewFriendSearch(e.target.value);
                      handleSearchNewFriendChange(e.target.value, user);
                    }}
                    className="border px-2 outline-none"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <h1 className="text-xl">{newFriendResult.length}</h1>
                  <p>Results</p>
                </div>
              </div>
              <div className="flex-[6] overflow-auto pt-2">
                {newFriendResult.map((_, i) => (
                  <form
                    key={i}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newFriendResult[i]) return;
                      const addFriend = async () => {
                        const error = await addFriendAction(newFriendResult[i]);
                        if (error) {
                          alert(error.message);
                        } else {
                          setTrigger(!trigger);
                        }
                      };
                      addFriend();
                    }}
                    className="flex justify-between mb-1"
                  >
                    {DOMPurify.sanitize(_)}
                    <input
                      type="submit"
                      value="Submit"
                      className="border rounded-lg border-foreground/30 px-2"
                    />
                  </form>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col p-2">
              <div className="flex-1 border-b flex flex-row">
                <div className="flex-[2] flex flex-col px-2 gap-1 justify-center">
                  <div className="flex flex-row gap-2">
                    <button
                      className={`text-xl ${frOverlay && "text-foreground/30"}`}
                      onClick={() => setFrOverlay(!frOverlay)}
                    >
                      Your Friends
                    </button>
                    <button
                      className={`text-xl ${!frOverlay && "text-foreground/30"}`}
                      onClick={() => setFrOverlay(!frOverlay)}
                    >
                      Friend Requests
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="username"
                    value={friendSearch}
                    onChange={(e) => {
                      setFriendSearch(e.target.value);
                      handleSearchFriendChange();
                    }}
                    className="border px-2 outline-none"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  {!frOverlay ? (
                    <>
                      <h1 className="text-xl">{friends?.length}</h1>
                      <p>Friends</p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-xl">{frResult.length}</h1>
                      <p>Friend Requests</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-[6] overflow-auto pt-2">
                {!frOverlay
                  ? friends?.map((_, i) => (
                      <div key={i} className="flex justify-between mb-1">
                        {DOMPurify.sanitize(_.username)}
                        <button
                          onClick={() => removeFriend(i)}
                          className="border rounded-lg border-foreground/30 px-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  : frResult.map((_, i) => (
                      <div key={i} className="flex justify-between mb-1">
                        {DOMPurify.sanitize(_)}
                        <div>
                          <button
                            onClick={() => denyFr(i)}
                            className="border rounded-lg border-foreground/30 px-2"
                          >
                            Deny
                          </button>{" "}
                          <button
                            onClick={() => acceptFr(i)}
                            className="border rounded-lg border-foreground/30 px-2"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        )}

        {nfOverlay && user?.username.length === 0 && (
          <div className="absolute w-1/2 h-3/4 border backdrop-blur-md flex flex-row items-center justify-center text-2xl">
            <button
              onClick={() => setNfOverlay(false)}
              className="absolute top-0 left-0 px-4 border-r border-b text-base"
            >
              X
            </button>
            <h1>
              You need to set your username before trying to manage friends
            </h1>
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
      <div className="flex flex-col p-4">
        <div className="border-b border-b-foreground/30 w-full p-4">
          <h1 className="text-2xl">Monthly Summary</h1>
        </div>
        <div className="flex flex-col items-center justify-center text-xl pt-6">
          <h1>This page is currently under construction</h1>
          <Image
            src={`/account-page/${lightMode ? "wrenchb" : "wrenchw"}.png`}
            width={128}
            height={128}
            alt="Construction icon"
          />
        </div>
      </div>
    </div>
  );
}
