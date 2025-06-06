"use client";

import { useSearchParams, useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useGlobal } from "@/app/context/GlobalContext";
import { addFriendAction } from "@/app/actions";

type Profile = {
  id: string;
  username: string;
  favorite_games: string;
  avatar_index: number;
  rank: number;
  matches_played: number;
  joined_date: string;
  friends_count: number;
};

export default function ProfilePageClient() {
  const searchParms = useSearchParams();
  const search = searchParms.get("username");
  const router = useRouter();
  const supabase = createClient();
  const { user, friends, loading, trigger, setTrigger } = useGlobal();

  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  // theme stuff
  const [mounted, setMounted] = useState(false);
  const [friendsStatus, setFriendsStatus] = useState<
    true | false | "Pending" | "AcceptOrReject" | null
  >(null);
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  const lightMode = mounted && (theme === "light" || resolvedTheme === "light");

  useEffect(() => {
    if (loading) return;
    if (localLoading) return;
    if (user?.username === search) router.push("/protected/account");
    const checkFriendshipStatus = async () => {
      if (!user) return;
      if (!profile) return;
      // check if they are friends with our user
      const { data, error } = await supabase
        .from("friends")
        .select("*")
        .or(
          `and(requester.eq.${user.id},receiver.eq.${profile.id}),and(requester.eq.${profile.id},receiver.eq.${user.id})`,
        )
        .single();
      if (data && !error) {
        if (data.status === "accepted") {
          setFriendsStatus(true);
          return;
        } else if (data.status === "pending") {
          if (data.requester === profile.id) {
            setFriendsStatus("AcceptOrReject");
          } else {
            setFriendsStatus("Pending");
          }
          return;
        }
      } else {
        setFriendsStatus(false);
      }
    };
    checkFriendshipStatus();
  }, [loading, localLoading, trigger]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", search)
        .single();
      if (!data || error) {
        router.push("/not-found");
      }
      const date = new Date(data.joined_date);
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setProfile({
        id: data.id,
        username: data.username,
        favorite_games: data.favorite_games,
        avatar_index: data.avatar_index,
        rank: data.rank,
        matches_played: data.matches_played,
        joined_date: formatted,
        friends_count: data.friends_count,
      });
      setLocalLoading(false);
    };
    fetchProfile();
  }, [trigger]);

  const renderFriendButton = () => {
    switch (friendsStatus) {
      case true:
        // remove friend
        return (
          <form
            className="border border-foreground/30 rounded-lg cursor-pointer px-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!profile || !user) return;
              const removeFriend = async () => {
                const { error } = await supabase
                  .from("friends")
                  .delete()
                  .or(
                    `and(requester.eq.${profile.id},receiver.eq.${user.id}),and(requester.eq.${user.id},receiver.eq.${profile.id})`,
                  );
                if (error)
                  alert(
                    "There was an error trying to remove the friend. Please try again later.",
                  );
                setTrigger(!trigger);
              };
              removeFriend();
            }}
          >
            <input type="submit" value="Remove Friend" />
          </form>
        );
      case false:
        // add friend
        return (
          <form
            className="border border-foreground/30 rounded-lg cursor-pointer px-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!profile || !user) return;
              const addFriend = async () => {
                const error = await addFriendAction(profile.username);
                if (error) {
                  alert(error.message);
                } else {
                  setTrigger(!trigger);
                }
              };
              addFriend();
            }}
          >
            <input type="submit" value="Add Friend" />
          </form>
        );
      case "AcceptOrReject":
        // we can accept or reject their request
        return (
          <div className="flex flex-col gap-2">
            <form
              className="border border-foreground/30 rounded-lg px-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!profile || !user) return;
                const acceptRequest = async () => {
                  const error = await addFriendAction(profile.username);
                  if (error) {
                    alert(error.message);
                  } else {
                    setTrigger(!trigger);
                  }
                };
                acceptRequest();
              }}
            >
              <input
                className="cursor-pointer"
                type="submit"
                value="Accept Friend Request"
              />
            </form>{" "}
            <form
              className="border border-foreground/30 rounded-lg cursor-pointer px-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!profile || !user) return;
                const denyRequest = async () => {
                  const { data, error } = await supabase
                    .from("friends")
                    .delete()
                    .eq("requester", profile.id)
                    .eq("receiver", user.id);
                  if (error) alert("Failed to deny request");
                  setTrigger(!trigger);
                };
                denyRequest();
              }}
            >
              <input
                className="cursor-pointer"
                type="submit"
                value="Reject Friend Request"
              />
            </form>
          </div>
        );
      case "Pending":
        return <div>Friend Request Pending</div>;
    }
  };

  return (
    <div className="min-h-screen px-4">
      <div className="flex flex-row gap-4 border-b border-b-foreground/30 w-full justify-evenly p-4">
        <div className="border-r border-r-foreground/30 p-4">
          {!localLoading && profile && user && (
            <div className="flex flex-col gap-4 text-l justify-center items-center">
              <Image
                src={`/account-page/avatar-icons/${profile.avatar_index === 0 ? (lightMode ? profile.avatar_index + "b" : profile.avatar_index + "w") : profile.avatar_index}.png`}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full"
              />{" "}
              {friendsStatus !== null && renderFriendButton()}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 justify-center p-4">
          <div className="flex flex-row gap-2">
            <p>
              {localLoading
                ? ""
                : profile && DOMPurify.sanitize(profile.username)}
            </p>
          </div>
          <p>
            {localLoading
              ? ""
              : profile
                ? `Joined on ${DOMPurify.sanitize(profile.joined_date)}`
                : ""}
          </p>
          <div className="flex flex-row gap-2">
            <p>
              {localLoading
                ? "Their favorite games are..."
                : profile && profile.favorite_games
                  ? `Their favorite games are ${DOMPurify.sanitize(profile.favorite_games)}`
                  : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center border-l border-l-foreground/30 p-4">
          <p>Rank: {localLoading ? "..." : profile ? profile.rank : ""}</p>
          <p>
            Matches Played:{" "}
            {localLoading ? "..." : profile ? profile.matches_played : ""}
          </p>
          <p className="flex flex-row items-center gap-2">
            {profile && `Friends: ${profile.friends_count}`}
          </p>
        </div>
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
