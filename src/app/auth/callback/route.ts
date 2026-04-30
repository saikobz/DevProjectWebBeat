import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/library";
  if (!next.startsWith("/")) {
    next = "/library";
  }

  if (!url || !anonKey || !code) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocal = process.env.NODE_ENV === "development";
  const redirectBase = isLocal ? origin : forwardedHost ? `https://${forwardedHost}` : origin;
  const redirectUrl = `${redirectBase}${next}`;

  const cookieStore = await cookies();
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  return response;
}
