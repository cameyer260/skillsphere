"use client";

import { useSearchParams, useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

type Profile = {
  id: string;
  username: string;
  favorite_games: string;
  avatar_index: number;
  rank: number;
  matches_played: number;
  joined_date: string;
};

export default function ProfilePageClient() {
  const searchParms = useSearchParams();
  const search = searchParms.get("username");
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  // theme stuff
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  const lightMode = mounted && (theme === "light" || resolvedTheme === "light");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", search)
        .single();
      console.log(data);
      console.log(error);
      if (!data || error) {
        console.log("not found being called");
        router.push("/not-found");
      }
      setProfile({
        id: data.id,
        username: data.username,
        favorite_games: data.favorite_games,
        avatar_index: data.avatar_index,
        rank: data.rank,
        matches_played: data.matches_played,
        joined_date: data.joined_dated,
      });
      setLoading(false);
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen px-4">
      <div className="flex flex-row gap-4 border-b border-b-foreground/30 w-full justify-evenly p-4">
        <div className="border-r border-r-foreground/30 p-4">
          {!loading && profile && (
            <Image
              src={`/account-page/avatar-icons/${profile.avatar_index === 0 ? (lightMode ? profile.avatar_index + "b" : profile.avatar_index + "w") : profile.avatar_index}.png`}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full"
            />
          )}
        </div>
        <div className="flex flex-col gap-2 justify-center p-4">
          <div className="flex flex-row gap-2">
            <p>
              {loading ? "" : profile && DOMPurify.sanitize(profile.username)}
            </p>
          </div>
          <p>
            {loading
              ? ""
              : profile
                ? DOMPurify.sanitize(profile.joined_date)
                : ""}
          </p>
          <div className="flex flex-row gap-2">
            <p>
              {loading
                ? "Their favorite games are..."
                : profile && profile.favorite_games
                  ? `Their favorite games are ${DOMPurify.sanitize(profile.favorite_games)}`
                  : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center border-l border-l-foreground/30 p-4">
          <p>Rank: {loading ? "..." : profile ? profile.rank : ""}</p>
          <p>
            Matches Played: {loading ? "..." : profile ? profile.matches_played : ""}
          </p>
          <p className="flex flex-row items-center gap-2">
            Friends: {"I need to added friends count on profiles"}
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
