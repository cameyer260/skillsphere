"use client";

import Link from "next/link";
import {
  ArrowRight,
  Gamepad2,
  Users,
  Zap,
  ShieldCheck,
  Rocket,
  Globe,
  UserRound,
  Gauge,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 text-foreground">
      {/* HERO */}
      <section className="relative">
        {/* glow */}
        <div className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-64 w-[36rem] rounded-full bg-primary/20 blur-3xl" />

        <div className="container px-4 py-20 text-center">
          <Badge className="mb-4" variant="secondary">
            Now with friends & real-time lobbies
          </Badge>

          <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            Sharpen your skills with competitive,{" "}
            <span className="text-primary">bite-size games</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-lg">
            Create a profile, add friends, and jump into real-time matches of
            Tic-Tac-Toe, Connect-Four, Chess, and more—without the clutter.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/sign-up">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-in">I already have an account</Link>
            </Button>
          </div>

          {/* value strip (replaces fake metrics) */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-card/50 p-4 text-card-foreground">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">4 games live</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Tic-Tac-Toe, Connect-Four, Pong & more
              </p>
            </div>

            <div className="rounded-2xl border bg-card/50 p-4 text-card-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Add friends</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Add & invite instantly
              </p>
            </div>

            <div className="rounded-2xl border bg-card/50 p-4 text-card-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Realtime lobbies</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Smooth turns with WebSockets
              </p>
            </div>

            <div className="rounded-2xl border bg-card/50 p-4 text-card-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Secure sign-in</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Email/Password or Google OAuth
              </p>
            </div>

            <div className="rounded-2xl border bg-card/50 p-4 text-card-foreground">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Fast & minimal</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Clean UI—no ads, no clutter
              </p>
            </div>

            <div className="rounded-2xl border bg-card/50 p-4 text-card-foreground">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Play anywhere</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Works great on desktop & mobile
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to play better
            </h2>
            <p className="mt-3 text-muted-foreground">
              Clean onboarding, solid stats, and slick profiles—all powered by
              email/password or Google OAuth.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2">
                  <UserRound className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Easy Sign-Up</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Create an account in seconds with Email/Password or Google
                OAuth. We’ll spin up your profile automatically.
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2">
                  <Gauge className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Add Friends</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Connect with friends and invite them to join your games in real
                time.
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Custom Avatars</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Choose your own avatar. Stand out on leaderboards.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* GAME PREVIEWS / CTA */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h3 className="text-2xl font-semibold tracking-tight">
              Pick a game & jump in
            </h3>
            <p className="mt-2 text-muted-foreground">
              Create a lobby and invite a friend.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Tic-Tac-Toe",
                href: "/protected/play/tic-tac-toe/local",
                online: true,
              },
              {
                name: "Connect-Four",
                href: "/protected/play/connect-four/local",
                online: true,
              },
              { name: "Pong", href: "/protected/play/pong", online: false },
            ].map((g) => (
              <Link
                key={g.name}
                href={g.href}
                className="group relative block overflow-hidden rounded-xl border bg-card/60 transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-lg font-semibold">{g.name}</h4>
                    <div className="flex gap-2">
                      <Badge variant="outline">Local</Badge>
                      {g.online && <Badge variant="outline">Online</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Real-time turns, smooth animations.
                  </p>
                  <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                    Play{" "}
                    <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/sign-up">Create your account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-in">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ (tight + minimal) */}
      <section className="border-t bg-muted/30 py-14">
        <div className="container">
          <h4 className="mb-6 text-center text-xl font-semibold">
            Quick answers
          </h4>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Is it free?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Yes. All games and profiles are free to play.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Are there ads?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Nope. Play distraction-free — no pop-ups or banner ads.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} PlaySkillSphere</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
