"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

declare global {
  interface Window {
    handleSignInWithGoogle: (response: any) => void;
  }
}

export default function GoogleOAuthButton() {
  const supabase = createClient();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    window.handleSignInWithGoogle = async (response) => {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });

      if (error) {
        console.log(error);
      } else {
        window.location.href = "/protected";
      }
    };
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <script src="https://accounts.google.com/gsi/client" async></script>
      <div
        id="g_id_onload"
        data-client_id="488615336590-b397e1ad1dltgcnubgsgnh8q47esirio.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-auto_prompt="false"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </div>
  );
}
