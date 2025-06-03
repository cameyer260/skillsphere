"use client";

import { createClient } from "../../utils/supabase/client";
import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";

export type User = {
  id: string;
  username: string;
  joined_date: string;
  favorite_games: string;
  rank: string;
  matches_played: number;
  friends: number; // for now a number but eventually an array of friend objects
  avatar_index: number;
};

export type Friend = {
  id: string;
  username: string;
};

type GlobalContextType = {
  user: User | null;
  friends: Friend[] | null;
  loading: boolean;
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [trigger, setTrigger] = useState<boolean>(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select()
          .eq("id", user?.id)
          .single();
        if (!profileError) {
          const date = new Date(user.created_at);
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
            id: user?.id,
            username: !profile.username ? "" : profile.username,
            joined_date: formatted,
            favorite_games: profile.favorite_games,
            rank: `${ranks[index]} ${profile.rank}`,
            matches_played: profile.matches_played,
            friends: 1000,
            avatar_index: profile.avatar_index,
          });
        }
        const { data: friends, error: friendsError } = await supabase
          .from("friends")
          .select("*")
          .eq("status", "accepted")
          .or(`requester.eq.${user.id},receiver.eq.${user.id}`);
        if (!friendsError) {
          setFriends(friends.map((el, i) => {
            return {
              id: user.id === el.requester ? el.receiver : el.requester,
              username: profile.username === el.requester_username ? el.receiver_username : el.requester_username,
            };
          }));
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [trigger]);

  return (
    <GlobalContext.Provider value={{ user, friends, loading, trigger, setTrigger }}>
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
