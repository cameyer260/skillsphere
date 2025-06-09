"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/utils/supabase/service_role";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }
  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const supabaseAdmin = await createServiceRoleClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // now try to insert their profile if it does not already exist
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError || !sessionData.session?.user?.id) {
    return encodedRedirect("error", "/sign-in", "Failed to fetch session.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userData && !userError) {
    // use service role to bypass rls policies and to use its (granted) access on auth.users which is needed in this context
    const { error: insertError } = await supabaseAdmin
      .from("profiles")
      .insert({ id: userData.user.id});

    if (insertError && insertError.code !== '23505') {
      console.error("Failed to create profile:", insertError.message);
      return encodedRedirect("error", "/sign-up", "Failed to create profile.");
    }
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });
  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const addFriendAction = async (
  username: string,
): Promise<Error | null> => {
  // error = failure, null = success
  if (!username || username.length === 0)
    return new Error("Username cannot be empty");
  const supabase = await createClient();
  const { data: ourUser, error: ourUserError } = await supabase.auth.getUser();
  if (!ourUser || !ourUser.user) return new Error("Failed to add friend");
  const { data: ourData, error: ourError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", ourUser.user.id)
    .single();
  const { data: theirData, error: theirError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .single();
  if (ourError || theirError) return new Error("Failed to add friend");
  // first check for an incoming friend request from this account they would like to add, if there is one, just accept it
  const { data: incomingReqs, error: incomingRError } = await supabase
    .from("friends")
    .select("*")
    .eq("receiver", ourUser.user.id)
    .eq("requester", theirData.id)
    .single();
  if (incomingReqs && !incomingRError) {
    const { data: res, error: resError } = await supabase
      .from("friends")
      .update({ status: "accepted" })
      .eq("receiver", ourUser.user.id)
      .eq("requester", theirData.id);
    if (!resError) return null;
    return new Error("Failed to accept request incoming request");
  }
  // case that there was no incoming friend req, post one to db here
  if (!incomingReqs && incomingRError?.code === "PGRST116") {
    const { data: res, error: resError } = await supabase
      .from("friends")
      .insert({
        requester: ourUser.user.id,
        receiver: theirData.id,
      });
    if (!resError) return null;
    return new Error("Request has already been sent");
  }
  return new Error("Failed to add friend");
};
