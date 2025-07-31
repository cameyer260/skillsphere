import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const publicPaths = ["/sign-in", "/sign-up", "/about", "/privacy-policy", "/", "/terms-of-service"];
  const isPublic = publicPaths.includes(pathname);

  // if they are not logged in and they are not on the about or sign in or sign up page forward them to the sign in page
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  // if they are logged in and they try to go to the homepage "/", forward them to the protected homepage where they can play games
  if (request.nextUrl.pathname === "/" && user) {
    return NextResponse.redirect(new URL("/protected", request.url));
  }
  // if they are not logged in and they try to go to the homepage "/", forward them to the about page (required for oauth)
  if (request.nextUrl.pathname === "/" && !user) {
    return NextResponse.redirect(new URL("/about", request.url));
  }
  return response;
};
