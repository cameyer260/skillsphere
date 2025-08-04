"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google: any;
    handleSignInWithGoogle: (response: any) => void;
  }
}

export default function GoogleOAuthButton({
  buttonText,
}: {
  buttonText: "signin_with" | "signup_with";
}) {
  const supabase = createClient();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Ensure the callback function is defined on the window object
    // so it can be called by the Google script.
    window.handleSignInWithGoogle = async (response: any) => {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });

      try {
        if (error) {
          throw new Error(`Error signing in with Google: ${error}`);
        } else if (data.user) {
          const res = await fetch("/api/profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: data.user.id }),
          });
          const json = await res.json();
          if (!res.ok)
            throw new Error(
              `Status: ${res.status}. Error message: ${json.error_message}`,
            );
          // Redirect user after successful sign-in.
          window.location.href = "/protected";
        } else throw new Error("Failed to create profile. 'data.user' is null");
      } catch (error) {
        console.log(error);
        alert(error); // TODO: make this more stylish, add an error banner
        await supabase.auth.signOut();
        router.push("/sign-in");
      }
    };

    // Function to initialize and render the Google Sign-In button.
    const renderGoogleButton = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id:
            "488615336590-b397e1ad1dltgcnubgsgnh8q47esirio.apps.googleusercontent.com",
          callback: window.handleSignInWithGoogle,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          shape: "rectangular",
          theme: "outline",
          text: buttonText,
          size: "large",
          logo_alignment: "left",
        });
      }
    };

    // Check if the Google script is already loaded.
    if (
      document.querySelector(
        "script[src='https://accounts.google.com/gsi/client']",
      )
    ) {
      renderGoogleButton();
    } else {
      // If not, create and append the script to the document head.
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      document.head.appendChild(script);
    }
  }, [buttonText, supabase]);

  // The div that will contain the Google button.
  // The 'ref' allows Google's script to target this specific element.
  return <div ref={googleButtonRef}></div>;
}
