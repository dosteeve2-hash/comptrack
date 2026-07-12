import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder",
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  const isDashboardRoute = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/factures") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/rapports") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/parametres") ||
    pathname.startsWith("/apprendre") ||
    pathname.startsWith("/onboarding");

  if (isDashboardRoute && !user) {
    // In demo mode with placeholder keys, allow access
    const hasRealKeys =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "http://placeholder.supabase.co";
    if (hasRealKeys) {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === "/connexion" || pathname === "/inscription")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
