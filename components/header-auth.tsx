"use client";

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { useUser } from "@/app/context/UserContext";
import DOMPurify from "dompurify";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function AuthButton() {
  const { user, loading } = useUser();
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  const lightMode = mounted && (theme === "light" || resolvedTheme === "light");

  return (
    <div className="flex items-center gap-4">
      <Link href="/protected/account" className="flex flex-row items-center">
        {!loading && user && (
          <Image
            src={`/account-page/avatar-icons/${user.avatar_index === 0 ? (lightMode ? user.avatar_index + "b" : user.avatar_index + "w") : user.avatar_index}.png`}
            alt="Profile Picture"
            width={50}
            height={50}
            className="rounded-full pr-2"
          />
        )}
        Hey,{" "}
        {loading ? (
          "..."
        ) : user ? (
          user.username ? (
            <b>
              <u>{DOMPurify.sanitize(user.username)}</u>
            </b>
          ) : (
            <b>
              <u>add a username here</u>
            </b>
          )
        ) : (
          <b>
            <u>error fetching user</u>
          </b>
        )}
        <b>
          <u>!</u>
        </b>
      </Link>{" "}
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  );
}
