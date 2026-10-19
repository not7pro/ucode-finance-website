import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const demoRole = request.cookies.get("ucode_demo_role")?.value;
  const path = request.nextUrl.pathname;

  // Protect internal routes
  const isAuthenticated = Boolean(user || demoRole);
  if (!isAuthenticated && (path.startsWith("/founder") || path.startsWith("/employee") || path.startsWith("/portal"))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectedFrom", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Enforce role boundary matrix
  const effectiveRole = user?.user_metadata?.role || demoRole;
  if (effectiveRole) {
    if (path.startsWith("/founder") && effectiveRole !== "founder") {
      const fallback = effectiveRole === "employee" ? "/employee/today" : "/portal";
      return NextResponse.redirect(new URL(fallback, request.url));
    }
    if (path.startsWith("/employee") && effectiveRole !== "employee" && effectiveRole !== "founder") {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
    if (path.startsWith("/portal") && effectiveRole !== "client" && effectiveRole !== "founder") {
      return NextResponse.redirect(new URL("/employee/today", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
