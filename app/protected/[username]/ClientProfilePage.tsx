"use client";

import { createClient } from "@/utils/supabase/client";
import { notFound } from "next/navigation";

export default function ClientProfilePage({ username }: { username: string }) {
  const supabase = createClient();
  return (
    <div>
      <h1>{username}</h1>
    </div>
  );
}
