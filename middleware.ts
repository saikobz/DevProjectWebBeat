import { NextResponse } from "next/server";

export async function middleware() {
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabaseEnv) {
    return NextResponse.next();
  }

  // Supabase session refresh and admin checks will be enabled once real auth is configured.
  return NextResponse.next();
}

export const config = {
  matcher: ["/library/:path*", "/orders/:path*", "/account/:path*", "/admin/:path*"]
};