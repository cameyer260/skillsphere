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

  return (
    <div className="flex items-center gap-4">
      {pathname !== "/sign-up" &&
      pathname !== "/sign-in" &&
      pathname !== "/about" ? (
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
          <>
            {!loading && !isMobile ? (
              user ? (
                user.username ? (
                  <>
                    Hey,{" "}
                    <b>
                      <u>{DOMPurify.sanitize(user.username)}!</u>
                    </b>
                  </>
                ) : (
                  <b>
                    <u>add a username here</u>
                  </b>
                )
              ) : null
            ) : null}
          </>
        </Link>
      ) : (
        <Link href="/about" className="font-semibold">
          About
        </Link>
      )}
      {!loading && authUser && (
        <form action={signOutAction}>
          <Button type="submit" variant={"outline"}>
            Sign out
          </Button>
        </form>
      )}
    </div>
  );
}
