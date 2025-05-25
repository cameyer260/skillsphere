import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "./context/UserContext";
import Link from "next/link";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://playskillsphere.com"),
  title: "playskillsphere",
  description: "A fun way to play games with your friends!",
  icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <div className="w-full flex justify-center border-b border-b-foreground/30 min-h-16">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  <Link href={"/"}>Home</Link>
                  <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                  </div>
                </div>
                <HeaderAuth />
              </div>
            </div>
            {children}
            <Analytics />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
