"use client";

import { createClient } from "../../utils/supabase/client";
import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";

type User = {
  id: string;
  username: string;
  joined_date: string;
  favorite_games: string;
  rank: string;
  matches_played: number;
  friends: number; // for now a number but eventually an array of friend objects
  avatar_index: number;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("id", user?.id)
          .single();
        if (!error) {
          const date = new Date(user.created_at);
          const formatted = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const ranks = ["Bronze", "Silver", "Gold", "Diamond", "Peasant", "Merchant", "Knight", "King", "Emperor", "Demon", "Creator"]; // ranks go as follows. creator is unattainable for regular accounts, only for mine lol.
          const index = Math.floor(data.rank / 10);
          setUser({
            id: user?.id,
            username: !data.username ? "" : data.username,
            joined_date: formatted,
            favorite_games: data.favorite_games,
            rank: `${ranks[index]} ${data.rank}`,
            matches_played: data.matches_played,
            friends: 1000,
            avatar_index: data.avatar_index,
          });
        }
      }

      setLoading(false);
    };

    // setup usecontext to have the users profile data and auth data be saved in global context so it can be added to the navbar and here

    // now create other functions to fetch other shit (fav games, avatar, friends, rank, matches played all that), then called the functions

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
