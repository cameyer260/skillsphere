"use client";

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { useGlobal } from "@/app/context/GlobalContext";
import DOMPurify from "dompurify";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AuthButton() {
  const { user, authUser, loading, isMobile } = useGlobal();
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  const lightMode = mounted && (theme === "light" || resolvedTheme === "light");
  const pathname = usePathname();

  if (loading) return null;

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <Link
            href="/protected/account"
            className="flex flex-row items-center gap-4"
          >
            <Image
              src={`/account-page/avatar-icons/${user.avatar_index === 0 ? (lightMode ? user.avatar_index + "b" : user.avatar_index + "w") : user.avatar_index}.png`}
              alt="Profile Picture"
              width={50}
              height={50}
              className="rounded-full pr-2"
            />
            {!isMobile && user.username ? (
              <p>
                Hey,{" "}
                <b>
                  <u>{DOMPurify.sanitize(user.username)}</u>
                </b>
                !
              </p>
            ) : (
              <b>
                <u>Add a username</u>
              </b>
            )}
          </Link>
          <form action={signOutAction}>
            <Button type="submit" variant={"outline"}>
              Sign out
            </Button>
          </form>
        </>
      ) : (
        <Link href="/sign-in" className="font-semibold">
          Sign In
        </Link>
      )}
    </div>
  );
}
