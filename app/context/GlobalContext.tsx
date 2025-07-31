"use client";

import { createClient } from "../../utils/supabase/client";
import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { usePathname } from "next/navigation";
import type { User as AuthUser } from "@supabase/supabase-js";

export type User = {
  id: string;
  username: string;
  joined_date: string;
  favorite_games: string;
  rank: string;
  matches_played: number;
  avatar_index: number;
};

export type Friend = {
  id: string;
  username: string;
  avatar_index: number;
};

type GlobalContextType = {
  user: User | null;
  authUser: AuthUser | null;
  friends: Friend[] | null;
  isMobile: boolean;
  loading: boolean;
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [trigger, setTrigger] = useState<boolean>(false);

  const supabase = createClient();

  // useEffect to detect mobile users
  useEffect(() => {
    // Check for touch points - primary indicator
    const touchPoints = navigator.maxTouchPoints || 0;
    const isTouchPrimary = touchPoints > 2;

    setIsMobile(isTouchPrimary);
  }, []);

  useEffect(() => {
    if (
      pathname === "/sign-in" ||
      pathname === "/sign-up" ||
      pathname === "/about"
    ) {
      return;
    }
    const fetchData = async () => {
      let attempts = 0;
      let rawUser = null;
      // retry fetching user up to 5 times with 400ms delay, solves problem of fetching user before session is created after sign in
      while (!rawUser && attempts < 5) {
        const { data } = await supabase.auth.getUser();
        rawUser = data.user;
        if (!rawUser) {
          attempts++;
          await new Promise((res) => setTimeout(res, 400));
        }
      }
      if (!rawUser) {
        setLoading(false);
        return;
      }
      setAuthUser(rawUser);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select()
        .eq("id", rawUser?.id)
        .single();
      if (!profileError) {
        const date = new Date(rawUser.created_at);
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const ranks = [
          "Bronze",
          "Silver",
          "Gold",
          "Diamond",
          "Peasant",
          "Merchant",
          "Knight",
          "King",
          "Emperor",
          "Demon",
          "Creator",
        ]; // ranks go as follows. creator is unattainable for regular accounts, only for mine lol.
        const index = Math.floor(profile.rank / 10);
        setUser({
          id: rawUser?.id,
          username: !profile.username ? "" : profile.username,
          joined_date: formatted,
          favorite_games: profile.favorite_games,
          rank: `${ranks[index]} ${profile.rank}`,
          matches_played: profile.matches_played,
          avatar_index: profile.avatar_index,
        });
      }
      const { data: friends, error: friendsError } = await supabase.rpc(
        "get_friends_profiles",
        {},
      );
      if (!friendsError) {
        setFriends(
          friends.map((el: Friend) => {
            return {
              id: el.id,
              username: el.username,
              avatar_index: el.avatar_index,
            };
          }),
        );
      }
      setLoading(false);
    };
    fetchData();
  }, [trigger, pathname]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        authUser,
        friends,
        loading,
        trigger,
        setTrigger,
        isMobile,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobal must be used within a GlobalProvider");
  return context;
};
