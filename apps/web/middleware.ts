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


function decodeToken(token: string): { role?: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass pathname for not-found page context
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  // Allow public university pages without authentication
  if (pathname.startsWith("/student/university/")) {
    return response;
  }

  const token = request.cookies.get("token")?.value;

  // Redirect logged-in PARENT/ADMIN from auth-only pages (login, register, etc.)
  // Students are allowed on these pages.
  const isPublicOnly = publicOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isPublicOnly && token) {
    const payload = decodeToken(token);
    const role = payload?.role?.toLowerCase();
    if (role && role !== "student") {
      const dest = roleDefaults[role] || "/parents/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (!isProtected) return response;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeToken(token);
  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = payload.role?.toLowerCase() ?? "";

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
  matcher: ["/admin/:path*", "/student/:path*", "/parents/:path*", "/login", "/register", "/forgot-password", "/auth/:path*"],
};
