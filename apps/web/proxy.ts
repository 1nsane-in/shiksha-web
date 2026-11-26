import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/admin", "/student", "/parents"] as const;

const publicOnlyRoutes = ["/login", "/register", "/forgot-password", "/auth"] as const;

const roleDefaults: Record<string, string> = {
  admin: "/admin/dashboard",
  super_admin: "/admin/dashboard",
  student: "/student/dashboard",
  parent: "/parents/dashboard",
  parents: "/parents/dashboard",
};


/**
 * Non-sensitive marker cookie set at login. Used for UX routing only — the
 * API is the authorization boundary (tokens are httpOnly, unreadable here).
 */
function roleFromCookie(value?: string): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value).toLowerCase();
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass pathname for not-found page context
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  // Allow public university pages without authentication
  if (pathname.startsWith("/student/university/")) {
    return response;
  }

  const roleMarker = roleFromCookie(request.cookies.get("auth_role")?.value);

  // Admins/parents get their dashboard instead of the marketing home.
  // Lives here so `/` stays statically prerenderable.
  if (pathname === "/" && roleMarker && roleMarker !== "student") {
    const dest = roleDefaults[roleMarker] || "/parents/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Redirect logged-in PARENT/ADMIN from auth-only pages (login, register, etc.)
  // Students are allowed on these pages.
  const isPublicOnly = publicOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isPublicOnly && roleMarker) {
    if (roleMarker !== "student") {
      const dest = roleDefaults[roleMarker] || "/parents/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (!isProtected) return response;

  if (!roleMarker) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = roleMarker;

  // Normalize: JWT stores "PARENT" (singular), route is "/parents" (plural)
  const normalizedRole = role === "parent" ? "parents" : role;

  const routeMatch = protectedRoutes.find((route) =>
    pathname.startsWith(route)
  );
  if (routeMatch) {
    const expectedRole = routeMatch.replace("/", "");
    if (normalizedRole !== expectedRole && role !== "super_admin") {
      const defaultDest = roleDefaults[role];
      if (defaultDest) {
        return NextResponse.redirect(new URL(defaultDest, request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  // "/" is included so logged-in admins/parents get redirected off the static home.
  matcher: ["/", "/admin/:path*", "/student/:path*", "/parents/:path*", "/login", "/register", "/forgot-password", "/auth/:path*"],
};
